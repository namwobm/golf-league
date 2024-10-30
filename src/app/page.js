'use client';

import dynamic from 'next/dynamic';

const GolfLeagueApp = dynamic(() => import('../components/GolfLeagueApp'), { ssr: false });

export default function Home() {
  return (
    <main className="min-h-screen p-4">
      <GolfLeagueApp />
    </main>
  );
}