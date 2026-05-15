'use client';

import { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import MapBackground from './MapBackground';
import BentoGrid from './BentoGrid';
import { AnalysisReport } from '@/types/rag';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(useGSAP);
}

export default function MasterShell() {
  const [data, setData] = useState<AnalysisReport | null>(null);
  const [loading, setLoading] = useState(true);
  const shellRef = useRef<HTMLDivElement>(null);

  const [toastError, setToastError] = useState<string | null>(null);

  const fetchAnalysis = async (query: string) => {
    setLoading(true);
    setToastError(null);

    // Fade out elements before fetching new data if we already have data
    if (data) {
      await gsap.to('.bento-item', { opacity: 0, y: -10, duration: 0.3, stagger: 0.05 });
    }
    
    setData(null);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
        signal: AbortSignal.timeout(30000) // 30s timeout
      });
      if (res.ok) {
        const json = await res.json();
        if (json.error) throw new Error(json.error);
        setData(json);
      } else {
        throw new Error(`Server returned ${res.status}`);
      }
    } catch (e: any) {
      console.error("API Error:", e);
      setToastError(e.name === 'TimeoutError' ? 'Request timed out. Please try again.' : 'Failed to fetch analysis. Try a different query.');
      
      // Animate back the old data if we have it, or just show empty state
      gsap.to('.bento-item', { opacity: 1, y: 0, duration: 0.5 });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Initial "Bloomberg Default" Cinematic Boot-up query
    fetchAnalysis("What is the outlook for commercial plots in DHA Phase 6?");
  }, []);

  useGSAP(() => {
    // The Cinematic Boot-Up Entrance Sequence
    const tl = gsap.timeline();

    // 1. Mapbox background slow fade from black
    tl.fromTo('.mapbox-container', { opacity: 0 }, { opacity: 1, duration: 2.5, ease: 'power2.inOut' });

    // 2. Bento Grid elements spring in from slightly above/below
    gsap.set('.bento-item', { y: 30, opacity: 0 });
    tl.to('.bento-item', {
      opacity: 1,
      y: 0,
      duration: 1.2,
      stagger: 0.1,
      ease: 'elastic.out(1, 0.8)',
    }, "-=1.5");

  }, { scope: shellRef });

  return (
    <div ref={shellRef} className="relative w-full min-h-screen bg-transparent font-sans text-neutral-100 selection:bg-teal-500/30">
      <MapBackground />
      <div className="relative z-10 w-full pb-24">
         <BentoGrid data={data} loading={loading} onSearch={fetchAnalysis} />
      </div>

      {toastError && (
        <div className="fixed bottom-4 right-4 z-50 bg-red-500/20 border border-red-500/50 backdrop-blur-md text-white px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3">
          <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          {toastError}
        </div>
      )}
    </div>
  );
}
