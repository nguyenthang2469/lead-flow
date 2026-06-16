import LoginForm from '@/components/auth/LoginForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Login - LeadFlow',
};

export default function LoginPage() {
  return (
    <div className="bg-muted/40 flex min-h-screen items-center justify-center">
      <LoginForm />
    </div>
  );
}
