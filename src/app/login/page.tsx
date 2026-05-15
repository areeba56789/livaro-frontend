import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import LoginForm from './LoginForm';

export default async function LoginPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    redirect('/dashboard');
  }

  return (
    <main className="w-full min-h-screen bg-neutral-950 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-teal-900/20 via-neutral-950 to-neutral-950 -z-10" />
      
      {/* Glassmorphic Login Card */}
      <div className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-[0_8px_32px_rgba(0,0,0,0.5)] z-10">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-light text-white tracking-tight">Livaro</h1>
          <p className="text-white/50 text-sm mt-2 uppercase tracking-widest font-semibold">Elite Real Estate Analyst</p>
        </div>

        <LoginForm />
        
      </div>
    </main>
  );
}
