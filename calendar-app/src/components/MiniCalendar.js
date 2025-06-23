"use client"

import dayjs from "dayjs"

const MiniCalendar = ({ currentDate, onDateChange, events, getEventsForDate }) => {
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

  const handlePrevMonth = () => {
    onDateChange(currentDate.subtract(1, "month"))
  }

  const handleNextMonth = () => {
    onDateChange(currentDate.add(1, "month"))
  }

  const handleDateClick = (date) => {
    onDateChange(date)
  }

  return (
    <div className="mini-calendar">
      <div className="mini-calendar-header">
        <h3 className="mini-calendar-title">{currentDate.format("MMMM YYYY")}</h3>
        <div>
          <button className="mini-nav-button" onClick={handlePrevMonth}>
            ‹
          </button>
          <button className="mini-nav-button" onClick={handleNextMonth}>
            ›
          </button>
        </div>
      </div>

      <div className="mini-calendar-grid">
        {["S", "M", "T", "W", "T", "F", "S"].map((day) => (
          <div key={day} className="mini-day-header">
            {day}
          </div>
        ))}

        {calendarDays.map((day, index) => {
          const isToday = day.isSame(today, "day")
          const isCurrentMonth = day.isSame(currentDate, "month")
          const hasEvents = getEventsForDate(day).length > 0

          return (
            <div
              key={index}
              className={`mini-day ${
                !isCurrentMonth ? "other-month" : ""
              } ${isToday ? "today" : ""} ${hasEvents ? "has-events" : ""}`}
              onClick={() => handleDateClick(day)}
            >
              {day.format("D")}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default MiniCalendar
