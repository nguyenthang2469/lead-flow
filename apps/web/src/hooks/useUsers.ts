import { useQuery } from '@tanstack/react-query';
import type { TUser } from '@repo/types';
import { reqGetListUsers } from '@/services/user.service';

export function useUsers() {
  return useQuery<TUser[]>({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await reqGetListUsers();
      return res.data.data;
    },
  });
}
