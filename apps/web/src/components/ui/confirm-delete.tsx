import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from './alert-dialog';

interface IConfirmDialogProps {
  title: string;
  description?: string | React.ReactNode;
  primaryButton?: string;
  isDisable?: boolean;
  isOpen: boolean;
  sizeModal?: 'default' | 'sm';
  media?: React.ReactNode;
  onClose: () => void;
  onConfirm?: () => void;
}

export function ConfirmDialog({
  title,
  description,
  primaryButton,
  isDisable,
  isOpen,
  sizeModal,
  media,
  onClose,
  onConfirm,
}: IConfirmDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent size={sizeModal}>
        <AlertDialogHeader>
          {media && (
            <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive size-10 *:[svg:not([class*='size-'])]:size-6">
              {media}
            </AlertDialogMedia>
          )}
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            variant="outline"
            disabled={isDisable}
            onClick={onClose}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={(e) => {
              e.preventDefault();
              onConfirm?.();
            }}
            disabled={isDisable}
          >
            {primaryButton ? primaryButton : 'Delete'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
