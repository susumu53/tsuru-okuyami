/**
 * 都留市 お悔やみハンドブック - LocalStorageデータ管理
 */

const STORAGE_KEY_CHECKED = "tsuru_okuyami_checked_items";
const STORAGE_KEY_ANSWERS = "tsuru_okuyami_answers";
const STORAGE_KEY_FONT_SIZE = "tsuru_okuyami_font_size";

export function loadCheckedItems() {
  try {
    const data = localStorage.getItem(STORAGE_KEY_CHECKED);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Failed to load checked items from LocalStorage", e);
    return [];
  }
}

export function saveCheckedItems(items) {
  try {
    localStorage.setItem(STORAGE_KEY_CHECKED, JSON.stringify(items));
  } catch (e) {
    console.error("Failed to save checked items to LocalStorage", e);
  }
}

export function loadAnswers() {
  try {
    const data = localStorage.getItem(STORAGE_KEY_ANSWERS);
    return data ? JSON.parse(data) : {};
  } catch (e) {
    console.error("Failed to load answers from LocalStorage", e);
    return {};
  }
}

export function saveAnswers(answers) {
  try {
    localStorage.setItem(STORAGE_KEY_ANSWERS, JSON.stringify(answers));
  } catch (e) {
    console.error("Failed to save answers to LocalStorage", e);
  }
}

export function loadFontSize() {
  return localStorage.getItem(STORAGE_KEY_FONT_SIZE) || "normal";
}

export function saveFontSize(size) {
  localStorage.setItem(STORAGE_KEY_FONT_SIZE, size);
}

export function clearAllData() {
  localStorage.removeItem(STORAGE_KEY_CHECKED);
  localStorage.removeItem(STORAGE_KEY_ANSWERS);
}
