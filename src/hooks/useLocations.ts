import { useQuery } from '@tanstack/react-query';
import { fetchLocations } from '../api/services/locations';

export function useLocations() {
  return useQuery({
    queryKey: ['locations'],
    queryFn: fetchLocations,
    staleTime: Infinity,
  });
}
