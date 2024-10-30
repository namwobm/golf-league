'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './components/ui/card';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';

const GolfLeagueApp = () => {
  const [players, setPlayers] = useState([]);
  const [weeks, setWeeks] = useState([]);
  const [currentWeek, setCurrentWeek] = useState(1);
  const [courseName, setCourseName] = useState('');
  
  const [newPlayerName, setNewPlayerName] = useState('');
  const [newPlayerHandicap, setNewPlayerHandicap] = useState('');

  const addPlayer = () => {
    if (newPlayerName && newPlayerHandicap) {
      const newPlayer = {
        id: players.length + 1,
        name: newPlayerName,
        handicap: parseFloat(newPlayerHandicap),
        scores: [],
        weeklyPoints: Array(10).fill(0)
      };
      setPlayers([...players, newPlayer]);
      setNewPlayerName('');
      setNewPlayerHandicap('');
    }
  };

  const calculateSeasonStandings = () => {
    return players.map(player => {
      const sortedPoints = [...player.weeklyPoints].sort((a, b) => b - a);
      const top8Points = sortedPoints.slice(0, 8);
      const totalPoints = top8Points.reduce((sum, points) => sum + points, 0);

      return {
        name: player.name,
        totalPoints,
        handicap: player.handicap
      };
    }).sort((a, b) => b.totalPoints - a.totalPoints);
  };

  const calculatePrizeMoney = () => {
    const totalPrize = players.length * 100;
    const weeklyPrize = totalPrize * 0.5 / 10;
    const seasonPrize = totalPrize * 0.5;

    return {
      weeklyPrize,
      seasonPrizes: {
        first: seasonPrize * 0.5,
        second: seasonPrize * 0.3,
        third: seasonPrize * 0.2
      }
    };
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Golf League Management</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Player Name</label>
                <Input
                  value={newPlayerName}
                  onChange={(e) => setNewPlayerName(e.target.value)}
                  placeholder="Enter player name"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium mb-1">Starting Handicap</label>
                <Input
                  type="number"
                  value={newPlayerHandicap}
                  onChange={(e) => setNewPlayerHandicap(e.target.value)}
                  placeholder="Enter handicap"
                />
              </div>
              <Button onClick={addPlayer}>Add Player</Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="text-left p-2 border-b border-gray-200 bg-gray-50">Player</th>
                    <th className="text-left p-2 border-b border-gray-200 bg-gray-50">Handicap</th>
                    <th className="text-left p-2 border-b border-gray-200 bg-gray-50">Season Points</th>
                  </tr>
                </thead>
                <tbody>
                  {calculateSeasonStandings().map((player, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="p-2 border-b border-gray-200">{player.name}</td>
                      <td className="p-2 border-b border-gray-200">{player.handicap.toFixed(1)}</td>
                      <td className="p-2 border-b border-gray-200">{player.totalPoints}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Prize Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                {(() => {
                  const { weeklyPrize, seasonPrizes } = calculatePrizeMoney();
                  return (
                    <div className="space-y-2">
                      <p>Weekly Prize: ${weeklyPrize.toFixed(2)}</p>
                      <p>Season Prizes:</p>
                      <ul className="list-disc pl-6">
                        <li>1st Place: ${seasonPrizes.first.toFixed(2)}</li>
                        <li>2nd Place: ${seasonPrizes.second.toFixed(2)}</li>
                        <li>3rd Place: ${seasonPrizes.third.toFixed(2)}</li>
                      </ul>
                    </div>
                  );
                })()}
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GolfLeagueApp;