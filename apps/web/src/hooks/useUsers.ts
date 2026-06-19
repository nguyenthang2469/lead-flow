import { useQuery } from '@tanstack/react-query';
import type { TUser } from '@repo/types';
import { reqGetListUsers } from '@/services/user.service';

export function useUsers() {
  const { data, isLoading } = useQuery<TUser[]>({
    queryKey: ['users'],
    queryFn: ({ signal }) => reqGetListUsers(signal),
  });
  return { isLoading, users: data };
}
