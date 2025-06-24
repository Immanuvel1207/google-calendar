
import dayjs from "dayjs"

const EventList = ({
  events,
  onEventClick,
  eventCategories,
  selectedFilters,
  onFilterToggle,
  onClearFilters,
  getEventEmoji,
}) => {
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
    <article className="event-list-item" onClick={(e) => onEventClick(event, e)}>
      <div className="event-color-indicator" style={{ backgroundColor: event.color }} />
      <div className="event-details">
        <h4 className="event-title">
          <span className="event-emoji" aria-hidden="true">
            {getEventEmoji(event.type)}
          </span>
          {event.title}
        </h4>
        <time className="event-time" dateTime={`${event.date}T${event.startTime}`}>
          {dayjs(event.date).format("MMM D, YYYY")} •{" "}
          {event.type === "birthday" ? "All Day" : `${event.startTime} - ${event.endTime}`}
        </time>
        {event.location && <div className="event-location">📍 {event.location}</div>}
      </div>
    </article>
  )

  return (
    <aside className="event-list-container" aria-label="Events sidebar">
      <header className="event-list-header">
        <h3 className="event-list-title">Events</h3>

        <section className="filter-section" aria-labelledby="filter-title">
          <h4 id="filter-title" className="filter-title">
            Filter by Category
          </h4>
          <div className="filter-options" role="group">
            {Object.entries(eventCategories).map(([key, category]) => (
              <button
                key={key}
                className={`filter-chip ${selectedFilters.includes(key) ? "active" : ""}`}
                onClick={() => onFilterToggle(key)}
                aria-pressed={selectedFilters.includes(key)}
              >
                {category.label}
              </button>
            ))}
          </div>
          {selectedFilters.length > 0 && (
            <p className="clear-filters" onClick={onClearFilters}>
              Clear all filters
            </p>
          )}
        </section>

        <p className="event-count">
          {events.length} event{events.length !== 1 ? "s" : ""} found
        </p>
      </header>

      <main className="event-list-content">
        {todayEvents.length > 0 && (
          <section className="event-section">
            <h4 className="section-title">Today ({todayEvents.length})</h4>
            {todayEvents.map((event) => (
              <EventItem key={event.id} event={event} />
            ))}
          </section>
        )}

        {upcomingEvents.length > 0 && (
          <section className="event-section">
            <h4 className="section-title">Upcoming ({upcomingEvents.length})</h4>
            {upcomingEvents.slice(0, 10).map((event) => (
              <EventItem key={event.id} event={event} />
            ))}
          </section>
        )}

        {pastEvents.length > 0 && (
          <section className="event-section">
            <h4 className="section-title">Past ({pastEvents.length})</h4>
            {pastEvents.slice(0, 5).map((event) => (
              <EventItem key={event.id} event={event} />
            ))}
          </section>
        )}

        {events.length === 0 && (
          <div className="loading">
            <span>No events found</span>
          </div>
        )}
      </main>
    </aside>
  )
}

export default EventList
