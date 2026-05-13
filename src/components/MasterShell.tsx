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

  const fetchAnalysis = async (query: string) => {
    setLoading(true);

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
      });
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (e) {
      console.error("API Error:", e);
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
    tl.to('.mapbox-container', { opacity: 1, duration: 2.5, ease: 'power2.inOut' });

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
    <div ref={shellRef} className="relative w-full min-h-screen bg-neutral-950 font-sans text-neutral-100 selection:bg-teal-500/30">
      <MapBackground />
      <div className="relative z-10 w-full pb-24">
         <BentoGrid data={data} loading={loading} onSearch={fetchAnalysis} />
      </div>
    </div>
  );
}
