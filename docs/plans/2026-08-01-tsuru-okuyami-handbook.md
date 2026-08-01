# 都留市 お悔やみハンドブック Webアプリ Implementation Plan

> **For Antigravity:** REQUIRED WORKFLOW: Use `.agent/workflows/execute-plan.md` to execute this plan in single-flow mode.

**Goal:** 都留市民のご遺族がスマホ・PCで死亡後の必要な行政・民間手続きを簡単に自動抽出・確認・進捗管理でき、かつA4印刷対応可能なデジタルハンドブックWebアプリを構築し、GitHub Pagesで公開可能にする。

**Architecture:** ビルド手順不要の Vanilla HTML5 / Modern CSS (Vanilla CSS) / JavaScript (ES Modules) 構成。LocalStorageによる進捗維持と `@media print` によるA4最適化出力に対応。

**Tech Stack:** HTML5, CSS3, JavaScript (ES6+), LocalStorage API, Print API

---

### Task 1: 都留市手続きマスターデータ (`js/data.js`) とストレージ管理 (`js/storage.js`) の作成

**Files:**
- Create: `js/data.js`
- Create: `js/storage.js`

**Step 1: 都留市手続きデータモジュール `js/data.js` の作成**
都留市役所の実際の窓口情報（電話番号 0554-43-1111、住所 〒402-8501 山梨県都留市上谷一丁目1番1号）、担当課、質問項目、手続きカテゴリ別データを記述。

