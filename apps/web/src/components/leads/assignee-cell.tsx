'use client';

import { useUsers } from '@/hooks/useUsers';
import { Avatar, AvatarFallback } from '../ui/avatar';

export function AssigneeCell({ assignedTo }: { assignedTo: string | null }) {
  const { users } = useUsers();

  const currentAssignee = users?.find((u) => u.id === assignedTo);

  if (!currentAssignee) {
    return <span className="text-sm text-slate-400 italic">Unassigned</span>;
  }

  return (
    <div className="flex items-center gap-2">
      <Avatar className="h-6 w-6">
        <AvatarFallback className="bg-primary/10 text-primary text-[10px]">
          {currentAssignee.name.substring(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <span className="text-sm font-medium">{currentAssignee.name}</span>
    </div>
  );
}
