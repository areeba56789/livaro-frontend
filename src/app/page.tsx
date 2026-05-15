import Link from 'next/link';
import { ArrowRight, BrainCircuit } from 'lucide-react';

export default function Home() {
  return (
    <main className="w-full min-h-screen bg-neutral-950 flex flex-col relative overflow-hidden">
      {/* Navigation */}
      <nav className="w-full p-6 flex justify-between items-center z-20">
        <div className="flex items-center gap-2">
          <BrainCircuit className="w-6 h-6 text-teal-400" />
          <span className="text-xl font-light tracking-tight text-white">Livaro</span>
        </div>
        <Link href="/login" className="px-5 py-2 bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 rounded-full text-sm font-semibold text-white transition-colors">
          Login
        </Link>
      </nav>

      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center z-10">
        <h1 className="text-5xl md:text-7xl font-light text-white tracking-tighter mb-6">
          The <span className="text-teal-400 font-normal">Elite</span> AI Real Estate Analyst.
        </h1>
        <p className="text-lg md:text-xl text-white/50 max-w-2xl mb-12 font-light">
          Harness the power of the Livaro RAG engine to evaluate vector space sentiment, extrapolate yields, and pinpoint undervalued assets with ruthless precision.
        </p>
        
        <Link href="/login" className="group relative px-8 py-4 bg-teal-500 hover:bg-teal-400 text-white rounded-full font-semibold transition-all shadow-[0_0_30px_rgba(20,184,166,0.3)] flex items-center gap-3">
          Enter the Palantir
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-teal-900/20 rounded-full blur-[120px] pointer-events-none" />
    </main>
  );
}
