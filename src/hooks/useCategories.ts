import { useQuery } from '@tanstack/react-query';
import { fetchCategories } from '../api/services/categories';

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: Infinity,
  });
}
