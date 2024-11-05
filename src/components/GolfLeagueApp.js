'use client'

import React, { useState, useEffect } from 'react'
import { 
  Download, 
  Upload, 
  Printer, 
  Mail, 
  ChevronLeft, 
  ChevronRight, 
  LineChart as LineChartIcon 
} from 'lucide-react'
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts'
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Input
} from './ui'

// Component definitions
const Card = ({ children, className = '' }) => (
  <div className={`bg-white rounded-lg shadow ${className}`}>{children}</div>
)

const CardHeader = ({ children }) => (
  <div className="p-6">{children}</div>
)

const CardTitle = ({ children }) => (
  <h2 className="text-2xl font-bold text-black">{children}</h2>
)

const CardContent = ({ children }) => (
  <div className="p-6 pt-0">{children}</div>
)

const Button = ({ children, className = '', ...props }) => (
  <button 
    className={`px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    {...props}
  >
    {children}
  </button>
)

const Input = ({ className = '', ...props }) => (
  <input 
    className={`w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black ${className}`}
    {...props}
  />
)

function GolfLeagueApp() {
  // State declarations
  const [mounted, setMounted] = useState(false)
  const [players, setPlayers] = useState([])
  const [currentWeek, setCurrentWeek] = useState(1)
  const [courseName, setCourseName] = useState('')
  const [coursePars, setCoursePars] = useState(Array(9).fill(4))
  const [newPlayerName, setNewPlayerName] = useState('')
  const [newPlayerHandicap, setNewPlayerHandicap] = useState('')
  const [showScoreEntry, setShowScoreEntry] = useState(false)
  const [selectedPlayer, setSelectedPlayer] = useState(null)
  const [currentScores, setCurrentScores] = useState(Array(9).fill(''))
  const [scoreHistory, setScoreHistory] = useState({})
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const [showStats, setShowStats] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [seasonEnded, setSeasonEnded] = useState(false)
  const [courseHistory, setCourseHistory] = useState({})

  // Initial mounting effect
  useEffect(() => {
    if (typeof window === 'undefined') return
    
    const loadData = () => {
      try {
        const savedData = localStorage.getItem('golfLeagueData')
        if (savedData) {
          const data = JSON.parse(savedData)
          setPlayers(data.players || [])
          setScoreHistory(data.scoreHistory || {})
          setCurrentWeek(data.currentWeek || 1)
          setCourseName(data.courseName || '')
          setCoursePars(data.coursePars || Array(9).fill(4))
          setSeasonEnded(data.seasonEnded || false)
          setCourseHistory(data.courseHistory || {})
        }
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setMounted(true)
      }
    }

    loadData()
  }, [])

  // Data saving effect
  useEffect(() => {
    if (!mounted || typeof window === 'undefined') return

    const saveData = () => {
      try {
        const dataToSave = {
          players,
          scoreHistory,
          currentWeek,
          courseName,
          coursePars,
          seasonEnded,
          courseHistory
        }
        localStorage.setItem('golfLeagueData', JSON.stringify(dataToSave))
      } catch (error) {
        console.error('Error saving data:', error)
      }
    }

    saveData()
  }, [players, scoreHistory, currentWeek, courseName, coursePars, seasonEnded, courseHistory, mounted])

  // Season end check effect
  useEffect(() => {
    if (currentWeek > 12) {
      setSeasonEnded(true)
    }
  }, [currentWeek])
  // Utility functions
  const calculateStablefordPoints = (scores) => {
    return scores.reduce((total, score, index) => {
      const par = coursePars[index]
      const difference = score - par
      
      if (difference >= 2) return total + 0      
      if (difference === 1) return total + 1     
      if (difference === 0) return total + 2     
      if (difference === -1) return total + 3    
      return total + 4                           
    }, 0)
  }

  const calculateSeasonPoints = (weeklyPoints) => {
    const sortedPoints = [...weeklyPoints].sort((a, b) => b - a)
    return sortedPoints.slice(0, 10).reduce((sum, points) => sum + points, 0)
  }

  const calculateHandicapAdjustment = (scores, pars, currentHandicap) => {
    const totalPar = pars.reduce((sum, par) => sum + par, 0)
    const totalScore = scores.reduce((sum, score) => sum + parseInt(score), 0)
    const difference = totalScore - totalPar
    
    let adjustment = 0
    if (difference > 0) {
      adjustment = difference * 0.1
    } else {
      adjustment = difference * 0.2
    }
    
    adjustment = Math.max(-1, Math.min(1, adjustment))
    return Math.round((currentHandicap + adjustment) * 10) / 10
  }

  // Action handlers
  const addPlayer = () => {
    if (newPlayerName && newPlayerHandicap) {
      const newPlayer = {
        id: Date.now(), // Using timestamp as unique ID
        name: newPlayerName,
        handicap: parseFloat(newPlayerHandicap),
        scores: {},
        weeklyPoints: Array(12).fill(0)
      }
      setPlayers([...players, newPlayer])
      setNewPlayerName('')
      setNewPlayerHandicap('')
    }
  }

  const savePlayerScores = () => {
    if (!selectedPlayer || !mounted) return

    if (!currentScores.every(score => score !== '' && !isNaN(score))) {
      alert('Please enter valid scores for all holes')
      return
    }

    const scores = currentScores.map(score => parseInt(score))
    const points = calculateStablefordPoints(scores)
    const newHandicap = calculateHandicapAdjustment(
      scores, 
      coursePars, 
      selectedPlayer.handicap
    )

    setCourseHistory(prev => ({
      ...prev,
      [courseName]: [
        ...(prev[courseName] || []),
        {
          week: currentWeek,
          playerId: selectedPlayer.id,
          scores,
          points,
          date: new Date().toISOString()
        }
      ]
    }))

    setPlayers(players.map(player => {
      if (player.id === selectedPlayer.id) {
        const newWeeklyPoints = [...player.weeklyPoints]
        newWeeklyPoints[currentWeek - 1] = points
        return {
          ...player,
          handicap: newHandicap,
          scores: {
            ...player.scores,
            [currentWeek]: scores
          },
          weeklyPoints: newWeeklyPoints
        }
      }
      return player
    }))

    setShowScoreEntry(false)
    setSelectedPlayer(null)
    setCurrentScores(Array(9).fill(''))
  }

  // Component functions
  const WeekNavigation = () => (
    <div className="flex justify-between items-center mb-4">
      <Button 
        onClick={() => setCurrentWeek(Math.max(1, currentWeek - 1))}
        disabled={currentWeek === 1}
      >
        <ChevronLeft className="w-4 h-4 mr-2" />
        Previous Week
      </Button>
      <h2 className="text-xl font-bold text-black">Week {currentWeek} of 12</h2>
      <Button 
        onClick={() => currentWeek < 12 && setCurrentWeek(currentWeek + 1)}
        disabled={currentWeek === 12}
      >
        Next Week
        <ChevronRight className="w-4 h-4 ml-2" />
      </Button>
    </div>
  )

  const CourseSetup = () => (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Course Setup - Week {currentWeek}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-black">Course Name</label>
            <Input 
              type="text"
              value={courseName}
              onChange={(e) => setCourseName(e.target.value)}
              placeholder="Enter course name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2 text-black">Par for Each Hole</label>
            <div className="grid grid-cols-9 gap-2">
              {coursePars.map((par, index) => (
                <div key={index}>
                  <label className="block text-xs mb-1 text-black">Hole {index + 1}</label>
                  <Input
                    type="number"
                    min="3"
                    max="5"
                    value={par}
                    onChange={(e) => {
                      const newPars = [...coursePars]
                      newPars[index] = parseInt(e.target.value) || 4
                      setCoursePars(newPars)
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const LeaderboardView = () => {
    const standings = players
      .map(player => ({
        name: player.name,
        totalPoints: calculateSeasonPoints(player.weeklyPoints),
        weeklyPoints: player.weeklyPoints[currentWeek - 1] || 0,
        handicap: player.handicap
      }))
      .sort((a, b) => b.totalPoints - a.totalPoints)

    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Leaderboard</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left p-2 border-b border-gray-200 bg-gray-50 text-black">Position</th>
                <th className="text-left p-2 border-b border-gray-200 bg-gray-50 text-black">Player</th>
                <th className="text-left p-2 border-b border-gray-200 bg-gray-50 text-black">Total Points</th>
                <th className="text-left p-2 border-b border-gray-200 bg-gray-50 text-black">Weekly Points</th>
                <th className="text-left p-2 border-b border-gray-200 bg-gray-50 text-black">Handicap</th>
              </tr>
            </thead>
            <tbody>
              {standings.map((player, index) => (
                <tr key={player.name} className={index < 3 ? 'bg-yellow-50' : ''}>
                  <td className="p-2 border-b border-gray-200 text-black">{index + 1}</td>
                  <td className="p-2 border-b border-gray-200 text-black">{player.name}</td>
                  <td className="p-2 border-b border-gray-200 text-black">{player.totalPoints}</td>
                  <td className="p-2 border-b border-gray-200 text-black">{player.weeklyPoints}</td>
                  <td className="p-2 border-b border-gray-200 text-black">{player.handicap.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    )
  }

  const ScoreEntryModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <Card className="w-full max-w-4xl">
        <CardHeader>
          <CardTitle>Enter Scores - {selectedPlayer?.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-9 gap-2">
              {currentScores.map((score, index) => (
                <div key={index}>
                  <label className="block text-xs mb-1 text-black">
                    Hole {index + 1} (Par {coursePars[index]})
                  </label>
                  <Input
                    type="number"
                    min="1"
                    max="12"
                    value={score}
                    onChange={(e) => {
                      const newScores = [...currentScores]
                      newScores[index] = e.target.value
                      setCurrentScores(newScores)
                    }}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-end space-x-2">
              <Button onClick={savePlayerScores}>Save Scores</Button>
              <Button 
                onClick={() => {
                  setShowScoreEntry(false)
                  setSelectedPlayer(null)
                  setCurrentScores(Array(9).fill(''))
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading Golf League App...</div>
      </div>
    )
  }

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <div className="flex flex-wrap gap-2 mb-4">
        <Button onClick={() => setShowLeaderboard(!showLeaderboard)}>
          {showLeaderboard ? 'Hide Leaderboard' : 'Show Leaderboard'}
        </Button>
        <Button onClick={() => setShowStats(!showStats)}>
          {showStats ? 'Hide Stats' : 'Show Stats'}
        </Button>
      </div>

      {!seasonEnded ? (
        <>
          <WeekNavigation />
          {showLeaderboard && <LeaderboardView />}
          <CourseSetup />
          
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Add Player</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 items-end">
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1 text-black">Player Name</label>
                  <Input
                    type="text"
                    value={newPlayerName}
                    onChange={(e) => setNewPlayerName(e.target.value)}
                    placeholder="Enter player name"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-1 text-black">Starting Handicap</label>
                  <Input
                    type="number"
                    value={newPlayerHandicap}
                    onChange={(e) => setNewPlayerHandicap(e.target.value)}
                    placeholder="Enter handicap"
                  />
                </div>
                <Button onClick={addPlayer}>Add Player</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Week {currentWeek} Scores</CardTitle>
            </CardHeader>
            <CardContent>
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="text-left p-2 border-b border-gray-200 bg-gray-50 text-black">Player</th>
                    <th className="text-left p-2 border-b border-gray-200 bg-gray-50 text-black">Handicap</th>
                    <th className="text-left p-2 border-b border-gray-200 bg-gray-50 text-black">Points</th>
                    <th className="text-left p-2 border-b border-gray-200 bg-gray-50 text-black">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {players.map((player) => (
                    <tr key={player.id} className="hover:bg-gray-50">
                      <td className="p-2 border-b border-gray-200 text-black">{player.name}</td>
                      <td className="p-2 border-b border-gray-200 text-black">{player.handicap.toFixed(1)}</td>
                      <td className="p-2 border-b border-gray-200 text-black">
                        {player.weeklyPoints[currentWeek - 1] || 0}
                      </td>
                      <td className="p-2 border-b border-gray-200">
                        <Button
                          onClick={() => {
                            setSelectedPlayer(player)
                            setCurrentScores(player.scores?.[currentWeek] || Array(9).fill(''))
                            setShowScoreEntry(true)
                          }}
                        >
                          Enter Scores
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </>
      ) : (
        <LeaderboardView />
      )}

      {showScoreEntry && <ScoreEntryModal />}
    </div>
  )
}

export default GolfLeagueApp