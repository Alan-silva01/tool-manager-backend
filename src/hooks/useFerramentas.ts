
import { useFerramentasData } from './useFerramentasData';

export const useFerramentas = (refreshKey: number = 0) => {
  return useFerramentasData(refreshKey);
};
