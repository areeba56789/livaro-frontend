'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';
import { User, LogOut, Settings, CreditCard } from 'lucide-react';

export default function TopNav() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <header className="h-20 w-full flex items-center justify-end px-8 z-50 pointer-events-auto">
      <div className="relative">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-md transition-all focus:outline-none"
        >
          <User className="w-5 h-5 text-white" />
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-3 w-56 bg-neutral-900 border border-white/10 rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.8)] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
            <div className="py-2">
              <button className="w-full px-4 py-3 text-left flex items-center gap-3 text-sm text-white/80 hover:bg-white/5 hover:text-white transition-colors">
                <Settings className="w-4 h-4" />
                Profile Settings
              </button>
              <button className="w-full px-4 py-3 text-left flex items-center gap-3 text-sm text-white/80 hover:bg-white/5 hover:text-white transition-colors">
                <CreditCard className="w-4 h-4" />
                Billing
              </button>
              <div className="h-px w-full bg-white/10 my-1" />
              <button 
                onClick={handleLogout}
                className="w-full px-4 py-3 text-left flex items-center gap-3 text-sm text-red-400 hover:bg-red-400/10 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
