
import { useFerramentasData } from './useFerramentasData';

export const useFerramentas = (refreshKey: number = 0) => {
  const { ferramentas, loading, refetch } = useFerramentasData(refreshKey);

  console.log('Estado atual useFerramentas:', { 
    totalFerramentas: ferramentas.length, 
    loading,
    refreshKey
  });

  return {
    ferramentas,
    loading,
    refetch
  };
};
