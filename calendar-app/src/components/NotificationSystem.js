"use client"

const NotificationSystem = ({ notifications, onDismiss, getEventEmoji }) => {
  if (notifications.length === 0) return null

  return (
    <div className="notifications-container" role="region" aria-label="Event notifications">
      {notifications.map((notification) => (
        <div key={notification.id} className="notification" role="alert">
          <div className="notification-header">
            <span className="notification-icon" aria-hidden="true">
              {getEventEmoji(notification.event.type)}
            </span>
            <span className="notification-title">Event Reminder</span>
            <button
              className="close-button"
              onClick={() => onDismiss(notification.id)}
              style={{ width: "1.25rem", height: "1.25rem", fontSize: "0.75rem" }}
              aria-label="Dismiss notification"
            >
              ✕
            </button>
          </div>
          <div className="notification-message">
            <strong>{notification.event.title}</strong>
            {notification.event.startTime && <div>Starting at {notification.event.startTime}</div>}
            {notification.event.location && <div>📍 {notification.event.location}</div>}
          </div>
          <time className="notification-time" dateTime={notification.timestamp.toISOString()}>
            {notification.timestamp.format("h:mm A")}
          </time>
        </div>
      ))}
    </div>
  )
}

export default NotificationSystem
