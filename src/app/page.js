'use client'

import dynamic from 'next/dynamic'

// Remove the dynamic import and import directly
import GolfLeagueApp from '../components/GolfLeagueApp'

export default function Home() {
  return (
    <div className="min-h-screen">
      <GolfLeagueApp />
    </div>
  )
}