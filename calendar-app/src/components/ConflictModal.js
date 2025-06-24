"use client"

import { useState } from "react"
import dayjs from "dayjs"

const ConflictModal = ({ conflictData, onResolve, onClose }) => {
  const [showEditBoth, setShowEditBoth] = useState(false)
  const [editedNewEvent, setEditedNewEvent] = useState(conflictData.newEvent)
  const [editedConflictingEvent, setEditedConflictingEvent] = useState(conflictData.conflictingEvent)

  const handlePriorityChoice = (priority) => {
    onResolve("priority", priority)
  }

  const handleEditBoth = () => {
    setShowEditBoth(true)
  }

  const handleKeepBoth = () => {
    onResolve("keep-both")
  }

  const handleSaveEditedEvents = () => {
    onResolve("edit-both", null, {
      newEvent: editedNewEvent,
      conflictingEvent: editedConflictingEvent,
    })
  }

  const formatTime = (startTime, endTime) => {
    return `${startTime} - ${endTime}`
  }

  if (showEditBoth) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content conflict-modal" onClick={(e) => e.stopPropagation()}>
          <header className="modal-header">
            <h3 className="modal-title">Edit Conflicting Events</h3>
            <button className="close-button" onClick={onClose} aria-label="Close modal">
              ✕
            </button>
          </header>

          <div className="modal-body">
            <div className="conflict-events">
              <div className="conflict-event">
                <h4 className="conflict-event-title">New Event</h4>
                <input
                  type="text"
                  className="form-input"
                  value={editedNewEvent.title}
                  onChange={(e) => setEditedNewEvent({ ...editedNewEvent, title: e.target.value })}
                  style={{ marginBottom: "0.5rem" }}
                  aria-label="New event title"
                />
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <input
                    type="time"
                    className="form-input"
                    value={editedNewEvent.startTime}
                    onChange={(e) => setEditedNewEvent({ ...editedNewEvent, startTime: e.target.value })}
                    aria-label="New event start time"
                  />
                  <input
                    type="time"
                    className="form-input"
                    value={editedNewEvent.endTime}
                    onChange={(e) => setEditedNewEvent({ ...editedNewEvent, endTime: e.target.value })}
                    aria-label="New event end time"
                  />
                </div>
              </div>

              <div className="conflict-event">
                <h4 className="conflict-event-title">Existing Event</h4>
                <input
                  type="text"
                  className="form-input"
                  value={editedConflictingEvent.title}
                  onChange={(e) => setEditedConflictingEvent({ ...editedConflictingEvent, title: e.target.value })}
                  style={{ marginBottom: "0.5rem" }}
                  aria-label="Existing event title"
                />
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <input
                    type="time"
                    className="form-input"
                    value={editedConflictingEvent.startTime}
                    onChange={(e) =>
                      setEditedConflictingEvent({ ...editedConflictingEvent, startTime: e.target.value })
                    }
                    aria-label="Existing event start time"
                  />
                  <input
                    type="time"
                    className="form-input"
                    value={editedConflictingEvent.endTime}
                    onChange={(e) => setEditedConflictingEvent({ ...editedConflictingEvent, endTime: e.target.value })}
                    aria-label="Existing event end time"
                  />
                </div>
              </div>
            </div>

            <div className="conflict-actions">
              <button className="priority-button keep-both-button" onClick={handleSaveEditedEvents}>
                Save Both Events
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content conflict-modal" onClick={(e) => e.stopPropagation()}>
        <header className="modal-header">
          <h3 className="modal-title">⚠️ Schedule Conflict Detected</h3>
          <button className="close-button" onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        </header>

        <div className="modal-body">
          <div className="conflict-warning">
            <div className="conflict-title">Time Conflict Found!</div>
            <p className="conflict-message">
              You're trying to schedule an event that overlaps with an existing event. Please choose how to handle this
              conflict:
            </p>

            <div className="conflict-events">
              <div className="conflict-event">
                <div className="conflict-event-title">📅 New Event</div>
                <div style={{ fontWeight: "600", marginBottom: "0.25rem" }}>{conflictData.newEvent.title}</div>
                <div className="conflict-event-time">
                  {dayjs(conflictData.newEvent.date).format("MMM D, YYYY")} •{" "}
                  {formatTime(conflictData.newEvent.startTime, conflictData.newEvent.endTime)}
                </div>
              </div>

              <div className="conflict-event">
                <div className="conflict-event-title">⏰ Existing Event</div>
                <div style={{ fontWeight: "600", marginBottom: "0.25rem" }}>{conflictData.conflictingEvent.title}</div>
                <div className="conflict-event-time">
                  {dayjs(conflictData.conflictingEvent.date).format("MMM D, YYYY")} •{" "}
                  {formatTime(conflictData.conflictingEvent.startTime, conflictData.conflictingEvent.endTime)}
                </div>
              </div>
            </div>

            <div className="conflict-actions">
              <button className="priority-button priority-high" onClick={() => handlePriorityChoice("high")}>
                🔥 High Priority
                <div style={{ fontSize: "0.75rem", opacity: "0.8" }}>Make new event more important</div>
              </button>

              <button className="priority-button priority-low" onClick={() => handlePriorityChoice("low")}>
                📋 Normal Priority
                <div style={{ fontSize: "0.75rem", opacity: "0.8" }}>Keep existing event priority</div>
              </button>

              <button className="priority-button edit-both-button" onClick={handleEditBoth}>
                ✏️ Edit Times
                <div style={{ fontSize: "0.75rem", opacity: "0.8" }}>Adjust event times to avoid conflict</div>
              </button>

              <button className="priority-button keep-both-button" onClick={handleKeepBoth}>
                ✅ Keep Both
                <div style={{ fontSize: "0.75rem", opacity: "0.8" }}>Allow overlapping events</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConflictModal
