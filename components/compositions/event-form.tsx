"use client"

import React, { } from "react"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useForm } from "@tanstack/react-form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Spinner } from "@/components/ui/spinner"
import { cn } from "@/lib/utils"
import { TimePicker } from "../ui/time-picker"
import Link from "next/link"
import { DatePicker } from "../ui/date-picker"
import { FormEvent, FormEventSchema } from "@/lib/schema"
import { addHours } from "date-fns"
import { ArrowRight } from "lucide-react"

export interface EventFormProps {
  initialValues?: Partial<FormEvent> & { from?: Date; to?: Date };
  onSubmitAction: (data: { name: string; description?: string | null; from: Date; to: Date }) => void;
  isPending?: boolean;
  onCancel?: () => void;
  submitLabel?: string;
  cancelLabel?: string;
}

export function EventForm({
  initialValues,
  onSubmitAction,
  isPending = false,
  onCancel,
  submitLabel = 'Save',
  cancelLabel = 'Cancel',
}: EventFormProps) {
  const now = new Date();
  const pad = (n: number) => n.toString().padStart(2, '0');

  // Helper to parse time string
  const parseTime = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    return { hours, minutes };
  };

  // Setup default values for create/edit
  const defaultFrom = initialValues?.fromDate || initialValues?.from || now;
  const defaultTo = initialValues?.toDate || initialValues?.to || addHours(now, 1);
  const defaultFromTime = initialValues?.fromTime || `${pad(new Date(defaultFrom).getHours())}:00`;
  const defaultToTime = initialValues?.toTime || `${pad(new Date(defaultTo).getHours())}:00`;

  const form = useForm({
    defaultValues: {
      name: initialValues?.name || '',
      description: initialValues?.description ?? '',
      fromDate: defaultFrom,
      fromTime: defaultFromTime,
      toDate: defaultTo,
      toTime: defaultToTime,
    } as FormEvent,
    onSubmit: async ({ value }) => {
      const from = new Date(value.fromDate);
      const { hours: fromHours, minutes: fromMinutes } = parseTime(value.fromTime);
      from.setHours(fromHours, fromMinutes);
      const to = new Date(value.toDate);
      const { hours: toHours, minutes: toMinutes } = parseTime(value.toTime);
      to.setHours(toHours, toMinutes);
      onSubmitAction({
        name: value.name,
        description: value.description,
        from,
        to,
      });
    },
    validators: {
      onMount: ({ value }) => {
        const errors = FormEventSchema.shape.name.safeParse(value.name);
        if (!errors.success) {
          return errors.error.issues.map((issue) => issue.message).join(', ');
        }
        return undefined;
      },
      onChange: ({ value }) => {
        const errorsFrom = FormEventSchema.shape.fromTime.safeParse(value.fromTime);
        if (!errorsFrom.success) {
          return errorsFrom.error.issues.map((issue) => issue.message).join(', ');
        }
        const errorsTo = FormEventSchema.shape.toTime.safeParse(value.toTime);
        if (!errorsTo.success) {
          return errorsTo.error.issues.map((issue) => issue.message).join(', ');
        }
        const { hours: fromHours, minutes: fromMinutes } = parseTime(value.fromTime);
        const { hours: toHours, minutes: toMinutes } = parseTime(value.toTime);
        if (fromHours > toHours || (fromHours === toHours && fromMinutes > toMinutes)) {
          return 'Start time must be before end time';
        }
      },
    },
  });

  return (
    <div className="max-w-md mx-auto w-full h-full content-center">
      <Card className="border-0 shadow-none">
        <CardContent className="p-0 space-y-4">
          <div className="border-b pb-3">
            <form.Field name="name"
              validators={{
                onChange: ({ value }) => {
                  const errors = FormEventSchema.shape.name.safeParse(value);
                  if (!errors.success) {
                    return errors.error.issues.map((issue) => issue.message).join(', ');
                  }
                  return undefined;
                },
                onMount: ({ value }) => {
                  const errors = FormEventSchema.shape.name.safeParse(value);
                  if (!errors.success) {
                    return errors.error.issues.map((issue) => issue.message).join(', ');
                  }
                  return undefined;
                },
              }}
            >
              {(field) => (
                <div className="space-y-2">
                  <Label htmlFor="event-name">Event Name</Label>
                  <Input
                    id="event-name"
                    className="border-b focus-visible:ring-0 focus-visible:ring-offset-0"
                    placeholder="Title"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  {field.state.meta.errorMap['onChange'] && (
                    <em className="text-red-500 text-xs" role="alert">
                      {field.state.meta.errorMap['onChange']}
                    </em>
                  )}
                </div>
              )}
            </form.Field>
          </div>

          <form.Field name="description">
            {(field) => (
              <div className="space-y-2">
                <Label htmlFor="event-desc">Description</Label>
                <Textarea
                  id="event-desc"
                  value={field.state.value || ''}
                  onChange={(e) => field.handleChange(e.target.value)}
                  rows={3}
                  className="resize-none"
                />
              </div>
            )}
          </form.Field>

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <form.Field name="fromDate">
                {(field) => (
                  <DatePicker date={field.state.value} setDate={(date) => {
                    const toDate = field.form.getFieldValue('toDate');
                    if (date > toDate) {
                      form.setFieldValue('toDate', date);
                    }
                    field.handleChange(date);
                  }} />
                )}
              </form.Field>
              <form.Field name="fromTime">
                {(field) => (
                  <TimePicker value={field.state.value} onChange={field.handleChange} />
                )}
              </form.Field>
            </div>

            <div className="text-gray-400"><ArrowRight width={16} /></div>

            <div className="space-y-1">
              <form.Field name="toDate">
                {(field) => (
                  <DatePicker date={field.state.value} setDate={(date) => {
                    const fromDate = field.form.getFieldValue('fromDate');
                    if (date < fromDate) {
                      form.setFieldValue('fromDate', date);
                    }
                    field.handleChange(date);
                  }} />
                )}
              </form.Field>
              <form.Field name="toTime">
                {(field) => (
                  <TimePicker value={field.state.value} onChange={field.handleChange} />
                )}
              </form.Field>
            </div>
          </div>
          <form.Subscribe selector={(state) => state.errorMap}>
            {(formErrorMap) => (
              <>
                {formErrorMap['onChange'] && (
                  <em className="text-red-500 text-xs" role="alert">
                    {formErrorMap['onChange']}
                  </em>
                )}
              </>
            )}
          </form.Subscribe>

          <div className="flex justify-end pt-4 gap-x-4">
            <form.Subscribe selector={(state) => state}>
              {(state) => (
                <>
                  {onCancel ? (
                    <Button
                      type="button"
                      variant="outline"
                      className="rounded-full ml-2"
                      onClick={onCancel}
                      disabled={isPending || state.isSubmitting}
                    >
                      {cancelLabel}
                    </Button>
                  ) : (
                    <Link
                      type="button"
                      href={"/"}
                      className={cn(buttonVariants({ variant: "outline" }), "rounded-full ml-2", isPending || state.isSubmitting && "opacity-50")}
                      onClick={() => form.reset()}
                    >
                      {cancelLabel}
                    </Link>
                  )}
                  <Button
                    type="button"
                    className="rounded-full"
                    disabled={!state.canSubmit || isPending || state.isSubmitting}
                    onClick={() => form.handleSubmit()}
                  >
                    {isPending || state.isSubmitting ? <Spinner className="mr-2" /> : null}
                    {isPending || state.isSubmitting ? 'Saving...' : submitLabel}
                  </Button>
                </>
              )}
            </form.Subscribe>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}