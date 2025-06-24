"use client"

import { useState, useEffect } from "react"
import PriorityModal from "./PriorityModal"
import HabitModal from "./HabitModal"
import prioritiesData from "../data/priorities.json"
import habitsData from "../data/habits.json"

const Priorities = ({ onTabChange }) => {
  const [priorities, setPriorities] = useState(() => {
    const saved = localStorage.getItem("weekly-priorities")
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (error) {
        console.error("Error parsing saved priorities:", error)
      }
    }
    return prioritiesData
  })

  const [habits, setHabits] = useState(() => {
    const saved = localStorage.getItem("weekly-habits")
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (error) {
        console.error("Error parsing saved habits:", error)
      }
    }
    return habitsData
  })

  const [showPriorityModal, setShowPriorityModal] = useState(false)
  const [showHabitModal, setShowHabitModal] = useState(false)
  const [selectedPriority, setSelectedPriority] = useState(null)
  const [selectedHabit, setSelectedHabit] = useState(null)

  useEffect(() => {
    localStorage.setItem("weekly-priorities", JSON.stringify(priorities))
  }, [priorities])

  useEffect(() => {
    localStorage.setItem("weekly-habits", JSON.stringify(habits))
  }, [habits])

  const handleAddPriority = () => {
    setSelectedPriority(null)
    setShowPriorityModal(true)
  }

  const handleEditPriority = (priority) => {
    setSelectedPriority(priority)
    setShowPriorityModal(true)
  }

  const handleSavePriority = (priorityData) => {
    if (selectedPriority) {
      setPriorities(
        priorities.map((p) => (p.id === selectedPriority.id ? { ...priorityData, id: selectedPriority.id } : p)),
      )
    } else {
      const newPriority = {
        ...priorityData,
        id: Math.max(...priorities.map((p) => p.id), 0) + 1,
        completed: false,
        createdAt: new Date().toISOString(),
      }
      setPriorities([...priorities, newPriority])
    }
    setShowPriorityModal(false)
    setSelectedPriority(null)
  }

  const handleDeletePriority = (priorityId) => {
    setPriorities(priorities.filter((p) => p.id !== priorityId))
    setShowPriorityModal(false)
    setSelectedPriority(null)
  }

  const handleTogglePriority = (priorityId) => {
    setPriorities(priorities.map((p) => (p.id === priorityId ? { ...p, completed: !p.completed } : p)))
  }

  const handleAddHabit = () => {
    setSelectedHabit(null)
    setShowHabitModal(true)
  }

  const handleEditHabit = (habit) => {
    setSelectedHabit(habit)
    setShowHabitModal(true)
  }

  const handleSaveHabit = (habitData) => {
    if (selectedHabit) {
      setHabits(habits.map((h) => (h.id === selectedHabit.id ? { ...habitData, id: selectedHabit.id } : h)))
    } else {
      const newHabit = {
        ...habitData,
        id: Math.max(...habits.map((h) => h.id), 0) + 1,
        progress: {},
        createdAt: new Date().toISOString(),
      }
      setHabits([...habits, newHabit])
    }
    setShowHabitModal(false)
    setSelectedHabit(null)
  }

  const handleDeleteHabit = (habitId) => {
    setHabits(habits.filter((h) => h.id !== habitId))
    setShowHabitModal(false)
    setSelectedHabit(null)
  }

  const handleResetHabits = () => {
    if (window.confirm("Are you sure you want to reset all habit progress for this week? This action cannot be undone.")) {
      const currentWeek = getWeekKey()
      setHabits(
        habits.map((habit) => ({
          ...habit,
          progress: {
            ...habit.progress,
            [currentWeek]: {},
          },
        })),
      )
    }
  }

  const handleToggleHabitDay = (habitId, day) => {
    setHabits(
      habits.map((habit) => {
        if (habit.id === habitId) {
          const currentWeek = getWeekKey()
          const progress = { ...habit.progress }
          if (!progress[currentWeek]) {
            progress[currentWeek] = {}
          }
          progress[currentWeek][day] = !progress[currentWeek][day]
          return { ...habit, progress }
        }
        return habit
      }),
    )
  }

  const getWeekKey = () => {
    const now = new Date()
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()))
    return startOfWeek.toISOString().split("T")[0]
  }

  const getDayName = (index) => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    return days[index]
  }

  const getReportData = () => {
    const completedPriorities = priorities.filter((p) => p.completed).length
    const incompletePriorities = priorities.filter((p) => !p.completed).length

    const currentWeek = getWeekKey()
    let totalHabitDays = 0
    let completedHabitDays = 0

    habits.forEach((habit) => {
      habit.activeDays.forEach((day) => {
        totalHabitDays++
        if (habit.progress[currentWeek] && habit.progress[currentWeek][day]) {
          completedHabitDays++
        }
      })
    })

    const habitCompletionRate = totalHabitDays > 0 ? Math.round((completedHabitDays / totalHabitDays) * 100) : 0

    return {
      completedPriorities,
      incompletePriorities,
      totalHabits: habits.length,
      habitCompletionRate,
    }
  }

  const reportData = getReportData()
  const currentWeek = getWeekKey()

  // Sort priorities based on priority level
  const priorityOrder = { high: 1, medium: 2, low: 3 }
  const sortedPriorities = [...priorities].sort((a, b) => {
    return (priorityOrder[a.priority] || 4) - (priorityOrder[b.priority] || 4)
  })

  return (
    <div className="priorities-container">
      <header className="priorities-header">
        <div className="header-left">
          <div className="app-toggle">
            <button className={`toggle-half`} onClick={() => onTabChange("calendar")}>📅 Calendar</button>
            <button className={`toggle-half active`} onClick={() => onTabChange("priorities")}>🎯 Tasks</button>
          </div>
        </div>

        <div className="header-center">
          <div className="monthly-stats-header">
            <div className="stat-item-header">
              <span className="stat-number-header">{reportData.completedPriorities}</span>
              <span className="stat-label-header">Completed</span>
            </div>
            <div className="stat-item-header">
              <span className="stat-number-header">{reportData.incompletePriorities}</span>
              <span className="stat-label-header">Pending</span>
            </div>
            <div className="stat-item-header">
              <span className="stat-number-header">{reportData.totalHabits}</span>
              <span className="stat-label-header">Habits</span>
            </div>
            <div className="stat-item-header">
              <span className="stat-number-header">{reportData.habitCompletionRate}%</span>
              <span className="stat-label-header">Completion</span>
            </div>
          </div>
        </div>

        <div className="priorities-title">Weekly Priorities & Habits</div>
      </header>

      <main className="priorities-main">
        {/* Priorities Section */}
        <section className="priorities-section" aria-labelledby="priorities-heading">
          <div className="section-header">
            <h2 id="priorities-heading" className="section-title">🎯 Weekly Priorities</h2>
            <button className="add-button" onClick={handleAddPriority}>+ Add Priority</button>
          </div>

          <div className="priorities-grid" role="list">
            {sortedPriorities.map((priority) => (
              <article key={priority.id} className={`priority-item ${priority.completed ? "completed" : ""}`} role="listitem">
                <div className="priority-header">
                  <button className={`priority-checkbox ${priority.completed ? "checked" : ""}`} onClick={() => handleTogglePriority(priority.id)}>
                    {priority.completed && "✓"}
                  </button>
                  <h3 className={`priority-title ${priority.completed ? "completed" : ""}`}>{priority.title}</h3>
                  <div className="priority-actions">
                    <button className="action-button" onClick={() => handleEditPriority(priority)}>✏️</button>
                    <button className="action-button" onClick={() => handleDeletePriority(priority.id)}>🗑️</button>
                  </div>
                </div>
                {priority.description && <p className="priority-description">{priority.description}</p>}
              </article>
            ))}
            {priorities.length === 0 && <div className="loading"><span>No priorities added yet.</span></div>}
          </div>
        </section>

        {/* Habits Section */}
        <section className="habits-section" aria-labelledby="habits-heading">
          <div className="section-header">
            <h2 id="habits-heading" className="section-title">📊 Habit Tracker</h2>
            <div>
              <button className="add-button" onClick={handleAddHabit}>+ Add Habit</button>
              <button className="reset-button" onClick={handleResetHabits}>🔄 Reset Week</button>
            </div>
          </div>

          <div className="habits-grid">
            {habits.map((habit) => (
              <article key={habit.id} className="habit-card">
                <div className="habit-header">
                  <h3 className="habit-title">{habit.title}</h3>
                  <div className="priority-actions">
                    <button className="action-button" onClick={() => handleEditHabit(habit)}>✏️</button>
                    <button className="action-button" onClick={() => handleDeleteHabit(habit.id)}>🗑️</button>
                  </div>
                </div>

                <div className="habit-days" role="group" aria-label={`${habit.title} weekly progress`}>
                  {[0, 1, 2, 3, 4, 5, 6].map((dayIndex) => {
                    const dayName = getDayName(dayIndex)
                    const isActiveDay = habit.activeDays.includes(dayIndex)
                    const isCompleted = habit.progress[currentWeek]?.[dayIndex]

                    return (
                      <div key={dayIndex} className="day-checkbox">
                        <div className="day-label">{dayName}</div>
                        <button
                          className={`day-check ${isCompleted ? "checked" : ""} ${!isActiveDay ? "disabled" : ""}`}
                          onClick={() => isActiveDay && handleToggleHabitDay(habit.id, dayIndex)}
                          disabled={!isActiveDay}
                        >
                          {isCompleted && "✓"}
                        </button>
                      </div>
                    )
                  })}
                </div>
              </article>
            ))}
            {habits.length === 0 && <div className="loading"><span>No habits added yet.</span></div>}
          </div>
        </section>
      </main>

      {/* Modals */}
      {showPriorityModal && (
        <PriorityModal
          priority={selectedPriority}
          onSave={handleSavePriority}
          onDelete={handleDeletePriority}
          onClose={() => {
            setShowPriorityModal(false)
            setSelectedPriority(null)
          }}
        />
      )}
      {showHabitModal && (
        <HabitModal
          habit={selectedHabit}
          onSave={handleSaveHabit}
          onDelete={handleDeleteHabit}
          onClose={() => {
            setShowHabitModal(false)
            setSelectedHabit(null)
          }}
        />
      )}
    </div>
  )
}

export default Priorities
