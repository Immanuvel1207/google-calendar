"use client"

import dayjs from "dayjs"

const EventDetailModal = ({ event, onEdit, onDelete, onClose }) => {
  const handleEdit = () => {
    onEdit(event)
  }

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      onDelete(event.id)
    }
  }

  const formatTime = (startTime, endTime) => {
    if (event.type === "birthday") {
      return "All Day"
    }
    return `${startTime} - ${endTime}`
  }

  const getReminderText = (minutes) => {
    if (minutes === 0) return "No reminder"
    if (minutes < 60) return `${minutes} minutes before`
    if (minutes < 1440) return `${minutes / 60} hours before`
    return `${minutes / 1440} days before`
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content event-detail-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">{event.title}</h3>
          <button className="close-button" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          {event.image && <img src={event.image || "/placeholder.svg"} alt={event.title} className="event-image" />}

          <div className="form-group">
            <label className="form-label">Date & Time</label>
            <div
              style={{
                padding: "12px 16px",
                background: "#f8fafc",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              {dayjs(event.date).format("MMMM D, YYYY")} • {formatTime(event.startTime, event.endTime)}
            </div>
          </div>

          {event.location && (
            <div className="form-group">
              <label className="form-label">Location</label>
              <div
                style={{
                  padding: "12px 16px",
                  background: "#f8fafc",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                📍 {event.location}
              </div>
            </div>
          )}

          {event.attendees && event.attendees.length > 0 && (
            <div className="form-group">
              <label className="form-label">Attendees</label>
              <div
                style={{
                  padding: "12px 16px",
                  background: "#f8fafc",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: "500",
                }}
              >
                👥 {event.attendees.join(", ")}
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Reminder</label>
            <div
              style={{
                padding: "12px 16px",
                background: "#f8fafc",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "500",
              }}
            >
              🔔 {getReminderText(event.reminder)}
            </div>
          </div>

          {event.description && (
            <div className="form-group">
              <label className="form-label">Description</label>
              <div
                style={{
                  padding: "12px 16px",
                  background: "#f8fafc",
                  borderRadius: "8px",
                  fontSize: "14px",
                  lineHeight: "1.6",
                }}
              >
                {event.description}
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Category</label>
            <div
              style={{
                padding: "12px 16px",
                background: event.color,
                color: "white",
                borderRadius: "8px",
                fontSize: "14px",
                fontWeight: "600",
                textAlign: "center",
              }}
            >
              {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button type="button" className="delete-button" onClick={handleDelete}>
            Delete Event
          </button>

          <div className="modal-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              Close
            </button>
            <button type="button" className="save-button" onClick={handleEdit}>
              Edit Event
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EventDetailModal