```javascript
// js/data.js
export const TSURU_CITY_INFO = {
  name: "都留市役所",
  address: "〒402-8501 山梨県都留市上谷一丁目1番1号",
  phone: "0554-43-1111",
  hours: "午前8時30分～午後5時15分（土・日・祝日・年末年始を除く）",
  website: "https://www.city.tsuru.yamanashi.jp/"
};

export const QUESTIONS = [
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
      { id: "house_member", label: "世帯員であった" }
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
    text: "車や不動産（土地・家屋）を所有されていましたか？（複数選択可）",
    options: [
      { id: "asset_realestate", label: "土地・建物を所有していた" },
      { id: "asset_car", label: "自動車・軽自動車を所有していた" },
      { id: "asset_none", label: "所有していなかった" }
    ]
  }
];

export const PROCEDURES = [
  {
    id: "death_report",
    title: "死亡届の提出",
    category: "住民票・戸籍",
    deadlineCategory: "7days",
    deadlineText: "死亡の事実を知った日から7日以内",
    department: "市民課（戸籍住民担当）",
    phone: "0554-43-1111",
    location: "市役所1階 市民課窓口",
    summary: "法的な死亡を届ける手続きです。通常は葬儀会社が代行します。",
    itemsNeeded: ["死亡診断書（死体検案書）", "届出人の印鑑（認印可）", "届出人の本人確認書類"],
    conditions: [] // 全員必須
  },
  {
    id: "kokuho_loss",
    title: "国民健康保険 資格喪失届・保険証返還",
    category: "国保・医療・葬祭費",
    deadlineCategory: "14days",
    deadlineText: "14日以内",
    department: "市民課（国保高齢者医療担当）",
    phone: "0554-43-1111",
    location: "市役所1階 市民課窓口",
    summary: "都留市の国民健康保険を脱退し、保険証を返却します。",
    itemsNeeded: ["国民健康保険被保険者証", "届出人の本人確認書類", "葬祭費支給申請書（同窓口で同時手続可能）"],
    conditions: ["ins_kokuho"]
  },
  {
    id: "kouki_loss",
    title: "後期高齢者医療 資格喪失届・保険証返還",
    category: "国保・医療・葬祭費",
    deadlineCategory: "14days",
    deadlineText: "14日以内",
    department: "市民課（国保高齢者医療担当）",
    phone: "0554-43-1111",
    location: "市役所1階 市民課窓口",
    summary: "75歳以上等の方が加入する後期高齢者医療の資格喪失手続きです。",
    itemsNeeded: ["後期高齢者医療被保険者証", "届出人の本人確認書類", "葬祭費支給申請書（同窓口で同時手続可能）"],
    conditions: ["ins_kouki", "age_over_75"]
  },
  {
    id: "sousai_hi",
    title: "葬祭費の支給申請（都留市）",
    category: "国保・医療・葬祭費",
    deadlineCategory: "midterm",
    deadlineText: "葬儀を行った日から2年以内",
    department: "市民課（国保高齢者医療担当）",
    phone: "0554-43-1111",
    location: "市役所1階 市民課窓口",
    summary: "国保・後期高齢者医療の被保険者が亡くなった際、葬儀を行った方（喪主）に葬祭費が支給されます。",
    itemsNeeded: ["会葬礼状または葬儀の領収書・請求書（喪主名義）", "喪主の預金通帳（振込先情報）", "亡くなられた方の保険証"],
    conditions: ["ins_kokuho", "ins_kouki"]
  },
  {
    id: "kaigo_loss",
    title: "介護保険 資格喪失届・被保険者証返還",
    category: "介護・福祉",
    deadlineCategory: "14days",
    deadlineText: "14日以内",
    department: "高齢者支援課（介護保険担当）",
    phone: "0554-43-1111",
    location: "市役所1階 高齢者支援課窓口",
    summary: "65歳以上の方、または40〜64歳で要介護認定を受けていた方の介護保険証を返却します。",
    itemsNeeded: ["介護保険被保険者証", "負担割合証・限度額認定証（所持している場合）", "届出人の本人確認書類"],
    conditions: ["age_65_74", "age_over_75"]
  },
  {
    id: "pension_unpaid",
    title: "未支給年金の請求 / 年金受給権者死亡届",
    category: "年金",
    deadlineCategory: "14days",
    deadlineText: "国民年金は14日以内、厚生年金は10日以内",
    department: "市民課（年金担当） / 大月年金事務所",
    phone: "0554-43-1111（都留市） / 0554-22-1200（大月年金事務所）",
    location: "市役所1階 市民課窓口 または 大月年金事務所",
    summary: "亡くなった月までの未受給年金を、生計を同じくしていた遺族が請求します。",
    itemsNeeded: ["年金手帳または年金証書", "戸籍謄本", "亡くなった方の住民票除票", "請求者の世帯全員の住民票", "生計維持が確認できる書類", "請求者の預金通帳"],
    conditions: ["pen_yes"]
  },
  {
    id: "household_change",
    title: "世帯主変更届",
    category: "住民票・戸籍",
    deadlineCategory: "14days",
    deadlineText: "14日以内",
    department: "市民課（戸籍住民担当）",
    phone: "0554-43-1111",
    location: "市役所1階 市民課窓口",
    summary: "世帯主が亡くなり、世帯に2人以上の15歳以上の者が残る場合に必要な届出です。",
    itemsNeeded: ["届出人の本人確認書類", "届出人の印鑑"],
    conditions: ["house_head"]
  },
  {
    id: "tax_realestate",
    title: "固定資産税 相続人代表者指定届",
    category: "税金",
    deadlineCategory: "midterm",
    deadlineText: "死亡後すみやかに（年内目安）",
    department: "税務課（資産税担当）",
    phone: "0554-43-1111",
    location: "市役所1階 税務課窓口",
    summary: "不動産の所有権移転登記が完了するまでの間、固定資産税の納税通知書を受領する代表者を指定します。",
    itemsNeeded: ["相続人代表者指定届出書", "代表者の本人確認書類・印鑑"],
    conditions: ["asset_realestate"]
  },
  {
    id: "water_contract",
    title: "水道の使用名義変更・停止手続き",
    category: "インフラ・生活",
    deadlineCategory: "14days",
    deadlineText: "すみやかに（14日以内目安）",
    department: "水道課",
    phone: "0554-43-1111",
    location: "市役所2階 水道課",
    summary: "都留市の水道使用者の名義変更、または世帯引き払い時の使用停止手続きを行ってください。",
    itemsNeeded: ["水道使用量のお知らせ（検針票）またはお客様番号", "印鑑"],
    conditions: []
  }
];
```

