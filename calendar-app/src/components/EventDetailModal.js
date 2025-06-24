
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
        <header className="modal-header">
          <h3 className="modal-title">{event.title}</h3>
          <button className="close-button" onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        </header>

        <div className="modal-body">
          {event.image && <img src={event.image || "/placeholder.svg"} alt={event.title} className="event-image" />}

          <div className="form-group">
            <div className="form-label">Date & Time</div>
            <div
              style={{
                padding: "0.75rem 1rem",
                background: "var(--gray-50)",
                borderRadius: "var(--radius-md)",
                fontSize: "0.875rem",
                fontWeight: "500",
              }}
            >
              {dayjs(event.date).format("MMMM D, YYYY")} • {formatTime(event.startTime, event.endTime)}
            </div>
          </div>

          {event.location && (
            <div className="form-group">
              <div className="form-label">Location</div>
              <div
                style={{
                  padding: "0.75rem 1rem",
                  background: "var(--gray-50)",
                  borderRadius: "var(--radius-md)",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                }}
              >
                📍 {event.location}
              </div>
            </div>
          )}

          {event.attendees && event.attendees.length > 0 && (
            <div className="form-group">
              <div className="form-label">Attendees</div>
              <div
                style={{
                  padding: "0.75rem 1rem",
                  background: "var(--gray-50)",
                  borderRadius: "var(--radius-md)",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                }}
              >
                👥 {event.attendees.join(", ")}
              </div>
            </div>
          )}

          <div className="form-group">
            <div className="form-label">Reminder</div>
            <div
              style={{
                padding: "0.75rem 1rem",
                background: "var(--gray-50)",
                borderRadius: "var(--radius-md)",
                fontSize: "0.875rem",
                fontWeight: "500",
              }}
            >
              🔔 {getReminderText(event.reminder)}
            </div>
          </div>

          {event.description && (
            <div className="form-group">
              <div className="form-label">Description</div>
              <div
                style={{
                  padding: "0.75rem 1rem",
                  background: "var(--gray-50)",
                  borderRadius: "var(--radius-md)",
                  fontSize: "0.875rem",
                  lineHeight: "1.6",
                }}
              >
                {event.description}
              </div>
            </div>
          )}

          <div className="form-group">
            <div className="form-label">Category</div>
            <div
              style={{
                padding: "0.75rem 1rem",
                background: event.color,
                color: "white",
                borderRadius: "var(--radius-md)",
                fontSize: "0.875rem",
                fontWeight: "600",
                textAlign: "center",
              }}
            >
              {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
            </div>
          </div>
        </div>

        <footer className="modal-footer">
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
        </footer>
      </div>
    </div>
  )
}

export default EventDetailModal
