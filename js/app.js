/**
 * 都留市 お悔やみハンドブック - 統合アプリケーションスクリプト
 * file:// プロトコル（直接ダブルクリック）および http:// (GitHub Pages) の両方で完全動作
 */

(function () {
  'use strict';

  // --- 1. マスターデータ ---
  const TSURU_CITY_INFO = {
    name: "都留市役所",
    address: "〒402-8501 山梨県都留市上谷一丁目1番1号",
    phone: "0554-43-1111",
    hours: "午前8時30分～午後5時15分（土・日・祝日・年末年始を除く）",
    website: "https://www.city.tsuru.yamanashi.jp/"
  };

  const CATEGORIES = [
    { id: "all", name: "すべて表示" },
    { id: "住民票・戸籍", name: "住民票・戸籍" },
    { id: "国保・医療・葬祭費", name: "国保・医療・葬祭費" },
    { id: "年金", name: "年金" },
    { id: "介護・福祉", name: "介護・福祉" },
    { id: "税金", name: "税金" },
    { id: "インフラ・生活", name: "インフラ・生活" },
    { id: "相続・その他", name: "相続・その他" }
  ];

  const DEADLINES = [
    { id: "all", name: "すべての期限" },
    { id: "7days", name: "7日以内（すみやかに）" },
    { id: "14days", name: "14日以内" },
    { id: "midterm", name: "年内・数ヶ月以内" },
    { id: "longterm", name: "中長期・随時" }
  ];

  const QUESTIONS = [
    {
      id: "age",
      text: "亡くなられた方の年齢はおいくつでしたか？",
      options: [
        { id: "age_under_65", label: "65歳未満" },
        { id: "age_65_74", label: "65歳〜74歳" },
        { id: "age_over_75", label: "75歳以上" }
      ]
    },
    {
      id: "insurance",
      text: "加入していた健康保険の種類は何ですか？",
      options: [
        { id: "ins_kokuho", label: "都留市 国民健康保険" },
        { id: "ins_kouki", label: "後期高齢者医療制度" },
        { id: "ins_shakai", label: "会社の健康保険・共済等（社会保険）" }
      ]
    },
    {
      id: "household",
      text: "世帯主でしたか？",
      options: [
        { id: "house_head", label: "世帯主であった" },
        { id: "house_member", label: "単身または世帯員であった" }
      ]
    },
    {
      id: "pension",
      text: "公的年金を受給されていましたか？",
      options: [
        { id: "pen_yes", label: "受給していた（国民年金・厚生年金など）" },
        { id: "pen_no", label: "受給していなかった" }
      ]
    },
    {
      id: "assets",
      text: "資産（土地・家屋・自動車等）を所有されていましたか？",
      options: [
        { id: "asset_realestate", label: "土地・建物を所有していた" },
        { id: "asset_car", label: "自動車・軽自動車を所有していた" },
        { id: "asset_none", label: "所有していなかった" }
      ]
    }
  ];

  const PROCEDURES = [
    {
      id: "death_report",
      title: "死亡届の提出",
      category: "住民票・戸籍",
      deadlineCategory: "7days",
      deadlineText: "死亡の事実を知った日から7日以内",
      department: "市民課 市民窓口担当",
      phone: "0554-43-1111（内線 112〜118）",
      location: "市役所1階 市民課窓口",
      summary: "法的な死亡を証明するための届出です。通常は葬儀会社が受託して代行します。",
      itemsNeeded: [
        "死亡診断書（または死体検案書）",
        "届出人の認印（押印する場合）",
        "届出人の本人確認書類"
      ],
      conditions: []
    },
    {
      id: "kokuho_loss",
      title: "国民健康保険 資格喪失届・保険証返還",
      category: "国保・医療・葬祭費",
      deadlineCategory: "14days",
      deadlineText: "14日以内",
      department: "市民課 保険年金担当",
      phone: "0554-43-1111（内線 116〜118）",
      location: "市役所1階 市民課窓口",
      summary: "都留市の国民健康保険から脱退するための手続きです。保険証を返却します。",
      itemsNeeded: [
        "亡くなられた方の国民健康保険被保険者証",
        "手続きに来られる方の本人確認書類",
        "葬祭費の給付申請に必要な振込口座情報（同窓口で同時手続推奨）"
      ],
      conditions: ["ins_kokuho"]
    },
    {
      id: "kouki_loss",
      title: "後期高齢者医療 資格喪失届・保険証返還",
      category: "国保・医療・葬祭費",
      deadlineCategory: "14days",
      deadlineText: "14日以内",
      department: "市民課 保険年金担当",
      phone: "0554-43-1111（内線 116〜118）",
      location: "市役所1階 市民課窓口",
      summary: "75歳以上の方等が加入している後期高齢者医療制度の資格喪失届です。",
      itemsNeeded: [
        "後期高齢者医療被保険者証",
        "限度額適用認定証等（交付されている場合）",
        "手続きに来られる方の本人確認書類"
      ],
      conditions: ["ins_kouki", "age_over_75"]
    },
    {
      id: "sousai_hi",
      title: "葬祭費の支給申請（都留市）",
      category: "国保・医療・葬祭費",
      deadlineCategory: "midterm",
      deadlineText: "葬儀を行った日から2年以内",
      department: "市民課 保険年金担当",
      phone: "0554-43-1111（内線 116〜118）",
      location: "市役所1階 市民課窓口",
      summary: "都留市の国保または後期高齢者医療の加入者が亡くなった際、葬儀を行った喪主の方に葬祭費（国保: 5万円）が支給されます。",
      itemsNeeded: [
        "会葬礼状または葬儀費用領収書（喪主の氏名が確認できるもの）",
        "喪主の預金通帳（振込先口座情報）",
        "亡くなられた方の保険証",
        "喪主の認印・本人確認書類"
      ],
      conditions: ["ins_kokuho", "ins_kouki"]
    },
    {
      id: "kaigo_loss",
      title: "介護保険 資格喪失届・保険証返還",
      category: "介護・福祉",
      deadlineCategory: "14days",
      deadlineText: "14日以内",
      department: "長寿介護課 介護保険担当",
      phone: "0554-46-5118",
      location: "いきいきプラザ都留（〒402-0051 都留市下谷2516-1）",
      summary: "65歳以上の方、または要介護・要支援認定を受けていた方の介護保険証を返却します。",
      itemsNeeded: [
        "介護保険被保険者証",
        "介護保険負担割合証（交付されている場合）",
        "手続きに来られる方の本人確認書類"
      ],
      conditions: ["age_65_74", "age_over_75"]
    },
    {
      id: "pension_death",
      title: "年金受給権者死亡届 / 未支給年金の請求",
      category: "年金",
      deadlineCategory: "14days",
      deadlineText: "国民年金：14日以内 / 厚生年金：10日以内",
      department: "市民課 保険年金担当 / 大月年金事務所",
      phone: "都留市市民課: 0554-43-1111（内線 116〜118） / 大月年金事務所: 0554-22-3811",
      location: "市役所1階 市民課窓口 または 大月年金事務所（大月市大月町花咲1602-1）",
      summary: "年金の受給を停止し、亡くなった月までに支払われるはずだった未支給年金を遺族が請求します。",
      itemsNeeded: [
        "亡くなった方の年金証書（または年金手帳）",
        "戸籍謄本（亡くなった方と請求者の関係がわかるもの）",
        "亡くなった方の住民票除票",
        "請求者の世帯全員の住民票",
        "請求者の振込先預金通帳"
      ],
      conditions: ["pen_yes"]
    },
    {
      id: "household_change",
      title: "世帯主変更届",
      category: "住民票・戸籍",
      deadlineCategory: "14days",
      deadlineText: "14日以内",
      department: "市民課 市民窓口担当",
      phone: "0554-43-1111（内線 112〜118）",
      location: "市役所1階 市民課窓口",
      summary: "世帯主が亡くなられ、世帯に15歳以上の構成員が2人以上残る場合に、新しい世帯主を届け出ます。",
      itemsNeeded: [
        "届出人の本人確認書類（運転免許証・マイナンバーカード等）",
        "印鑑"
      ],
      conditions: ["house_head"]
    },
    {
      id: "tax_representative",
      title: "固定資産税 相続人代表者指定届",
      category: "税金",
      deadlineCategory: "midterm",
      deadlineText: "年内（固定資産税納税通知書送付前まで）",
      department: "税務課 資産税担当",
      phone: "0554-43-1111（内線 123・124）",
      location: "市役所1階 税務課窓口",
      summary: "土地や家屋の登記名義変更が完了するまでの間、固定資産税の納税通知書を受け取る代表者を届け出ます。",
      itemsNeeded: [
        "相続人代表者指定（変更）届出書（窓口または都留市HPよりダウンロード）",
        "被相続人と代表相続人の相続関係がわかる戸籍のコピー（都留市内で同一世帯の場合は省略可）",
        "被相続人の死亡が記載された戸籍（除籍）謄本または住民票（除票）のコピー（都留市にあった場合は省略可）"
      ],
      conditions: ["asset_realestate"]
    },
    {
      id: "tax_light_vehicle",
      title: "軽自動車税（種別割）名義変更・廃車",
      category: "税金",
      deadlineCategory: "midterm",
      deadlineText: "15日〜30日以内目安",
      department: "税務課 市民税担当 / 軽自動車検査協会",
      phone: "0554-43-1111（内線 121・122）",
      location: "市役所1階 税務課窓口（125cc以下のバイク・小型特殊）または 軽自動車検査協会山梨事務所（軽四輪等）",
      summary: "原付バイク（125cc以下）や小型特殊自動車は都留市役所、軽自動車は軽自動車検査協会で手続きを行います。",
      itemsNeeded: [
        "標識交付証明書（または車検証）",
        "ナンバープレート（廃車の場合）",
        "新所有者の認印・本人確認書類"
      ],
      conditions: ["asset_car"]
    },
    {
      id: "water_utility",
      title: "都留市 水道使用者の名義変更・開栓停止手続き",
      category: "インフラ・生活",
      deadlineCategory: "14days",
      deadlineText: "すみやかに",
      department: "上下水道課",
      phone: "0554-43-1111（内線 151〜153）",
      location: "市役所 上下水道課窓口",
      summary: "水道の使用名義を変更する、または家屋の引き払いに伴い水道を停止・清算します。※電話での受付は不可。必ず窓口にお越しください。手数料 各300円。",
      itemsNeeded: [
        "水道使用量のお知らせ（検針票）またはお客様番号",
        "届出人の認印・連絡先"
      ],
      conditions: []
    },
    {
      id: "bank_inheritance",
      title: "預貯金口座の凍結・相続名義変更手続き",
      category: "相続・その他",
      deadlineCategory: "longterm",
      deadlineText: "四十九日以降〜速やかに",
      department: "各金融機関（山梨中央銀行、都留信用組合、JA等）",
      phone: "各金融機関窓口",
      location: "各銀行・信販会社の本支店",
      summary: "金融機関へ死亡の連絡を行うと口座が一時凍結されます。遺産分割協議書や戸籍謄本を準備して名義変更・解約手続を行います。",
      itemsNeeded: [
        "亡くなられた方の出生から死亡までの連続した戸籍謄本（除籍謄本）",
        "相続人全員の戸籍謄本・印鑑証明書",
        "通帳・証書・キャッシュカード"
      ],
      conditions: []
    },
    {
      id: "inkan_return",
      title: "印鑑登録証（カード/手帳）の返還",
      category: "住民票・戸籍",
      deadlineCategory: "14days",
      deadlineText: "14日以内",
      department: "市民課 市民窓口担当",
      phone: "0554-43-1111（内線 112〜118）",
      location: "市役所1階 市民課窓口",
      summary: "亡くなった方の印鑑登録は自動的に廃止されますが、印鑑登録証（カードまたは手帳）は市民課窓口へ返還が必要です。",
      itemsNeeded: [
        "亡くなった方の印鑑登録証（カードまたは手帳）",
        "届出人の本人確認書類"
      ],
      conditions: []
    },
    {
      id: "electricity",
      title: "電気の名義変更・解約",
      category: "インフラ・生活",
      deadlineCategory: "midterm",
      deadlineText: "すみやかに",
      department: "東京電力パワーグリッド（都留市管轄）",
      phone: "0120-995-882 または各電力会社",
      location: "電話・Webで手続き可能",
      summary: "電気契約の名義変更（継続使用の場合）または解約（引き払いの場合）を行います。",
      itemsNeeded: [
        "お客さま番号（検針票や請求書に記載）",
        "契約者の情報"
      ],
      conditions: []
    },
    {
      id: "gas_phone_net",
      title: "ガス・電話・インターネット・NHKの名義変更/解約",
      category: "インフラ・生活",
      deadlineCategory: "midterm",
      deadlineText: "1ヶ月以内目安",
      department: "各契約先（プロパンガス業者・NTT・携帯会社・プロバイダ・NHK等）",
      phone: "各社の問い合わせ窓口",
      location: "電話・Webで手続き可能（各社による）",
      summary: "プロパンガス・固定電話・携帯電話・インターネット回線・NHK受信料等の名義変更または解約手続きです。",
      itemsNeeded: [
        "契約者番号・お客さま番号",
        "亡くなった方の情報（氏名・住所）",
        "継承者の本人確認書類（名義変更の場合）"
      ],
      conditions: []
    },
    {
      id: "life_insurance",
      title: "生命保険・損害保険の死亡保険金請求",
      category: "相続・その他",
      deadlineCategory: "midterm",
      deadlineText: "3年以内（時効あり・早めに）",
      department: "各保険会社",
      phone: "保険証券記載のコールセンター",
      location: "電話で連絡後、書類を郵送",
      summary: "生命保険・損害保険（傷害保険等）に加入していた場合、受取人が保険会社へ死亡保険金の請求手続きを行います。",
      itemsNeeded: [
        "保険証券",
        "死亡診断書のコピー",
        "受取人の本人確認書類・印鑑証明書",
        "受取人の振込先口座情報"
      ],
      conditions: []
    },
    {
      id: "driver_license",
      title: "運転免許証の返納",
      category: "相続・その他",
      deadlineCategory: "midterm",
      deadlineText: "すみやかに",
      department: "大月警察署（都留市管轄）",
      phone: "0554-22-0110",
      location: "大月警察署 または 最寄りの警察署",
      summary: "亡くなった方の運転免許証を警察署へ返納します。届出義務はありませんが、悪用防止のため早めの返納をお勧めします。",
      itemsNeeded: [
        "亡くなった方の運転免許証",
        "届出人の本人確認書類",
        "死亡の事実を確認できる書類（戸籍謄本等）"
      ],
      conditions: []
    },
    {
      id: "credit_card",
      title: "クレジットカードの解約",
      category: "相続・その他",
      deadlineCategory: "midterm",
      deadlineText: "すみやかに",
      department: "各クレジットカード会社",
      phone: "カード裏面の問い合わせ番号",
      location: "電話で連絡",
      summary: "不正利用や年会費の引き落としを防ぐため、クレジットカードの解約手続きを早めに行ってください。",
      itemsNeeded: [
        "クレジットカード（または会員番号）",
        "届出人の本人確認書類",
        "亡くなったことを証明する書類"
      ],
      conditions: []
    }
  ];

  // --- 2. ストレージヘルパー ---
  const STORAGE_KEY_CHECKED = "tsuru_okuyami_checked_items";
  const STORAGE_KEY_ANSWERS = "tsuru_okuyami_answers";
  const STORAGE_KEY_FONT_SIZE = "tsuru_okuyami_font_size";

  function loadCheckedItems() {
    try {
      const data = localStorage.getItem(STORAGE_KEY_CHECKED);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  function saveCheckedItems(items) {
    try {
      localStorage.setItem(STORAGE_KEY_CHECKED, JSON.stringify(items));
    } catch (e) {}
  }

  function loadAnswers() {
    try {
      const data = localStorage.getItem(STORAGE_KEY_ANSWERS);
      return data ? JSON.parse(data) : {};
    } catch (e) {
      return {};
    }
  }

  function saveAnswers(answers) {
    try {
      localStorage.setItem(STORAGE_KEY_ANSWERS, JSON.stringify(answers));
    } catch (e) {}
  }

  function loadFontSize() {
    try {
      return localStorage.getItem(STORAGE_KEY_FONT_SIZE) || "normal";
    } catch (e) {
      return "normal";
    }
  }

  function saveFontSize(size) {
    try {
      localStorage.setItem(STORAGE_KEY_FONT_SIZE, size);
    } catch (e) {}
  }

  function clearAllData() {
    try {
      localStorage.removeItem(STORAGE_KEY_CHECKED);
      localStorage.removeItem(STORAGE_KEY_ANSWERS);
    } catch (e) {}
  }

  // --- 3. フィルタリングロジック ---
  function filterProcedures(answers) {
    if (!answers || Object.keys(answers).length === 0) {
      return PROCEDURES;
    }
    const selectedOptions = Object.values(answers).flat();
    if (selectedOptions.length === 0) {
      return PROCEDURES;
    }
    return PROCEDURES.filter(proc => {
      if (!proc.conditions || proc.conditions.length === 0) {
        return true;
      }
      return proc.conditions.some(cond => selectedOptions.includes(cond));
    });
  }

  function filterByCategory(procedures, categoryId) {
    if (!categoryId || categoryId === 'all') return procedures;
    return procedures.filter(proc => proc.category === categoryId);
  }

  function filterByDeadline(procedures, deadlineId) {
    if (!deadlineId || deadlineId === 'all') return procedures;
    return procedures.filter(proc => proc.deadlineCategory === deadlineId);
  }

  // --- 4. アプリケーション状態 ---
  let wizardStep = 0;
  let userAnswers = loadAnswers();
  let checkedProcedureIds = loadCheckedItems();
  let activeCategoryFilter = 'all';
  let activeDeadlineFilter = 'all';

  // 初期化
  document.addEventListener('DOMContentLoaded', () => {
    initFontSize();
    initDateHeader();
    initTabs();
    initWizard();
    initFilters();
    renderAllProcedures();
    initGlobalEvents();
    updateProgressSummary();
  });

  function initDateHeader() {
    const dateEl = document.getElementById('print-date');
    if (dateEl) {
      const today = new Date();
      dateEl.textContent = `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`;
    }
  }

  function initFontSize() {
    const currentSize = loadFontSize();
    const fontBtnText = document.getElementById('font-size-text');
    if (currentSize === 'large') {
      document.body.classList.add('font-large');
      if (fontBtnText) fontBtnText.textContent = '文字：拡大';
    } else {
      document.body.classList.remove('font-large');
      if (fontBtnText) fontBtnText.textContent = '文字：標準';
    }
  }

  function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetTab = btn.getAttribute('data-tab');

        tabBtns.forEach(b => b.classList.remove('active'));
        tabPanels.forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        const targetPanel = document.getElementById(targetTab);
        if (targetPanel) targetPanel.classList.add('active');
      });
    });
  }

  function initWizard() {
    renderWizardStep();

    const btnNext = document.getElementById('btn-next-step');
    const btnPrev = document.getElementById('btn-prev-step');

    if (btnNext) {
      btnNext.addEventListener('click', () => {
        if (wizardStep < QUESTIONS.length - 1) {
          wizardStep++;
          renderWizardStep();
        } else {
          showWizardResults();
        }
      });
    }

    if (btnPrev) {
      btnPrev.addEventListener('click', () => {
        if (wizardStep > 0) {
          wizardStep--;
          renderWizardStep();
        }
      });
    }
  }

  function renderWizardStep() {
    const container = document.getElementById('wizard-step-container');
    const progressBar = document.getElementById('wizard-progress');
    const btnPrev = document.getElementById('btn-prev-step');
    const btnNext = document.getElementById('btn-next-step');
    const resultsContainer = document.getElementById('wizard-results');
    const wizardCard = document.getElementById('wizard-card');

    if (resultsContainer) resultsContainer.style.display = 'none';
    if (wizardCard) wizardCard.style.display = 'block';
    if (container) container.style.display = 'block';

    const progressPercent = ((wizardStep + 1) / QUESTIONS.length) * 100;
    if (progressBar) progressBar.style.width = `${progressPercent}%`;

    if (btnPrev) btnPrev.style.visibility = wizardStep === 0 ? 'hidden' : 'visible';
    if (btnNext) btnNext.textContent = wizardStep === QUESTIONS.length - 1 ? '診断結果を見る ➔' : '次へ進む ➔';

    const question = QUESTIONS[wizardStep];
    if (!question) return;

    const currentSelected = userAnswers[question.id] || [];

    container.innerHTML = `
      <div class="question-box">
        <div class="question-text">ステップ ${wizardStep + 1} / ${QUESTIONS.length}: ${question.text}</div>
        <div class="options-grid">
          ${question.options.map(opt => `
            <label class="option-card ${currentSelected.includes(opt.id) ? 'selected' : ''}">
              <input type="${question.id === 'assets' ? 'checkbox' : 'radio'}" 
                     name="${question.id}" 
                     value="${opt.id}"
                     ${currentSelected.includes(opt.id) ? 'checked' : ''}>
              <span>${opt.label}</span>
            </label>
          `).join('')}
        </div>
      </div>
    `;

    const inputs = container.querySelectorAll('input');
    inputs.forEach(input => {
      input.addEventListener('change', () => {
        if (question.id === 'assets') {
          const checkedValues = Array.from(container.querySelectorAll('input:checked')).map(i => i.value);
          userAnswers[question.id] = checkedValues;
        } else {
          userAnswers[question.id] = [input.value];
        }
        saveAnswers(userAnswers);
        renderWizardStep();
      });
    });
  }

  function showWizardResults() {
    const wizardCard = document.getElementById('wizard-card');
    const resultsContainer = document.getElementById('wizard-results');
    const resultsList = document.getElementById('wizard-procedure-list');
    const summaryText = document.getElementById('results-summary-text');

    if (wizardCard) wizardCard.style.display = 'none';
    if (resultsContainer) resultsContainer.style.display = 'block';

    const filtered = filterProcedures(userAnswers);

    if (summaryText) {
      summaryText.textContent = `回答に基づいて ${filtered.length} 件の手続きを抽出しました。`;
    }

    if (resultsList) {
      resultsList.innerHTML = filtered.map(proc => createProcedureCardHTML(proc)).join('');
      attachProcedureCardEvents(resultsList);
      attachAccordionEvents(resultsList);
    }

    // 改善6: やり直しボタン
    const btnRetry = document.getElementById('btn-retry-wizard');
    if (btnRetry) {
      btnRetry.onclick = () => {
        wizardStep = 0;
        userAnswers = {};
        saveAnswers(userAnswers);
        if (wizardCard) wizardCard.style.display = 'block';
        if (resultsContainer) resultsContainer.style.display = 'none';
        renderWizardStep();
      };
    }
  }

  function initFilters() {
    const catContainer = document.getElementById('category-filters');
    const deadContainer = document.getElementById('deadline-filters');

    if (catContainer) {
      catContainer.innerHTML = CATEGORIES.map(c => `
        <button class="filter-chip ${c.id === activeCategoryFilter ? 'active' : ''}" data-cat="${c.id}">${c.name}</button>
      `).join('');

      catContainer.querySelectorAll('.filter-chip').forEach(btn => {
        btn.addEventListener('click', () => {
          catContainer.querySelectorAll('.filter-chip').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          activeCategoryFilter = btn.getAttribute('data-cat');
          renderAllProcedures();
        });
      });
    }

    if (deadContainer) {
      deadContainer.innerHTML = DEADLINES.map(d => `
        <button class="filter-chip ${d.id === activeDeadlineFilter ? 'active' : ''}" data-dead="${d.id}">${d.name}</button>
      `).join('');

      deadContainer.querySelectorAll('.filter-chip').forEach(btn => {
        btn.addEventListener('click', () => {
          deadContainer.querySelectorAll('.filter-chip').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          activeDeadlineFilter = btn.getAttribute('data-dead');
          renderAllProcedures();
        });
      });
    }
  }

  function renderAllProcedures() {
    const container = document.getElementById('all-procedure-list');
    if (!container) return;

    let procedures = PROCEDURES;
    procedures = filterByCategory(procedures, activeCategoryFilter);
    procedures = filterByDeadline(procedures, activeDeadlineFilter);

    if (procedures.length === 0) {
      container.innerHTML = `<div class="card"><p style="color: var(--text-muted);">該当する手続きはありませんでした。</p></div>`;
      return;
    }

    container.innerHTML = procedures.map(proc => createProcedureCardHTML(proc)).join('');
    attachProcedureCardEvents(container);
    attachAccordionEvents(container);
  }

  function createProcedureCardHTML(proc) {
    const isChecked = checkedProcedureIds.includes(proc.id);

    let deadlineBadgeClass = 'badge-deadline-midterm';
    if (proc.deadlineCategory === '7days') deadlineBadgeClass = 'badge-deadline-7days';
    if (proc.deadlineCategory === '14days') deadlineBadgeClass = 'badge-deadline-14days';
    if (proc.deadlineCategory === 'longterm') deadlineBadgeClass = 'badge-deadline-longterm';

    // 改善8: 市役所関連で委任状が必要な可能性があるかチェック
    const isCityHallProc = proc.location && proc.location.includes('市役所');

    return `
      <div class="procedure-item ${isChecked ? 'checked' : ''}" id="proc-card-${proc.id}">
        <div class="procedure-header" data-accordion-toggle>
          <input type="checkbox" class="check-input" data-proc-id="${proc.id}" ${isChecked ? 'checked' : ''}>
          <div class="procedure-header-info">
            <div class="procedure-badges">
              <span class="badge ${deadlineBadgeClass}">⏳ ${proc.deadlineText}</span>
              <span class="badge badge-category">📂 ${proc.category}</span>
            </div>
            <div class="procedure-title">${proc.title} <span class="accordion-arrow">▼</span></div>
          </div>
        </div>
        <div class="procedure-body collapsed">
          <p>${proc.summary}</p>
          <div class="info-grid">
            <div>
              <div class="info-item-label">担当課・問合せ窓口</div>
              <div class="info-item-value">${proc.department}</div>
              <div style="font-size: 0.85rem; color: var(--text-muted);">${proc.location} (${proc.phone})</div>
            </div>
            <div>
              <div class="info-item-label">手続き期限</div>
              <div class="info-item-value">${proc.deadlineText}</div>
            </div>
          </div>
          ${proc.itemsNeeded && proc.itemsNeeded.length > 0 ? `
            <div style="font-weight: 700; margin-top: 0.5rem; font-size: 0.9rem;">必要な持ち物・書類:</div>
            <ul class="items-needed-list">
              ${proc.itemsNeeded.map(item => `<li>${item}</li>`).join('')}
            </ul>
          ` : ''}
          ${isCityHallProc ? '<p class="delegate-note">⚠️ 別世帯の方が代理で手続きされる場合は<strong>委任状</strong>が必要です。窓口にお越しになる方の本人確認書類・印鑑もご持参ください。</p>' : ''}
        </div>
      </div>
    `;
  }

  // 改善5: アコーディオン展開/折りたたみ
  function attachAccordionEvents(container) {
    const headers = container.querySelectorAll('[data-accordion-toggle]');
    headers.forEach(header => {
      header.addEventListener('click', (e) => {
        // チェックボックスクリック時はアコーディオンを動かさない
        if (e.target.classList.contains('check-input')) return;
        const body = header.nextElementSibling;
        const arrow = header.querySelector('.accordion-arrow');
        if (body) {
          body.classList.toggle('collapsed');
          if (arrow) arrow.textContent = body.classList.contains('collapsed') ? '▼' : '▲';
        }
      });
    });
  }

  function attachProcedureCardEvents(container) {
    const checkboxes = container.querySelectorAll('.check-input');
    checkboxes.forEach(chk => {
      chk.addEventListener('change', () => {
        const procId = chk.getAttribute('data-proc-id');
        if (chk.checked) {
          if (!checkedProcedureIds.includes(procId)) checkedProcedureIds.push(procId);
        } else {
          checkedProcedureIds = checkedProcedureIds.filter(id => id !== procId);
        }
        saveCheckedItems(checkedProcedureIds);

        const parentCard = document.getElementById(`proc-card-${procId}`);
        if (parentCard) {
          if (chk.checked) parentCard.classList.add('checked');
          else parentCard.classList.remove('checked');
        }

        // 改善7: 進捗サマリー更新
        updateProgressSummary();
      });
    });
  }

  // 改善7: 進捗サマリーバー
  function updateProgressSummary() {
    const bar = document.getElementById('progress-summary-bar');
    const text = document.getElementById('progress-summary-text');
    const fill = document.getElementById('progress-summary-fill');
    if (!bar || !text || !fill) return;

    const total = PROCEDURES.length;
    const done = checkedProcedureIds.length;

    if (done > 0) {
      bar.style.display = 'block';
      text.textContent = `手続き進捗: ${done} / ${total} 件完了（残り ${total - done} 件）`;
      fill.style.width = `${(done / total) * 100}%`;
    } else {
      bar.style.display = 'none';
    }
  }

  function initGlobalEvents() {
    const btnFont = document.getElementById('btn-font-toggle');
    if (btnFont) {
      btnFont.addEventListener('click', () => {
        const isLarge = document.body.classList.toggle('font-large');
        saveFontSize(isLarge ? 'large' : 'normal');
        initFontSize();
      });
    }

    // 言語トグル（簡易対応）
    let currentLang = 'ja';
    const btnLang = document.getElementById('btn-lang-toggle');
    const langText = document.getElementById('lang-text');
    if (btnLang) {
      btnLang.addEventListener('click', () => {
        currentLang = currentLang === 'ja' ? 'en' : 'ja';
        if (langText) langText.textContent = currentLang === 'ja' ? '🌐 English' : '🌐 日本語';
        alert(currentLang === 'en' 
          ? 'Multilingual Guide Notice:\nThis handbook is provided in Japanese. For English assistance regarding municipal procedures, please contact Tsuru City Hall (0554-43-1111).' 
          : '日本語表示に切り替えました。');
      });
    }

    // モーダル開閉・送信
    const btnOpenModal = document.getElementById('btn-open-feedback');
    const btnCloseModal = document.getElementById('btn-close-feedback');
    const btnSubmitModal = document.getElementById('btn-submit-feedback');
    const modal = document.getElementById('feedback-modal');
    const feedbackText = document.getElementById('feedback-text');

    if (btnOpenModal && modal) {
      btnOpenModal.addEventListener('click', () => {
        modal.style.display = 'flex';
      });
    }

    if (btnCloseModal && modal) {
      btnCloseModal.addEventListener('click', () => {
        modal.style.display = 'none';
      });
    }

    if (btnSubmitModal && modal && feedbackText) {
      btnSubmitModal.addEventListener('click', () => {
        if (!feedbackText.value.trim()) {
          alert('ご意見を入力してください。');
          return;
        }
        alert('ご意見をお送りいただきありがとうございました。今後の改善の参考にさせていただきます。');
        feedbackText.value = '';
        modal.style.display = 'none';
      });
    }
  }

})();
