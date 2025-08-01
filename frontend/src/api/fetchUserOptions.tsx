// src/api/fetchUserOptions.tsx
import type { UserOptions } from './types';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

export const fetchUserOptions = async (): Promise<UserOptions> => {
  const response = await fetch(`${apiBaseUrl}/users-list`);
  if (!response.ok) {
    throw new Error('ユーザー一覧の取得に失敗しました');
  }
  const data: UserOptions = await response.json();
  return data;
};