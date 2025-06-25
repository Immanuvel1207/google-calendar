
import { useState, useCallback, useEffect } from "react"
import dayjs from "dayjs"
import EventModal from "./EventModal"
import EventList from "./EventList"
import MiniCalendar from "./MiniCalendar"
import EventDetailModal from "./EventDetailModal"
import ConflictModal from "./ConflictModal"
import NotificationSystem from "./NotificationSystem"
import eventsData from "../data/events.json"
import "../styles/Calendar.css"

const Calendar = ({ onTabChange }) => {
  const [currentDate, setCurrentDate] = useState(() => {
    const saved = localStorage.getItem("calendar-current-date")
    return saved ? dayjs(saved) : dayjs()
  })

  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem("calendar-events")
    return saved ? JSON.parse(saved) : eventsData
  })

  const [holidays, setHolidays] = useState([])
  const [currentQuote, setCurrentQuote] = useState(null)
  const [isLoadingQuote, setIsLoadingQuote] = useState(true)
  const [isLoadingHolidays, setIsLoadingHolidays] = useState(true)

  const [selectedDate, setSelectedDate] = useState(() => {
    const saved = localStorage.getItem("calendar-selected-date")
    return saved ? dayjs(saved) : null
  })

  const [showEventModal, setShowEventModal] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [showEventDetail, setShowEventDetail] = useState(false)
  const [showConflictModal, setShowConflictModal] = useState(false)
  const [conflictData, setConflictData] = useState(null)

  const [searchTerm, setSearchTerm] = useState(() => {
    return localStorage.getItem("calendar-search-term") || ""
  })

  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem("calendar-view-mode") || "month"
  })

  const [isViewChanging, setIsViewChanging] = useState(false)
  const [isPageTurning, setIsPageTurning] = useState(false)

  const [selectedFilters, setSelectedFilters] = useState(() => {
    const saved = localStorage.getItem("calendar-selected-filters")
    return saved ? JSON.parse(saved) : []
  })

  const [quickNavYear, setQuickNavYear] = useState(currentDate.year())
  const [quickNavMonth, setQuickNavMonth] = useState(currentDate.month())

  const [notifications, setNotifications] = useState([])
  const [showSidebar, setShowSidebar] = useState(true)
  const [showEventList, setShowEventList] = useState(true)

  // Request notification permission on component mount
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission()
    }
  }, [])

  useEffect(() => {
    const fetchDailyQuote = async () => {
      const today = dayjs().format("YYYY-MM-DD")
      const savedQuote = localStorage.getItem(`daily-quote-${today}`)

      if (savedQuote) {
        setCurrentQuote(JSON.parse(savedQuote))
        setIsLoadingQuote(false)
        return
      }

      try {
        const response = await fetch("https://quotes-api-self.vercel.app/quote")
        const data = await response.json()
        const quote = {
          quote: data.quote,
          author: data.author,
        }
        setCurrentQuote(quote)
        localStorage.setItem(`daily-quote-${today}`, JSON.stringify(quote))
      } catch (error) {
        const fallbackQuote = {
          quote: "The future depends on what you do today.",
          author: "Mahatma Gandhi",
        }
        setCurrentQuote(fallbackQuote)
        localStorage.setItem(`daily-quote-${today}`, JSON.stringify(fallbackQuote))
      } finally {
        setIsLoadingQuote(false)
      }
    }

    fetchDailyQuote()
  }, [])


  useEffect(() => {
    const fetchTamilNaduHolidays = async () => {
      setIsLoadingHolidays(true)
      try {
        const currentYear = new Date().getFullYear()

        const response = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${currentYear}/IN`)
        const nationalHolidays = await response.json()


        const tamilNaduHolidays = [
          {
            id: "pongal-1",
            title: "Bhogi Pandigai",
            date: `${currentYear}-01-14`,
            type: "state",
            color: "#f59e0b",
            description: "Tamil Festival: Bhogi Pandigai",
          },
          {
            id: "pongal-2",
            title: "Thai Pongal",
            date: `${currentYear}-01-15`,
            type: "state",
            color: "#f59e0b",
            description: "Tamil Festival: Thai Pongal",
          },
          {
            id: "pongal-3",
            title: "Maattu Pongal",
            date: `${currentYear}-01-16`,
            type: "state",
            color: "#f59e0b",
            description: "Tamil Festival: Maattu Pongal",
          },
          {
            id: "pongal-4",
            title: "Kaanum Pongal",
            date: `${currentYear}-01-17`,
            type: "state",
            color: "#f59e0b",
            description: "Tamil Festival: Kaanum Pongal",
          },
          {
            id: "tamil-new-year",
            title: "Tamil New Year",
            date: `${currentYear}-04-14`,
            type: "state",
            color: "#10b981",
            description: "Tamil New Year: Puthandu",
          },
          {
            id: "karthigai-deepam",
            title: "Karthigai Deepam",
            date: `${currentYear}-11-27`,
            type: "state",
            color: "#8b5cf6",
            description: "Tamil Festival: Karthigai Deepam",
          },
        ]

        const formattedNationalHolidays = nationalHolidays.map((holiday, index) => ({
          id: `national-${index}`,
          title: holiday.name,
          date: holiday.date,
          type: "national",
          color: "#22c55e",
          description: `National Holiday: ${holiday.name}`,
        }))


        const allHolidays = [...formattedNationalHolidays, ...tamilNaduHolidays]
        setHolidays(allHolidays)
      } catch (error) {
        console.error("Failed to fetch holidays:", error)
        const fallbackHolidays = [
          {
            id: "republic-day",
            title: "Republic Day",
            date: `${new Date().getFullYear()}-01-26`,
            type: "national",
            color: "#22c55e",
            description: "National Holiday: Republic Day",
          },
          {
            id: "pongal",
            title: "Pongal",
            date: `${new Date().getFullYear()}-01-15`,
            type: "state",
            color: "#f59e0b",
            description: "Tamil Festival: Pongal",
          },
          {
            id: "independence-day",
            title: "Independence Day",
            date: `${new Date().getFullYear()}-08-15`,
            type: "national",
            color: "#22c55e",
            description: "National Holiday: Independence Day",
          },
          {
            id: "gandhi-jayanti",
            title: "Gandhi Jayanti",
            date: `${new Date().getFullYear()}-10-02`,
            type: "national",
            color: "#22c55e",
            description: "National Holiday: Gandhi Jayanti",
          },
        ]
        setHolidays(fallbackHolidays)
      } finally {
        setIsLoadingHolidays(false)
      }
    }

    fetchTamilNaduHolidays()
  }, [])

  useEffect(() => {
    const checkReminders = () => {
      const now = dayjs()

      events.forEach((event) => {
        const eventDateTime = dayjs(`${event.date} ${event.startTime}`)
        const reminderTime = eventDateTime.subtract(event.reminder, "minute")

        if (now.isAfter(reminderTime) && now.isBefore(reminderTime.add(1, "minute"))) {
          showNotification(event)
          showDesktopNotification(event)
        }
      })
    }

    const interval = setInterval(checkReminders, 60000)
    return () => clearInterval(interval)
  }, [events])

  const showNotification = (event) => {
    const notification = {
      id: Date.now(),
      event,
      timestamp: dayjs(),
    }

    setNotifications((prev) => [...prev, notification])

    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== notification.id))
    }, 10000)
  }

  const showDesktopNotification = (event) => {
    if ("Notification" in window && Notification.permission === "granted") {
      const notification = new Notification(`${getEventEmoji(event.type)} Event Reminder`, {
        body: `${event.title}\n${event.startTime ? `Starting at ${event.startTime}` : "All day event"}\n${event.location ? `📍 ${event.location}` : ""}`,
        icon: "/favicon.ico",
        tag: `event-${event.id}`,
        requireInteraction: true,
      })

      notification.onclick = () => {
        window.focus()
        notification.close()
      }

      setTimeout(() => {
        notification.close()
      }, 10000)
    }
  }

  const getEventEmoji = (eventType) => {
    const emojiMap = {
      meeting: "🤝",
      review: "📋",
      presentation: "📊",
      training: "📚",
      planning: "📝",
      learning: "🎓",
      social: "🎉",
      birthday: "🎂",
      personal: "👤",
      other: "📌",
      national: "🏛️",
      state: "🎭",
    }
    return emojiMap[eventType] || "📅"
  }

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
    localStorage.setItem("calendar-view-mode", viewMode)
  }, [viewMode])

  useEffect(() => {
    localStorage.setItem("calendar-selected-filters", JSON.stringify(selectedFilters))
  }, [selectedFilters])

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
    meeting: { label: "Meetings", color: "#6366f1" },
    review: { label: "Reviews", color: "#8b5cf6" },
    presentation: { label: "Presentations", color: "#10b981" },
    training: { label: "Training", color: "#f59e0b" },
    planning: { label: "Planning", color: "#ef4444" },
    learning: { label: "Learning", color: "#06b6d4" },
    social: { label: "Social", color: "#84cc16" },
    birthday: { label: "Birthdays", color: "#ec4899" },
    personal: { label: "Personal", color: "#3b82f6" },
    other: { label: "Other", color: "#6b7280" },
  }

  const checkTimeConflict = (newEvent, existingEvents) => {
    if (newEvent.type === "birthday") return null

    const newStart = dayjs(`${newEvent.date} ${newEvent.startTime}`)
    const newEnd = dayjs(`${newEvent.date} ${newEvent.endTime}`)

    for (const event of existingEvents) {
      if (event.type === "birthday" || event.id === newEvent.id) continue

      const eventStart = dayjs(`${event.date} ${event.startTime}`)
      const eventEnd = dayjs(`${event.date} ${event.endTime}`)

      if (
        (newStart.isBefore(eventEnd) && newEnd.isAfter(eventStart)) ||
        (eventStart.isBefore(newEnd) && eventEnd.isAfter(newStart))
      ) {
        return event
      }
    }
    return null
  }

  const getEventsForDate = useCallback(
    (date) => {
      const allEvents = [...events, ...holidays]
      return allEvents.filter((event) => {
        const eventDate = dayjs(event.date)
        const matchesDate = eventDate.isSame(date, "day")
        const matchesSearch =
          searchTerm === "" ||
          event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (event.description && event.description.toLowerCase().includes(searchTerm.toLowerCase()))

        const matchesFilter = selectedFilters.length === 0 || selectedFilters.includes(event.type)

        return matchesDate && matchesSearch && matchesFilter
      })
    },
    [events, holidays, searchTerm, selectedFilters],
  )

  const getWeekDays = () => {
    const startOfWeek = currentDate.startOf("week")
    const weekDays = []
    for (let i = 0; i < 7; i++) {
      weekDays.push(startOfWeek.add(i, "day"))
    }
    return weekDays
  }

  const isHoliday = (date) => {
    return holidays.some((holiday) => dayjs(holiday.date).isSame(date, "day"))
  }

  const isSunday = (date) => {
    return date.day() === 0
  }

  const getMonthlyStats = () => {
    const monthEvents = events.filter((event) => dayjs(event.date).isSame(currentDate, "month"))
    const monthHolidays = holidays.filter((holiday) => dayjs(holiday.date).isSame(currentDate, "month"))
    const totalDays = currentDate.daysInMonth()
    const sundays = Math.floor(totalDays / 7) + (currentDate.startOf("month").day() === 0 ? 1 : 0)
    const holidayCount = monthHolidays.length + sundays
    const upcomingEvents = monthEvents.filter((event) => dayjs(event.date).isAfter(today))
    const pastEvents = monthEvents.filter((event) => dayjs(event.date).isBefore(today))

    return {
      totalDays,
      holidays: holidayCount,
      totalEvents: monthEvents.length,
      upcomingEvents: upcomingEvents.length,
      pastEvents: pastEvents.length,
    }
  }

  const handleViewChange = (newView) => {
    if (newView === viewMode) return

    setIsViewChanging(true)

    setTimeout(() => {
      setViewMode(newView)
      setTimeout(() => {
        setIsViewChanging(false)
      }, 250)
    }, 250)
  }

  const handleMonthNavigation = (direction) => {
    setIsPageTurning(true)

    setTimeout(() => {
      if (direction === "prev") {
        setCurrentDate(currentDate.subtract(1, "month"))
      } else {
        setCurrentDate(currentDate.add(1, "month"))
      }

      setTimeout(() => {
        setIsPageTurning(false)
      }, 300)
    }, 150)
  }

  const handlePrevMonth = () => handleMonthNavigation("prev")
  const handleNextMonth = () => handleMonthNavigation("next")
  const handlePrevWeek = () => setCurrentDate(currentDate.subtract(1, "week"))
  const handleNextWeek = () => setCurrentDate(currentDate.add(1, "week"))
  const handlePrevDay = () => setCurrentDate(currentDate.subtract(1, "day"))
  const handleNextDay = () => setCurrentDate(currentDate.add(1, "day"))
  const handleToday = () => setCurrentDate(today)

  const handleQuickNavigation = () => {
    const newDate = dayjs().year(quickNavYear).month(quickNavMonth)
    setCurrentDate(newDate)
  }

  const handleDateClick = (date) => {
    setSelectedDate(date)
    setSelectedEvent(null)
    setShowEventModal(true)
  }

  const handleEventClick = (event, e) => {
    e.stopPropagation()
    if (event.type === "national" || event.type === "state") return
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
    const conflictingEvent = checkTimeConflict(eventData, events)

    if (conflictingEvent && !selectedEvent) {
      setConflictData({
        newEvent: eventData,
        conflictingEvent,
      })
      setShowConflictModal(true)
      return
    }

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

  const handleConflictResolution = (resolution, priority, editedEvents) => {
    const { newEvent, conflictingEvent } = conflictData

    if (resolution === "keep-both" || resolution === "priority") {
      const newEventWithId = {
        ...newEvent,
        id: Math.max(...events.map((e) => e.id), 0) + 1,
      }

      setEvents([...events, newEventWithId])
    } else if (resolution === "edit-both" && editedEvents) {
      const updatedEvents = events.map((event) => {
        if (event.id === conflictingEvent.id) {
          return { ...editedEvents.conflictingEvent, id: event.id }
        }
        return event
      })

      const newEventWithId = {
        ...editedEvents.newEvent,
        id: Math.max(...events.map((e) => e.id), 0) + 1,
      }

      setEvents([...updatedEvents, newEventWithId])
    }

    setShowConflictModal(false)
    setShowEventModal(false)
    setConflictData(null)
    setSelectedEvent(null)
  }

  const handleDeleteEvent = (eventId) => {
    setEvents(events.filter((event) => event.id !== eventId))
    setShowEventModal(false)
    setShowEventDetail(false)
    setSelectedEvent(null)
  }

  const handleFilterToggle = (filterType) => {
    setSelectedFilters((prev) => {
      if (prev.includes(filterType)) {
        return prev.filter((f) => f !== filterType)
      } else {
        return [...prev, filterType]
      }
    })
  }

  const handleClearFilters = () => {
    setSelectedFilters([])
  }

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      searchTerm === "" ||
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (event.description && event.description.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesFilter = selectedFilters.length === 0 || selectedFilters.includes(event.type)

    return matchesSearch && matchesFilter
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
    if (viewMode === "day") {
      const dayEvents = getEventsForDate(currentDate)
      return (
        <div className="calendar-grid day-view">
          <div className="day-header">{currentDate.format("dddd, MMMM D, YYYY")}</div>
          <div
            className={`calendar-day today ${isHoliday(currentDate) || isSunday(currentDate) ? "holiday" : ""}`}
            onClick={() => handleDateClick(currentDate)}
          >
            <div className={`day-number today ${isHoliday(currentDate) ? "holiday" : ""}`}>
              <span>{currentDate.format("D")}</span>
            </div>
            <div className="events-container">
              {dayEvents.map((event) => (
                <div
                  key={event.id}
                  className={`event-item ${event.type === "national" || event.type === "state" ? "holiday" : ""}`}
                  style={{ "--event-color": event.color }}
                  onClick={(e) => handleEventClick(event, e)}
                  title={event.title}
                >
                  <span className="event-emoji">{getEventEmoji(event.type)}</span>
                  <span className="event-text">
                    {event.startTime && event.type !== "birthday" ? `${event.startTime} - ` : ""}
                    {event.title}
                  </span>
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
        <div className="calendar-grid week-view">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="day-header">
              {day}
            </div>
          ))}
          {weekDays.map((day, index) => {
            const dayEvents = getEventsForDate(day)
            const isToday = day.isSame(today, "day")
            const isSelected = selectedDate && day.isSame(selectedDate, "day")
            const isHolidayDay = isHoliday(day) || isSunday(day)

            return (
              <div
                key={index}
                className={`calendar-day ${isToday ? "today" : ""} ${isSelected ? "selected" : ""} ${
                  isHolidayDay ? "holiday" : ""
                }`}
                onClick={() => handleDateClick(day)}
              >
                <div className={`day-number ${isToday ? "today" : ""} ${isHolidayDay ? "holiday" : ""}`}>
                  <span>{day.format("D")}</span>
                </div>
                <div className="events-container">
                  {dayEvents.slice(0, 4).map((event) => (
                    <div
                      key={event.id}
                      className={`event-item ${event.type === "national" || event.type === "state" ? "holiday" : ""}`}
                      style={{ "--event-color": event.color }}
                      onClick={(e) => handleEventClick(event, e)}
                      title={event.title}
                    >
                      <span className="event-emoji">{getEventEmoji(event.type)}</span>
                      <span className="event-text">{event.title}</span>
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
          const isHolidayDay = isHoliday(day) || isSunday(day)

          return (
            <div
              key={index}
              className={`calendar-day ${
                !isCurrentMonth ? "other-month" : ""
              } ${isToday ? "today" : ""} ${isSelected ? "selected" : ""} ${isHolidayDay ? "holiday" : ""}`}
              onClick={() => handleDateClick(day)}
            >
              <div className={`day-number ${isToday ? "today" : ""} ${isHolidayDay ? "holiday" : ""}`}>
                <span>{day.format("D")}</span>
              </div>
              <div className="events-container">
                {dayEvents.slice(0, 3).map((event) => (
                  <div
                    key={event.id}
                    className={`event-item ${event.type === "national" || event.type === "state" ? "holiday" : ""}`}
                    style={{ "--event-color": event.color }}
                    onClick={(e) => handleEventClick(event, e)}
                    title={event.title}
                  >
                    <span className="event-emoji">{getEventEmoji(event.type)}</span>
                    <span className="event-text">{event.title}</span>
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

  const monthlyStats = getMonthlyStats()

  return (
    <div className="calendar-container">
      <header className="calendar-header">
        <div className="header-left">
          <button className="hamburger-button" onClick={() => setShowSidebar(!showSidebar)} aria-label="Toggle sidebar">
            ☰
          </button>

          <div className="app-toggle">
            <button className={`toggle-half ${true ? "active" : ""}`} onClick={() => onTabChange("calendar")}>
              📅 Calendar
            </button>
            <button className={`toggle-half ${false ? "active" : ""}`} onClick={() => onTabChange("priorities")}>
              🎯 Tasks
            </button>
          </div>
        </div>

        <div className="header-center">
          <div className="monthly-stats-header">
            <div className="stat-item-header">
              <span className="stat-number-header">{monthlyStats.totalEvents}</span>
              <span className="stat-label-header">Events</span>
            </div>
            <div className="stat-item-header">
              <span className="stat-number-header">{monthlyStats.upcomingEvents}</span>
              <span className="stat-label-header">Upcoming</span>
            </div>
            <div className="stat-item-header">
              <span className="stat-number-header">{monthlyStats.holidays}</span>
              <span className="stat-label-header">Holidays</span>
            </div>
          </div>
        </div>

        <div className="header-controls">
          <div className="search-container">
            <div className="search-icon"></div>
            <input
              type="text"
              className="search-input"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search events"
            />
          </div>

          <div className="view-toggle" role="tablist">
            <button
              className={`view-button ${viewMode === "month" ? "active" : ""}`}
              onClick={() => handleViewChange("month")}
              role="tab"
              aria-selected={viewMode === "month"}
            >
              Month
            </button>
            <button
              className={`view-button ${viewMode === "week" ? "active" : ""}`}
              onClick={() => handleViewChange("week")}
              role="tab"
              aria-selected={viewMode === "week"}
            >
              Week
            </button>
            <button
              className={`view-button ${viewMode === "day" ? "active" : ""}`}
              onClick={() => handleViewChange("day")}
              role="tab"
              aria-selected={viewMode === "day"}
            >
              Day
            </button>
          </div>

          <button className="create-button" onClick={handleCreateEvent} aria-label="Create new event">
            <span>+</span>
            Create
          </button>

          <button
            className="events-toggle-button"
            onClick={() => setShowEventList(!showEventList)}
            aria-label="Toggle events panel"
          >
            📋
          </button>
        </div>
      </header>

      <main className="calendar-main">
        {showSidebar && (
          <aside className="calendar-sidebar">
            <section className="motivation-section" aria-labelledby="motivation-title">
              <h3 id="motivation-title" className="sr-only">
                Daily Motivation
              </h3>
              {isLoadingQuote ? (
                <div className="quote-loading">Loading inspiration...</div>
              ) : (
                <>
                  <blockquote className="motivation-quote">"{currentQuote?.quote}"</blockquote>
                  <cite className="motivation-author">— {currentQuote?.author}</cite>
                </>
              )}
            </section>

            <section className="quick-navigation" aria-labelledby="nav-title">
              <h3 id="nav-title" className="nav-title">
                Quick Navigation
              </h3>
              <div className="date-selectors">
                <select
                  className="date-select"
                  value={quickNavYear}
                  onChange={(e) => setQuickNavYear(Number.parseInt(e.target.value))}
                  aria-label="Select year"
                >
                  {Array.from({ length: 50 }, (_, i) => 2000 + i).map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
                <select
                  className="date-select"
                  value={quickNavMonth}
                  onChange={(e) => setQuickNavMonth(Number.parseInt(e.target.value))}
                  aria-label="Select month"
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i} value={i}>
                      {dayjs().month(i).format("MMMM")}
                    </option>
                  ))}
                </select>
              </div>
              <button className="go-to-date" onClick={handleQuickNavigation}>
                Go to Date
              </button>
            </section>

            <MiniCalendar
              currentDate={currentDate}
              onDateChange={setCurrentDate}
              events={events}
              holidays={holidays}
              getEventsForDate={getEventsForDate}
              isHoliday={isHoliday}
              isSunday={isSunday}
            />
          </aside>
        )}

        <div
          className={`calendar-content ${isViewChanging ? "view-changing" : ""} ${isPageTurning ? "page-turning" : ""}`}
        >
          <div className="calendar-navigation">
            <div className="nav-left">
              <button className="nav-button" onClick={getNavigationHandlers().prev} aria-label={`Previous ${viewMode}`}>
                ‹
              </button>
              <button className="nav-button" onClick={getNavigationHandlers().next} aria-label={`Next ${viewMode}`}>
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
          <EventList
            events={filteredEvents}
            onEventClick={handleEventClick}
            eventCategories={eventCategories}
            selectedFilters={selectedFilters}
            onFilterToggle={handleFilterToggle}
            onClearFilters={handleClearFilters}
            getEventEmoji={getEventEmoji}
          />
        )}
      </main>

      <NotificationSystem
        notifications={notifications}
        onDismiss={(id) => setNotifications((prev) => prev.filter((n) => n.id !== id))}
        getEventEmoji={getEventEmoji}
      />

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

      {showConflictModal && conflictData && (
        <ConflictModal
          conflictData={conflictData}
          onResolve={handleConflictResolution}
          onClose={() => {
            setShowConflictModal(false)
            setConflictData(null)
          }}
        />
      )}
    </div>
  )
}

export default Calendar