**Step 2: ストレージ管理モジュール `js/storage.js` の作成**
ユーザーの進捗チェック（LocalStorage）を管理。

```javascript
// js/storage.js
const STORAGE_KEY_CHECKED = "tsuru_okuyami_checked_items";
const STORAGE_KEY_ANSWERS = "tsuru_okuyami_answers";

export function loadCheckedItems() {
  try {
    const data = localStorage.getItem(STORAGE_KEY_CHECKED);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Failed to load checked items", e);
    return [];
  }
}

export function saveCheckedItems(items) {
  try {
    localStorage.setItem(STORAGE_KEY_CHECKED, JSON.stringify(items));
  } catch (e) {
    console.error("Failed to save checked items", e);
  }
}

export function loadAnswers() {
  try {
    const data = localStorage.getItem(STORAGE_KEY_ANSWERS);
    return data ? JSON.parse(data) : {};
  } catch (e) {
    return {};
  }
}

export function saveAnswers(answers) {
  try {
    localStorage.setItem(STORAGE_KEY_ANSWERS, JSON.stringify(answers));
  } catch (e) {
    console.error("Failed to save answers", e);
  }
}

export function clearAllData() {
  localStorage.removeItem(STORAGE_KEY_CHECKED);
  localStorage.removeItem(STORAGE_KEY_ANSWERS);
}
```

---

### Task 2: 診断ロジック・フィルタリングモジュール (`js/navigator.js`) の作成

**Files:**
- Create: `js/navigator.js`

**Step 1: 診断エンジン `js/navigator.js` の作成**

```javascript
// js/navigator.js
import { PROCEDURES } from './data.js';

export function filterProcedures(answers) {
  if (!answers || Object.keys(answers).length === 0) {
    return PROCEDURES;
  }

  const selectedOptions = Object.values(answers).flat();

  return PROCEDURES.filter(proc => {
    if (!proc.conditions || proc.conditions.length === 0) {
      return true;
    }
    // 該当する条件が少なくとも1つ一致するか判定
    return proc.conditions.some(cond => selectedOptions.includes(cond));
  });
}
```

---

### Task 3: CSSデザインシステム ＆ 印刷スタイル (`css/main.css`, `css/print.css`) の作成

**Files:**
- Create: `css/main.css`
- Create: `css/print.css`

**Step 1: UIスタイル `css/main.css` の作成**
モダンなカラー変数、タブデザイン、ステップ診断、アコーディオン、カードデザイン、レスポンシブメディアクエリを完全実装。

**Step 2: 印刷用スタイル `css/print.css` の作成**
`@media print` を使用し、ヘッダー・ボタン・フォームを非表示化。印刷時にA4サイズに合わせたレイアウト調整を実装。

---

### Task 4: HTMLテンプレート (`index.html`) ＆ メイン制御スクリプト (`js/app.js`) の作成

**Files:**
- Create: `index.html`
- Create: `js/app.js`

**Step 1: `index.html` の作成**
WAI-ARIAアクセシビリティ対応のセマンティック構造（`<header>`, `<main>`, `<nav>`, `<section>`, `<footer>`）。

**Step 2: `js/app.js` の作成**
タブ切替、質問ステップ進行、チェック状態同期、印刷ボタンイベントハンドラ、フォントサイズ変更ロジックの実装。

---

### Task 5: README.md / LICENSE / GitHub Pages公開手順の作成

**Files:**
- Create: `README.md`
- Create: `LICENSE`

---

### Task 6: アプリ動作検証・表示チェック

**Step 1: ブラウザでの簡易サーバー起動および動作チェック**
- 診断質問の回答に応じた手続きフィルタリングの正常動作
- チェックリスト状態のローカル保存（LocalStorage）動作確認
- 印刷プレビュー表示の確認
