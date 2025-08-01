// src/api/types.tsx

export type Country = '国内' | '海外' | 'イン・ジャパン';

export type UserOptions = {
  [key in Country]?: {
    regions?: {
      [region: string]: string[];
    };
    names?: string[];
  };
};