'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useUsers } from '@/hooks/useUsers';
import { useAssignLead } from '@/hooks/useLeads';
import { Loader2 } from 'lucide-react';

interface AssignLeadModalProps {
  leadId: string;
  currentAssigneeId: string | null;
  open: boolean;
  onClose: () => void;
}

export function AssignLeadModal({
  leadId,
  currentAssigneeId,
  open,
  onClose,
}: AssignLeadModalProps) {
  const { data: users = [], isLoading: loadingUsers } = useUsers();
  const assignLead = useAssignLead();
  const [selectedUserId, setSelectedUserId] = useState<string>(
    currentAssigneeId ?? 'unassign'
  );

  const handleSubmit = () => {
    assignLead.mutate(
      {
        id: leadId,
        assignedToId: selectedUserId === 'unassign' ? null : selectedUserId,
      },
      { onSuccess: onClose }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Assign Lead</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Select value={selectedUserId} onValueChange={setSelectedUserId}>
            <SelectTrigger>
              <SelectValue placeholder="Select a team member..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="unassign">Unassigned</SelectItem>
              {loadingUsers ? (
                <SelectItem value="loading" disabled>
                  Loading...
                </SelectItem>
              ) : (
                users.map((u) => (
                  <SelectItem key={u.id} value={u.id}>
                    {u.name} ({u.email})
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={assignLead.isPending}>
            {assignLead.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
