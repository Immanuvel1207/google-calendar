"use client"

import { useState, useEffect } from "react"

const HabitModal = ({ habit, onSave, onDelete, onClose }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    activeDays: [],
  })

  useEffect(() => {
    if (habit) {
      setFormData({
        title: habit.title,
        description: habit.description || "",
        activeDays: habit.activeDays || [],
      })
    }
  }, [habit])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.title.trim() || formData.activeDays.length === 0) return
    onSave(formData)
  }

  const handleDelete = () => {
    if (habit && window.confirm("Are you sure you want to delete this habit?")) {
      onDelete(habit.id)
    }
  }

  const handleDayToggle = (dayIndex) => {
    setFormData((prev) => ({
      ...prev,
      activeDays: prev.activeDays.includes(dayIndex)
        ? prev.activeDays.filter((d) => d !== dayIndex)
        : [...prev.activeDays, dayIndex],
    }))
  }

  const getDayName = (index) => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    return days[index]
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <header className="modal-header">
          <h3 className="modal-title">{habit ? "Edit Habit" : "Add Habit"}</h3>
          <button className="close-button" onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        </header>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label htmlFor="habit-title" className="form-label">
                Habit Title
              </label>
              <input
                id="habit-title"
                type="text"
                className="form-input"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter habit title"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="habit-description" className="form-label">
                Description (Optional)
              </label>
              <textarea
                id="habit-description"
                className="form-textarea"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Add details about this habit"
                rows="3"
              />
            </div>

            <fieldset className="form-group">
              <legend className="form-label">Active Days</legend>
              <div className="days-selector">
                <div className="days-grid">
                  {[0, 1, 2, 3, 4, 5, 6].map((dayIndex) => (
                    <div key={dayIndex} className="day-selector">
                      <label htmlFor={`day-${dayIndex}`} className="day-selector-label">
                        {getDayName(dayIndex)}
                      </label>
                      <button
                        id={`day-${dayIndex}`}
                        type="button"
                        className={`day-selector-checkbox ${formData.activeDays.includes(dayIndex) ? "checked" : ""}`}
                        onClick={() => handleDayToggle(dayIndex)}
                        aria-pressed={formData.activeDays.includes(dayIndex)}
                      >
                        {formData.activeDays.includes(dayIndex) && "✓"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              {formData.activeDays.length === 0 && (
                <div style={{ color: "var(--error-500)", fontSize: "0.75rem", marginTop: "0.25rem" }}>
                  Please select at least one day
                </div>
              )}
            </fieldset>
          </div>

          <footer className="modal-footer">
            {habit && (
              <button type="button" className="delete-button" onClick={handleDelete}>
                Delete Habit
              </button>
            )}

            <div className="modal-actions">
              <button type="button" className="cancel-button" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="save-button">
                {habit ? "Update Habit" : "Add Habit"}
              </button>
            </div>
          </footer>
        </form>
      </div>
    </div>
  )
}

export default HabitModal
