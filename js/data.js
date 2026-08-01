/**
 * 都留市 お悔やみハンドブック - マスターデータ
 * 山梨県都留市役所の実際の窓口情報・申請手続きを収録
 */

export const TSURU_CITY_INFO = {
  name: "都留市役所",
  address: "〒402-8501 山梨県都留市上谷一丁目1番1号",
  phone: "0554-43-1111",
  hours: "午前8時30分～午後5時15分（土・日・祝日・年末年始を除く）",
  website: "https://www.city.tsuru.yamanashi.jp/"
};

export const CATEGORIES = [
  { id: "all", name: "すべて表示" },
  { id: "住民票・戸籍", name: "住民票・戸籍" },
  { id: "国保・医療・葬祭費", name: "国保・医療・葬祭費" },
  { id: "年金", name: "年金" },
  { id: "介護・福祉", name: "介護・福祉" },
  { id: "税金", name: "税金" },
  { id: "インフラ・生活", name: "インフラ・生活" },
  { id: "相続・その他", name: "相続・その他" }
];

export const DEADLINES = [
  { id: "all", name: "すべての期限" },
  { id: "7days", name: "7日以内（すみやかに）" },
  { id: "14days", name: "14日以内" },
  { id: "midterm", name: "年内・数ヶ月以内" },
  { id: "longterm", name: "中長期・随時" }
];

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
    summary: "法的な死亡を証明するための届出です。通常は葬儀会社が受託して代行します。",
    itemsNeeded: [
      "死亡診断書（または死体検案書）",
      "届出人の認印（押印する場合）",
      "届出人の本人確認書類"
    ],
    conditions: [] // 全員対象
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
    department: "市民課（国保高齢者医療担当）",
    phone: "0554-43-1111",
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
    department: "市民課（国保高齢者医療担当）",
    phone: "0554-43-1111",
    location: "市役所1階 市民課窓口",
    summary: "都留市の国保または後期高齢者医療の加入者が亡くなった際、葬儀を行った喪主の方に葬祭費（給付金）が支給されます。",
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
    department: "高齢者支援課（介護保険担当）",
    phone: "0554-43-1111",
    location: "市役所1階 高齢者支援課窓口",
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
    department: "市民課（年金担当） / 大月年金事務所",
    phone: "都留市市民課: 0554-43-1111 / 大月年金事務所: 0554-22-1200",
    location: "市役所1階 市民課窓口 または 大月年金事務所",
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
    department: "市民課（戸籍住民担当）",
    phone: "0554-43-1111",
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
    department: "税務課（資産税担当）",
    phone: "0554-43-1111",
    location: "市役所1階 税務課窓口",
    summary: "土地や家屋の登記名義変更が完了するまでの間、固定資産税の納税通知書を受け取る代表者を届け出ます。",
    itemsNeeded: [
      "相続人代表者指定届出書（窓口または都留市HPより入手）",
      "代表者の印鑑および本人確認書類"
    ],
    conditions: ["asset_realestate"]
  },
  {
    id: "tax_light_vehicle",
    title: "軽自動車税（種別割）名義変更・廃車",
    category: "税金",
    deadlineCategory: "midterm",
    deadlineText: "15日〜30日以内目安",
    department: "税務課（市民税担当） / 軽自動車検査協会",
    phone: "0554-43-1111（都留市税務課）",
    location: "市役所1階 税務課 または 軽自動車検査協会山梨事務所",
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
    department: "水道課",
    phone: "0554-43-1111",
    location: "市役所2階 水道課",
    summary: "水道の使用名義を変更する、または家屋の引き払いに伴い水道を停止・清算します。",
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
  }
];
