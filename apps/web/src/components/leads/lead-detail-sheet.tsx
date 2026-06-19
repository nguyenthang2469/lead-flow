import { ELeadStatus, TLead } from '@repo/types';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '../ui/sheet';
import { useUpdateLead } from '@/hooks/useLeads';
import { useUsers } from '@/hooks/useUsers';
import { z } from 'zod/v4';
import { Controller, useForm } from 'react-hook-form';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { useEffect } from 'react';
import { Button } from '../ui/button';
import { Loader2 } from 'lucide-react';
import { Field, FieldError, FieldGroup, FieldLabel } from '../ui/field';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { LEAD_STATUS_LIST } from '@/lib/constant';

const formSchema = z.object({
  status: z.enum(ELeadStatus),
  assignedTo: z.string().nullable(),
});

type FormValues = z.infer<typeof formSchema>;

interface ILeadDetailSheetProps {
  lead: TLead | null;
  isOpen: boolean;
  onClose: () => void;
}

export function LeadDetailSheet({
  lead,
  isOpen,
  onClose,
}: ILeadDetailSheetProps) {
  const { updateLead, isUpdating } = useUpdateLead();
  const { users } = useUsers();

  const form = useForm<FormValues>({
    resolver: standardSchemaResolver(formSchema),
    defaultValues: {
      status: ELeadStatus.NEW,
      assignedTo: 'unassigned',
    },
  });

  useEffect(() => {
    if (lead) {
      form.reset({
        status: lead.status as FormValues['status'],
        assignedTo: lead.assignedTo as FormValues['assignedTo'],
      });
    }
  }, [form, lead]);

  const onSubmit = (values: FormValues) => {
    if (!lead) return;

    updateLead(
      {
        id: lead.id,
        data: {
          status: values.status,
          assignedTo:
            values.assignedTo === 'unassigned' ? null : values.assignedTo,
        },
      },
      {
        onSuccess: onClose,
      }
    );
  };

  if (!lead) return null;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="overflow-y-auto sm:max-w-106.25">
        <SheetHeader className="mb-6">
          <SheetTitle>Customer details</SheetTitle>
          <SheetDescription>
            Update status and person in charge for {lead.customerName}
          </SheetDescription>
        </SheetHeader>

        <div className="grid gap-6 px-4">
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div className="flex justify-between font-medium text-slate-500">
              <span>Customer name</span>:
            </div>
            <span className="col-span-2 font-semibold">
              {lead.customerName}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div className="flex justify-between font-medium text-slate-500">
              <span>Platform</span>:
            </div>
            <span className="col-span-2 font-semibold">{lead.platform}</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div className="flex justify-between font-medium text-slate-500">
              <span>Message</span>:
            </div>
            <span className="col-span-2 rounded-md bg-slate-50 p-2 text-slate-700 italic">
              &quot;{lead.message}&quot;
            </span>
          </div>

          <div className="my-2 h-px bg-slate-200" />

          <form
            id="form-update-lead"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <FieldGroup>
              <Controller
                name="status"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field
                    orientation="responsive"
                    data-invalid={fieldState.invalid}
                    className="flex-row"
                  >
                    <FieldLabel htmlFor="form-update-lead-status">
                      Status
                    </FieldLabel>
                    <Select
                      name={field.name}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      autoComplete="off"
                    >
                      <SelectTrigger
                        id="form-update-lead-status"
                        aria-invalid={fieldState.invalid}
                        className="min-w-30"
                      >
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        {LEAD_STATUS_LIST.map((status) => (
                          <SelectItem key={status.value} value={status.value}>
                            {status.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="assignedTo"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field
                    orientation="responsive"
                    data-invalid={fieldState.invalid}
                    className="flex-row"
                  >
                    <FieldLabel htmlFor="form-update-lead-assignedTo">
                      Assigned to
                    </FieldLabel>
                    <Select
                      name={field.name}
                      onValueChange={field.onChange}
                      defaultValue={field.value || 'unassigned'}
                      autoComplete="off"
                    >
                      <SelectTrigger
                        id="form-update-lead-assignedTo"
                        aria-invalid={fieldState.invalid}
                        className="min-w-30"
                      >
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        <SelectItem value="unassigned">
                          -- Unassigned --
                        </SelectItem>
                        {users?.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            {user.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isUpdating}
              >
                Hủy
              </Button>
              <Button
                type="submit"
                disabled={isUpdating || !form.formState.isDirty}
              >
                {isUpdating && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Lưu thay đổi
              </Button>
            </div>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
