"use client"

import { useState, useCallback, useEffect } from "react"
import dayjs from "dayjs"
import EventModal from "./EvenModal"
import EventList from "./EventList"
import MiniCalendar from "./MiniCalendar"
import EventDetailModal from "./EventDetailsModal"
import eventsData from "../data/events.json"
import "../styles/Calendar.css"

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(() => {
    const saved = localStorage.getItem("calendar-current-date")
    return saved ? dayjs(saved) : dayjs()
  })

  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem("calendar-events")
    return saved ? JSON.parse(saved) : eventsData
  })

  const [selectedDate, setSelectedDate] = useState(() => {
    const saved = localStorage.getItem("calendar-selected-date")
    return saved ? dayjs(saved) : null
  })

  const [showEventModal, setShowEventModal] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [showEventDetail, setShowEventDetail] = useState(false)

  const [searchTerm, setSearchTerm] = useState(() => {
    return localStorage.getItem("calendar-search-term") || ""
  })

  const [filterType, setFilterType] = useState(() => {
    return localStorage.getItem("calendar-filter-type") || "all"
  })

  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem("calendar-view-mode") || "month"
  })

  const [showEventList, setShowEventList] = useState(() => {
    const saved = localStorage.getItem("calendar-show-event-list")
    return saved !== null ? JSON.parse(saved) : true
  })

  const [visibleCategories, setVisibleCategories] = useState(() => {
    const saved = localStorage.getItem("calendar-visible-categories")
    return saved
      ? JSON.parse(saved)
      : {
          meeting: true,
          review: true,
          presentation: true,
          training: true,
          planning: true,
          learning: true,
          social: true,
          birthday: true,
          personal: true,
          other: true,
        }
  })

  useEffect(() => {
    localStorage.setItem("calendar-current-date", currentDate.toISOString())
  }, [currentDate])

  useEffect(() => {
    localStorage.setItem("calendar-events", JSON.stringify(events))
  }, [events])

  useEffect(() => {
    localStorage.setItem("calendar-selected-date", selectedDate ? selectedDate.toISOString() : "")
  }, [selectedDate])

  useEffect(() => {
    localStorage.setItem("calendar-search-term", searchTerm)
  }, [searchTerm])

  useEffect(() => {
    localStorage.setItem("calendar-filter-type", filterType)
  }, [filterType])

  useEffect(() => {
    localStorage.setItem("calendar-view-mode", viewMode)
  }, [viewMode])

  useEffect(() => {
    localStorage.setItem("calendar-show-event-list", JSON.stringify(showEventList))
  }, [showEventList])

  useEffect(() => {
    localStorage.setItem("calendar-visible-categories", JSON.stringify(visibleCategories))
  }, [visibleCategories])

  const today = dayjs()
  const startOfMonth = currentDate.startOf("month")
  const endOfMonth = currentDate.endOf("month")
  const startOfCalendar = startOfMonth.startOf("week")
  const endOfCalendar = endOfMonth.endOf("week")

  const calendarDays = []
  let day = startOfCalendar
  while (day.isBefore(endOfCalendar) || day.isSame(endOfCalendar, "day")) {
    calendarDays.push(day)
    day = day.add(1, "day")
  }

  const eventCategories = {
    meeting: { label: "Meetings", color: "#f6be23" },
    review: { label: "Reviews", color: "#9c27b0" },
    presentation: { label: "Presentations", color: "#34a853" },
    training: { label: "Training", color: "#ff9800" },
    planning: { label: "Planning", color: "#e91e63" },
    learning: { label: "Learning", color: "#00bcd4" },
    social: { label: "Social", color: "#4caf50" },
    birthday: { label: "Birthdays", color: "#ff69b4" },
    personal: { label: "Personal", color: "#4285f4" },
    other: { label: "Other", color: "#5f6368" },
  }

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

  const getWeekDays = () => {
    const startOfWeek = currentDate.startOf("week")
    const weekDays = []
    for (let i = 0; i < 7; i++) {
      weekDays.push(startOfWeek.add(i, "day"))
    }
    return weekDays
  }

  const handlePrevMonth = () => setCurrentDate(currentDate.subtract(1, "month"))
  const handleNextMonth = () => setCurrentDate(currentDate.add(1, "month"))
  const handlePrevWeek = () => setCurrentDate(currentDate.subtract(1, "week"))
  const handleNextWeek = () => setCurrentDate(currentDate.add(1, "week"))
  const handlePrevDay = () => setCurrentDate(currentDate.subtract(1, "day"))
  const handleNextDay = () => setCurrentDate(currentDate.add(1, "day"))
  const handleToday = () => setCurrentDate(today)

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
    setShowEventDetail(true)
  }

  const handleEditEvent = (event) => {
    setSelectedEvent(event)
    setSelectedDate(dayjs(event.date))
    setShowEventDetail(false)
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
    setShowEventDetail(false)
    setSelectedEvent(null)
  }

  const toggleCategory = (category) => {
    setVisibleCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }))
  }

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      searchTerm === "" ||
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterType === "all" || event.type === filterType
    const matchesCategory = visibleCategories[event.type]

    return matchesSearch && matchesFilter && matchesCategory
  })

  const getNavigationHandlers = () => {
    switch (viewMode) {
      case "week":
        return { prev: handlePrevWeek, next: handleNextWeek }
      case "day":
        return { prev: handlePrevDay, next: handleNextDay }
      default:
        return { prev: handlePrevMonth, next: handleNextMonth }
    }
  }

  const getViewTitle = () => {
    switch (viewMode) {
      case "week":
        const weekStart = currentDate.startOf("week")
        const weekEnd = currentDate.endOf("week")
        return `${weekStart.format("MMM D")} - ${weekEnd.format("MMM D, YYYY")}`
      case "day":
        return currentDate.format("MMMM D, YYYY")
      default:
        return currentDate.format("MMMM YYYY")
    }
  }

  const renderCalendarGrid = () => {
    const { prev, next } = getNavigationHandlers()

    if (viewMode === "day") {
      const dayEvents = getEventsForDate(currentDate)
      return (
        <div className={`calendar-grid day-view`}>
          <div className="day-header">{currentDate.format("dddd, MMMM D, YYYY")}</div>
          <div className="calendar-day today" onClick={() => handleDateClick(currentDate)}>
            <div className="day-number today">
              <span>{currentDate.format("D")}</span>
            </div>
            <div className="events-container">
              {dayEvents.map((event) => (
                <div
                  key={event.id}
                  className="event-item"
                  style={{ "--event-color": event.color }}
                  onClick={(e) => handleEventClick(event, e)}
                  title={`${event.title} - ${event.startTime}`}
                >
                  {event.startTime} - {event.title}
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    }

    if (viewMode === "week") {
      const weekDays = getWeekDays()
      return (
        <div className={`calendar-grid week-view`}>
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="day-header">
              {day}
            </div>
          ))}
          {weekDays.map((day, index) => {
            const dayEvents = getEventsForDate(day)
            const isToday = day.isSame(today, "day")
            const isSelected = selectedDate && day.isSame(selectedDate, "day")

            return (
              <div
                key={index}
                className={`calendar-day ${isToday ? "today" : ""} ${isSelected ? "selected" : ""}`}
                onClick={() => handleDateClick(day)}
              >
                <div className={`day-number ${isToday ? "today" : ""}`}>
                  <span>{day.format("D")}</span>
                </div>
                <div className="events-container">
                  {dayEvents.slice(0, 4).map((event) => (
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
                  {dayEvents.length > 4 && <div className="more-events">+{dayEvents.length - 4} more</div>}
                </div>
              </div>
            )
          })}
        </div>
      )
    }

    return (
      <div className="calendar-grid">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="day-header">
            {day}
          </div>
        ))}
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
    )
  }

  return (
    <div className="calendar-container">
      <header className="calendar-header">
        <div className="header-left">
          <div className="calendar-logo">
            <div className="calendar-icon">📅</div>
            <span>Calendar Pro</span>
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

      <main className="calendar-main">
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

        <div className="calendar-content">
          <div className="calendar-navigation">
            <div className="nav-left">
              <button className="nav-button" onClick={getNavigationHandlers().prev}>
                ‹
              </button>
              <button className="nav-button" onClick={getNavigationHandlers().next}>
                ›
              </button>
              <h2 className="current-month">{getViewTitle()}</h2>
            </div>
            <button className="today-button" onClick={handleToday}>
              Today
            </button>
          </div>

          <div className="calendar-grid-container">{renderCalendarGrid()}</div>
        </div>

        {showEventList && (
          <EventList events={filteredEvents} onEventClick={handleEventClick} eventCategories={eventCategories} />
        )}
      </main>

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

      {showEventDetail && selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          onEdit={handleEditEvent}
          onDelete={handleDeleteEvent}
          onClose={() => {
            setShowEventDetail(false)
            setSelectedEvent(null)
          }}
        />
      )}
    </div>
  )
}

export default Calendar
