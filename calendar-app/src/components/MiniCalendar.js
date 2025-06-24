
import dayjs from "dayjs"

const MiniCalendar = ({ currentDate, onDateChange, events, holidays, getEventsForDate, isHoliday, isSunday }) => {
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
    <section className="mini-calendar" aria-labelledby="mini-calendar-title">
      <header className="mini-calendar-header">
        <h3 id="mini-calendar-title" className="mini-calendar-title">
          {currentDate.format("MMMM YYYY")}
        </h3>
        <div>
          <button className="mini-nav-button" onClick={handlePrevMonth} aria-label="Previous month">
            ‹
          </button>
          <button className="mini-nav-button" onClick={handleNextMonth} aria-label="Next month">
            ›
          </button>
        </div>
      </header>

      <div className="mini-calendar-grid" role="grid">
        {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
          <div key={day} className="mini-day-header" role="columnheader">
            <span className="sr-only">
              {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][index]}
            </span>
            {day}
          </div>
        ))}

        {calendarDays.map((day, index) => {
          const isToday = day.isSame(today, "day")
          const isCurrentMonth = day.isSame(currentDate, "month")
          const hasEvents = getEventsForDate(day).length > 0
          const isHolidayDay = isHoliday(day)
          const isSundayDay = isSunday(day)

          return (
            <button
              key={index}
              className={`mini-day ${
                !isCurrentMonth ? "other-month" : ""
              } ${isToday ? "today" : ""} ${hasEvents ? "has-events" : ""} ${
                isHolidayDay || isSundayDay ? "holiday" : ""
              }`}
              onClick={() => handleDateClick(day)}
              role="gridcell"
              aria-label={`${day.format("MMMM D, YYYY")}${hasEvents ? ", has events" : ""}${isToday ? ", today" : ""}`}
            >
              {day.format("D")}
            </button>
          )
        })}
      </div>
    </section>
  )
}

export default MiniCalendar
