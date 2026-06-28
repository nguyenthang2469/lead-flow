'use client';

import { EyeOffIcon, Loader2, Zap } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Button } from '../ui/button';
import { useState } from 'react';
import { z } from 'zod/v4';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { standardSchemaResolver } from '@hookform/resolvers/standard-schema';
import { reqLogin } from '@/services/auth.service';
import { useAuthStore } from '@/store/auth.store';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '../ui/input-group';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from '../ui/field';
import { Input } from '../ui/input';

const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .pipe(z.email('Invalid email address')),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginForm = () => {
  const { replace } = useRouter();
  const setUser = useAuthStore((s) => s.setUser);
  const [isShowPassword, setIsShowPassword] = useState(false);

  const {
    handleSubmit,
    formState: { isSubmitting },
    control,
  } = useForm<LoginFormValues>({
    resolver: standardSchemaResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit: SubmitHandler<LoginFormValues> = async (
    data: LoginFormValues
  ) => {
    try {
      const res = await reqLogin(data);
      console.log({ res });
      setUser(res);
      toast.success('Logged in successfully');
      replace('/');
    } catch (e) {
      console.error(e);
      toast.error('Invalid email or password');
    }
  };

  return (
    <Card className="w-full max-w-md shadow-xl">
      <CardHeader className="space-y-1 text-center">
        <div className="mb-2 flex items-center justify-center gap-2">
          <Zap className="text-primary h-7 w-7" />
          <span className="text-2xl font-bold tracking-tight">LeadFlow</span>
        </div>
        <CardTitle className="text-xl">Welcome back</CardTitle>
        <CardDescription>Sign in to your account to continue</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          id="form-login"
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <FieldSet>
            <FieldGroup className="gap-4">
              <Controller
                name="email"
                control={control}
                render={({ field, fieldState }) => (
                  <Field className="gap-2">
                    <FieldLabel htmlFor="email">Email</FieldLabel>
                    <Input
                      {...field}
                      id="email"
                      type="email"
                      required={true}
                      placeholder="you@company.com"
                      aria-invalid={fieldState.invalid}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="password"
                control={control}
                render={({ field, fieldState }) => (
                  <Field className="gap-2">
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        {...field}
                        id="password"
                        type={isShowPassword ? 'text' : 'password'}
                        required={true}
                        placeholder="••••••••"
                        aria-invalid={fieldState.invalid}
                      />
                      <InputGroupAddon
                        className="cursor-pointer"
                        align="inline-end"
                        onClick={() => setIsShowPassword(!isShowPassword)}
                      >
                        <EyeOffIcon />
                      </InputGroupAddon>
                    </InputGroup>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </FieldSet>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign in'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
