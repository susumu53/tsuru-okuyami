/**
 * 都留市 お悔やみハンドブック - 診断エンジン ＆ フィルタリングロジック
 */

import { PROCEDURES } from './data.js';

export function filterProcedures(answers) {
  if (!answers || Object.keys(answers).length === 0) {
    return PROCEDURES;
  }

  // 選択された全回答オプションIDの配列を取得
  const selectedOptions = Object.values(answers).flat();

  if (selectedOptions.length === 0) {
    return PROCEDURES;
  }

  return PROCEDURES.filter(proc => {
    // 条件指定なし（空配列）の場合は全員対象
    if (!proc.conditions || proc.conditions.length === 0) {
      return true;
    }
    // 該当する条件が少なくとも1つ一致するか判定
    return proc.conditions.some(cond => selectedOptions.includes(cond));
  });
}

export function filterByCategory(procedures, categoryId) {
  if (!categoryId || categoryId === 'all') {
    return procedures;
  }
  return procedures.filter(proc => proc.category === categoryId);
}

export function filterByDeadline(procedures, deadlineId) {
  if (!deadlineId || deadlineId === 'all') {
    return procedures;
  }
  return procedures.filter(proc => proc.deadlineCategory === deadlineId);
}
