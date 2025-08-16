
import { useMateriais } from './useMateriais';

export const useMaterial = (refreshKey: number = 0) => {
  return useMateriais(refreshKey);
};
