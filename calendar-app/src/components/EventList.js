"use client"

import dayjs from "dayjs"

const EventList = ({ events, onEventClick, eventCategories }) => {
  const now = dayjs()

  const upcomingEvents = events
    .filter((event) => dayjs(`${event.date} ${event.startTime}`).isAfter(now))
    .sort((a, b) => dayjs(`${a.date} ${a.startTime}`).diff(dayjs(`${b.date} ${b.startTime}`)))

  const pastEvents = events
    .filter((event) => dayjs(`${event.date} ${event.startTime}`).isBefore(now))
    .sort((a, b) => dayjs(`${b.date} ${b.startTime}`).diff(dayjs(`${a.date} ${a.startTime}`)))

  const todayEvents = events
    .filter((event) => dayjs(event.date).isSame(now, "day"))
    .sort((a, b) => dayjs(`${a.date} ${a.startTime}`).diff(dayjs(`${b.date} ${b.startTime}`)))

  const EventItem = ({ event }) => (
    <div className="event-list-item" onClick={(e) => onEventClick(event, e)}>
      <div className="event-color-indicator" style={{ backgroundColor: event.color }} />
      <div className="event-details">
        <div className="event-title">{event.title}</div>
        <div className="event-time">
          {dayjs(event.date).format("MMM D, YYYY")} • {event.startTime} - {event.endTime}
        </div>
        {event.location && <div className="event-location">📍 {event.location}</div>}
      </div>
    </div>
  )

  return (
    <div className="event-list-container">
      <div className="event-list-header">
        <h3 className="event-list-title">Events</h3>
        <p className="event-count">
          {events.length} event{events.length !== 1 ? "s" : ""} found
        </p>
      </div>

      <div className="event-list-content">
        {todayEvents.length > 0 && (
          <div className="event-section">
            <h4 className="section-title">Today ({todayEvents.length})</h4>
            {todayEvents.map((event) => (
              <EventItem key={event.id} event={event} />
            ))}
          </div>
        )}

        {upcomingEvents.length > 0 && (
          <div className="event-section">
            <h4 className="section-title">Upcoming ({upcomingEvents.length})</h4>
            {upcomingEvents.slice(0, 10).map((event) => (
              <EventItem key={event.id} event={event} />
            ))}
          </div>
        )}

        {pastEvents.length > 0 && (
          <div className="event-section">
            <h4 className="section-title">Past ({pastEvents.length})</h4>
            {pastEvents.slice(0, 5).map((event) => (
              <EventItem key={event.id} event={event} />
            ))}
          </div>
        )}

        {events.length === 0 && (
          <div className="loading">
            <span>No events found</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default EventList
