# 自治体向けWebアプリ 開発＆GitHub Pages公開マニュアル（完全版）

本マニュアルは、今後の他自治体向けWebアプリ制作や別プロジェクト開発をスムーズに進めるための**再現可能な標準手順書および開発時の重要注意点集**です。

---

## 📋 全体開発フロー

```text
[1. 調査・要件定義] ➔ [2. 構成設計] ➔ [3. 実装・検証] ➔ [4. Gitコミット] ➔ [5. GitHub Pages公開]
```

---

## 1. 調査・要件定義フェーズ

### 1.1 他自治体事例 ＆ ユーザーニーズの調査
- 他自治体の先進事例（回答選択式ナビ、タイムライン表示、エンディングノート連携、印刷対応等）を比較。
- ご遺族のお困りごと（「手続きが複雑」「何から手をつければいいか分からない」「民間手続きも多い」）を整理。

### 1.2 対象自治体の公式情報調査
- 死亡届、国民健康保険、後期高齢者医療、葬祭費（支給額等）、介護保険、年金、固定資産税、軽自動車税、水道の担当課・内線番号・持ち物を公式サイトから正確に抽出。
- 火葬場の名称・予約電話・火葬時間・注意事項等の地域固有情報を網羅。

> [!IMPORTANT]
> **⚠️ 自治体情報の検証における注意点**
> 1. **担当課名・窓口場所の誤りに注意**: 例として「高齢者支援課」ではなく「長寿介護課」が正しく、窓口も本庁舎ではなく「いきいきプラザ都留」にあるようなケースが存在します。必ず最新の公式組織図・窓口一覧で確認してください。
> 2. **電話受付不可の手続きの注意**: 上下水道の名義変更・開閉栓手続きのように「電話不可・窓口か郵送のみ受付（手数料必要）」となる地域固有ルールがあるため、注意事項に明記してください。

---

## 2. 構成設計・アーキテクチャ選定

### 2.1 Web標準スタックの選定
- **ビルドツール不要の Vanilla HTML5 / CSS3 / JavaScript 構成**:
  - `npm build` などの環境構築が不要なため、他自治体の職員やオープンソース開発者が容易にフォーク・編集可能。
  - エクスプローラーから `index.html` をダブルクリックするだけでオフラインでも動作。

> [!WARNING]
> **⚠️ `file://` 直接ダブルクリック閲覧と `http://` の両立注意点**
> - `<script type="module">` や `import / export` を使用すると、ブラウザのセキュリティ制限（CORS）により、HTMLをローカルで直接ダブルクリック（`file://`）した際にスクリプトがブロックされボタンが動作しなくなります。
> - ローカル直開きでもGitHub Pages上でも一切の制限なく動作させるため、全データとロジックを依存関係のない**単一の統合JavaScriptファイル（`js/app.js`）**として配置してください。

---

## 3. 開発・実装手順 ＆ トラブル防止注意点

### 3.1 推奨ディレクトリ構成
```text
project-name/
├── index.html              # シングルページHTML
├── css/
│   ├── main.css            # デザインシステム・レスポンシブスタイル
│   └── print.css           # 印刷/PDF最適化スタイル
├── js/
│   └── app.js              # 全データ・ロジックを内包した統合スクリプト
├── docs/
│   ├── DEVELOPMENT_GUIDE.md # 本手順書
│   └── plans/              # 設計書・実装計画書・タスク管理
├── README.md               # ガイド＆公開手順
├── LICENSE                 # MIT License
└── .gitignore              # Git除外設定
```

### 3.2 アコーディオンUI実装の重要注意点
DOM要素の相対関係（`nextElementSibling` 等）に依存してアコーディオンのトグルロジックを書くと、文字やアイコンのクリック位置によって正常に開閉しなくなるトラブルが発生します。

```javascript
// ⭕️ 推奨される堅牢なアコーディオン実装パターン
function attachAccordionEvents(container) {
  if (!container) return;
  const headers = container.querySelectorAll('[data-accordion-toggle]');
  headers.forEach(header => {
    // 重複バインド防止
    if (header.dataset.accordionBound) return;
    header.dataset.accordionBound = "true";

    header.addEventListener('click', (e) => {
      // チェックボックス操作時はトグルしない
      if (e.target && e.target.classList.contains('check-input')) return;

      // closest セレクタで確実に対象の親カードを取得
      const card = header.closest('.procedure-item') || header.closest('.card') || header.parentElement;
      if (!card) return;

      const body = card.querySelector('.procedure-body');
      const arrow = card.querySelector('.accordion-arrow');

      if (body) {
        const isCollapsed = body.classList.toggle('collapsed');
        if (arrow) {
          arrow.textContent = isCollapsed ? '▼' : '▲';
        }
      }
    });
  });
}
```

### 3.3 個人情報・エンディングノート機能のセキュリティ注意点
1. **完全ローカル保存 (LocalStorage)**: 入力データは一切外部サーバーに送信せず、ブラウザ内でのみ自動保存・復元される仕様にします。
2. **安心バナーの必須設置**: 画面冒頭に「個人情報は外部に送信されず、お使いの端末内にのみ保存されます」というバナーを明示し、利用者の不安を取り除きます。
3. **パスワード入力禁止の注意喚起**: キャッシュカードの暗証番号やパスワードは絶対に記入しないよう警告テキストを赤字で表示します。

---

## 4. Git ＆ GitHub公開ステップ

### 4.1 `.gitignore` の準備
プロジェクトルートに `.gitignore` を作成：
```gitignore
.DS_Store
Thumbs.db
*.tmp
*.log
.vscode/
```

### 4.2 Gitリポジトリ初期化とコミット
ターミナルで以下を実行：
```bash
# 1. リポジトリ初期化
git init

# 2. ファイルをステージング
git add .

# 3. 初期コミット
git commit -m "feat: 初期公開バージョン"

# 4. ブランチ名を main に設定
git branch -M main
```

### 4.3 GitHubリポジトリの作成と送信（Push）
1. [https://github.com/new](https://github.com/new) で新しいリポジトリ（Public）を作成。
2. ターミナルでプッシュコマンドを実行：
```bash
git remote add origin https://github.com/<ユーザー名>/<リポジトリ名>.git
git push -u origin main
```

---

## 5. GitHub Pages での自動Web公開

1. GitHubリポジトリページの **Settings** タブを開く。
2. 左メニューの **Pages** を選択。
3. **Build and deployment** の **Branch** で `main` / `/(root)` を選択し **Save** を押す。
4. 約1〜2分で以下の公開URLが自動生成される：

👉 **`https://<ユーザー名>.github.io/<リポジトリ名>/`**

---

## 🔄 他の自治体・新プロジェクトへ水平展開する方法

別自治体（例：大月市版、山梨市版など）を作成する場合は、以下の手順で最短15分で水平展開できます：

1. 本リポジトリのコードをコピー。
2. `js/app.js` 内のマスターデータ部分（`TSURU_CITY_INFO` および `PROCEDURES` の窓口名・電話番号・手続き条件）のみを書き換える。
3. 新しいGitHubリポジトリにプッシュしてGitHub Pagesを有効化する。
