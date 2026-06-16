'use client';

import { useEffect } from 'react';
import { useNotificationsStore } from '@/store/notifications.store';
import { toast } from 'sonner';
import type { TLead } from '@repo/types';
import { useAuthStore } from '@/store/auth.store';
import { socket } from '@/lib/socket';

export function useLeadsSocket() {
  const user = useAuthStore((s) => s.user);
  // const qc = useQueryClient();
  const addNotification = useNotificationsStore((s) => s.addNotification);

  useEffect(() => {
    if (!user) {
      socket.disconnect();
      return;
    }

    if (!socket.connected) {
      socket.connect();
    }

    const onNewLead = (lead: TLead) => {
      // void qc.invalidateQueries({ queryKey: ['leads'] });
      // void qc.invalidateQueries({ queryKey: ['dashboard'] });
      addNotification({
        title: 'New lead received',
        message: `${lead.customerName} via ${lead.platform}`,
        type: 'info',
      });
      toast.info(`New lead: ${lead.customerName}`);
    };

    socket.on('lead.created', onNewLead);

    const onUpdatedLead = () => {
      // void qc.invalidateQueries({ queryKey: ['leads'] });
    };

    socket.on('lead.updated', onUpdatedLead);

    return () => {
      socket.off('lead.created', onNewLead);
      socket.off('lead.updated', onUpdatedLead);
      socket.disconnect();
    };
  }, [addNotification, user]);
}
