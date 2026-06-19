'use client';

import { Bell, LogOut, User } from 'lucide-react';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { useAuthStore } from '@/store/auth.store';
import { useNotificationsStore } from '@/store/notifications.store';
import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback } from '../ui/avatar';

export const TopBar = () => {
  const { user, logout } = useAuthStore();
  const { notifications, unreadCount, markAllRead } = useNotificationsStore();

  return (
    <header className="bg-card flex h-14 items-center justify-between border-b px-4">
      {/* Mobile Menu Trigger */}
      <div className="font-semibold md:hidden">LeadFlow</div>
      <div className="hidden flex-1 md:block" />
      {/* Right Actions */}
      <div className="flex items-center gap-2">
        {/* Menu notification */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={markAllRead}
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="bg-destructive text-destructive-foreground absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="flex items-center justify-between px-4 py-2">
              <span className="text-sm font-semibold">Notifications</span>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    markAllRead();
                  }}
                  className="text-primary h-auto p-0 text-xs hover:bg-transparent"
                >
                  Mark all as read
                </Button>
              )}
            </div>
            <DropdownMenuSeparator />
            <div className="max-h-75 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-sm text-slate-500">
                  No new notifications
                </div>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`flex flex-col items-start gap-1 border-b px-4 py-3 last:border-0 ${!n.read ? 'bg-slate-50/80' : ''}`}
                  >
                    <span className="text-sm font-medium text-slate-900">
                      {n.title}
                    </span>
                    <span className="text-xs text-slate-600">{n.message}</span>
                    <span className="mt-1 text-[10px] text-slate-400">
                      {formatDistanceToNow(new Date(n.createdAt), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                ))
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Menu user profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-8 w-8 rounded-full focus:ring-0 focus:outline-none"
            >
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                  {user?.name?.substring(0, 2).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-max">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm leading-none font-medium">{user?.name}</p>
                <p className="text-muted-foreground text-xs leading-none">
                  {user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={logout}
              className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-600"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
