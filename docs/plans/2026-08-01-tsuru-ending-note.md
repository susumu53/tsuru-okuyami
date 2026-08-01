# 都留市 エンディングノート Implementation Plan

> **For Antigravity:** REQUIRED WORKFLOW: Use `.agent/workflows/execute-plan.md` to execute this plan in single-flow mode.

**Goal:** 都留市民がスマホ・PCで自分の意思・医療介護の希望・緊急連絡先等を安心して書き残せ、ブラウザ内のみに自動保存・A4印刷出力できる「都留市エンディングノート」機能を既存アプリに統合構築する。

**Architecture:** ビルド不要な Vanilla HTML5 / Modern CSS / Vanilla JS 構成。LocalStorageによるリアルタイムローカル保存と `@media print` によるA4フォーマット印刷。

**Tech Stack:** HTML5 Form elements, CSS3, JavaScript (ES6+), LocalStorage API, Print API

---

### Task 1: HTMLに「エンディングノート」タブとフォーム構造 (`index.html`) を追加

**Files:**
- Modify: `index.html`

**Step 1: メインナビに「📝 エンディングノート」タブボタンを追加**
**Step 2: `tab-endingnote` パネルの構築**
- 🔒 プライバシー・安全安心バナーの配置
- 記入進捗度プログレスゲージの配置
- 第1章〜第5章のアコーディオンフォーム（基本情報、医療介護、葬儀、財産、メッセージ、都留市地域包括支援センター案内）
- 「📝 エンディングノートを印刷」「🗑️ ノート内容をクリア」ボタンの追加

---

### Task 2: CSSにエンディングノート＆印刷用スタイル (`css/main.css`, `css/print.css`) を追加

**Files:**
- Modify: `css/main.css`
- Modify: `css/print.css`

**Step 1: `css/main.css` に安心バナー、進捗ゲージ、フォーム要素スタイルを追加**
**Step 2: `css/print.css` に印刷時フォーム要素（`input` / `textarea`）の枠線・背景・テキスト出力最適化を追加**

---

### Task 3: JavaScriptにエンディングノートの自動保存・復元ロジック (`js/app.js`) を追加

**Files:**
- Modify: `js/app.js`

**Step 1: LocalStorageキー `STORAGE_KEY_ENDING_NOTE` (`tsuru_ending_note_data`) の定義**
**Step 2: フォーム値のリアルタイム自動保存（`input` / `change` イベント）**
**Step 3: ページ読み込み時のノートデータ自動復元・反映機能**
**Step 4: ノート進捗度（完成度%）計算ロジック**
**Step 5: ノート印刷ボタンおよびデータクリアボタン処理**

---

### Task 4: 構文チェック ＆ ブラウザ動作検証 ＆ Gitコミット

**Step 1: Node.js 構文チェック `node --check js/app.js`**
**Step 2: ローカルブラウザでの入力・保存・復元・印刷動作チェック**
**Step 3: Git コミット ＆ GitHub へのプッシュ `git push origin main`**
