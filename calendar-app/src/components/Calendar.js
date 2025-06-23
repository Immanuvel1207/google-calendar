"use client"

import { useState, useCallback } from "react"
import dayjs from "dayjs"
import EventModal from "./EvenModal"
import EventList from "./EventList"
import MiniCalendar from "./MiniCalendar"
import eventsData from "../data/events.json"
import "../styles/Calendar.css"

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(dayjs())
  const [events, setEvents] = useState(eventsData)
  const [selectedDate, setSelectedDate] = useState(null)
  const [showEventModal, setShowEventModal] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [viewMode, setViewMode] = useState("month")
  const [showEventList, setShowEventList] = useState(true)
  const [visibleCategories, setVisibleCategories] = useState({
    meeting: true,
    review: true,
    presentation: true,
    training: true,
    planning: true,
    learning: true,
    personal: true,
    other: true,
  })

  const today = dayjs()
  const startOfMonth = currentDate.startOf("month")
  const endOfMonth = currentDate.endOf("month")
  const startOfCalendar = startOfMonth.startOf("week")
  const endOfCalendar = endOfMonth.endOf("week")

  // Generate calendar days
  const calendarDays = []
  let day = startOfCalendar
  while (day.isBefore(endOfCalendar) || day.isSame(endOfCalendar, "day")) {
    calendarDays.push(day)
    day = day.add(1, "day")
  }

  // Event categories with colors
  const eventCategories = {
    meeting: { label: "Meetings", color: "#f6be23" },
    review: { label: "Reviews", color: "#9c27b0" },
    presentation: { label: "Presentations", color: "#34a853" },
    training: { label: "Training", color: "#ff9800" },
    planning: { label: "Planning", color: "#e91e63" },
    learning: { label: "Learning", color: "#00bcd4" },
    personal: { label: "Personal", color: "#4285f4" },
    other: { label: "Other", color: "#5f6368" },
  }

  // Get events for a specific date
  const getEventsForDate = useCallback(
    (date) => {
      return events.filter((event) => {
        const eventDate = dayjs(event.date)
        const matchesDate = eventDate.isSame(date, "day")
        const matchesSearch =
          searchTerm === "" ||
          event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.description.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesFilter = filterType === "all" || event.type === filterType
        const matchesCategory = visibleCategories[event.type]

        return matchesDate && matchesSearch && matchesFilter && matchesCategory
      })
    },
    [events, searchTerm, filterType, visibleCategories],
  )

  // Navigation handlers
  const handlePrevMonth = () => setCurrentDate(currentDate.subtract(1, "month"))
  const handleNextMonth = () => setCurrentDate(currentDate.add(1, "month"))
  const handleToday = () => setCurrentDate(today)

  // Event handlers
  const handleDateClick = (date) => {
    setSelectedDate(date)
    const dayEvents = getEventsForDate(date)
    if (dayEvents.length === 0) {
      setSelectedEvent(null)
      setShowEventModal(true)
    }
  }

  const handleEventClick = (event, e) => {
    e.stopPropagation()
    setSelectedEvent(event)
    setSelectedDate(dayjs(event.date))
    setShowEventModal(true)
  }

  const handleCreateEvent = () => {
    setSelectedEvent(null)
    setSelectedDate(today)
    setShowEventModal(true)
  }

  const handleSaveEvent = (eventData) => {
    if (selectedEvent) {
      setEvents(events.map((event) => (event.id === selectedEvent.id ? { ...eventData, id: selectedEvent.id } : event)))
    } else {
      const newEvent = {
        ...eventData,
        id: Math.max(...events.map((e) => e.id), 0) + 1,
      }
      setEvents([...events, newEvent])
    }
    setShowEventModal(false)
    setSelectedEvent(null)
  }

  const handleDeleteEvent = (eventId) => {
    setEvents(events.filter((event) => event.id !== eventId))
    setShowEventModal(false)
    setSelectedEvent(null)
  }

  const toggleCategory = (category) => {
    setVisibleCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }))
  }

  // Filter events for list view
  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      searchTerm === "" ||
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterType === "all" || event.type === filterType
    const matchesCategory = visibleCategories[event.type]

    return matchesSearch && matchesFilter && matchesCategory
  })

  return (
    <div className="calendar-container">
      {/* Header */}
      <header className="calendar-header">
        <div className="header-left">
          <div className="calendar-logo">
            <div className="calendar-icon">📅</div>
            <span>Calendar</span>
          </div>
        </div>

        <div className="header-controls">
          <div className="search-container">
            <div className="search-icon">🔍</div>
            <input
              type="text"
              className="search-input"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select className="filter-select" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="all">All Events</option>
            {Object.entries(eventCategories).map(([key, category]) => (
              <option key={key} value={key}>
                {category.label}
              </option>
            ))}
          </select>

          <div className="view-toggle">
            <button
              className={`view-button ${viewMode === "month" ? "active" : ""}`}
              onClick={() => setViewMode("month")}
            >
              Month
            </button>
            <button
              className={`view-button ${viewMode === "week" ? "active" : ""}`}
              onClick={() => setViewMode("week")}
            >
              Week
            </button>
            <button className={`view-button ${viewMode === "day" ? "active" : ""}`} onClick={() => setViewMode("day")}>
              Day
            </button>
          </div>

          <button className="create-button" onClick={handleCreateEvent}>
            <span>+</span>
            Create
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="calendar-main">
        {/* Sidebar */}
        <aside className="calendar-sidebar">
          <MiniCalendar
            currentDate={currentDate}
            onDateChange={setCurrentDate}
            events={events}
            getEventsForDate={getEventsForDate}
          />

          <div className="calendar-categories">
            <h3 className="categories-title">My Calendars</h3>
            {Object.entries(eventCategories).map(([key, category]) => (
              <div key={key} className="category-item" onClick={() => toggleCategory(key)}>
                <div
                  className={`category-checkbox ${visibleCategories[key] ? "checked" : ""}`}
                  style={{ "--category-color": category.color }}
                />
                <span className="category-label">{category.label}</span>
              </div>
            ))}
          </div>
        </aside>

        {/* Calendar Content */}
        <div className="calendar-content">
          <div className="calendar-navigation">
            <div className="nav-left">
              <button className="nav-button" onClick={handlePrevMonth}>
                ‹
              </button>
              <button className="nav-button" onClick={handleNextMonth}>
                ›
              </button>
              <h2 className="current-month">{currentDate.format("MMMM YYYY")}</h2>
            </div>
            <button className="today-button" onClick={handleToday}>
              Today
            </button>
          </div>

          <div className="calendar-grid-container">
            <div className="calendar-grid">
              {/* Day Headers */}
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="day-header">
                  {day}
                </div>
              ))}

              {/* Calendar Days */}
              {calendarDays.map((day, index) => {
                const dayEvents = getEventsForDate(day)
                const isToday = day.isSame(today, "day")
                const isCurrentMonth = day.isSame(currentDate, "month")
                const isSelected = selectedDate && day.isSame(selectedDate, "day")

                return (
                  <div
                    key={index}
                    className={`calendar-day ${
                      !isCurrentMonth ? "other-month" : ""
                    } ${isToday ? "today" : ""} ${isSelected ? "selected" : ""}`}
                    onClick={() => handleDateClick(day)}
                  >
                    <div className={`day-number ${isToday ? "today" : ""}`}>
                      <span>{day.format("D")}</span>
                    </div>

                    <div className="events-container">
                      {dayEvents.slice(0, 3).map((event) => (
                        <div
                          key={event.id}
                          className="event-item"
                          style={{ "--event-color": event.color }}
                          onClick={(e) => handleEventClick(event, e)}
                          title={`${event.title} - ${event.startTime}`}
                        >
                          {event.title}
                        </div>
                      ))}
                      {dayEvents.length > 3 && <div className="more-events">+{dayEvents.length - 3} more</div>}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Event List */}
        {showEventList && (
          <EventList events={filteredEvents} onEventClick={handleEventClick} eventCategories={eventCategories} />
        )}
      </main>

      {/* Event Modal */}
      {showEventModal && (
        <EventModal
          event={selectedEvent}
          selectedDate={selectedDate}
          onSave={handleSaveEvent}
          onDelete={handleDeleteEvent}
          onClose={() => {
            setShowEventModal(false)
            setSelectedEvent(null)
          }}
          eventCategories={eventCategories}
        />
      )}
    </div>
  )
}

export default Calendar
