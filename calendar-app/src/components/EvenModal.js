"use client"

import { useState, useEffect } from "react"

const EventModal = ({ event, selectedDate, onSave, onDelete, onClose, eventCategories }) => {
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    startTime: "",
    endTime: "",
    description: "",
    color: "#4285f4",
    type: "meeting",
    location: "",
    attendees: "",
    reminder: 15,
    image: null,
  })

  const [imagePreview, setImagePreview] = useState(null)

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        date: event.date,
        startTime: event.startTime,
        endTime: event.endTime,
        description: event.description || "",
        color: event.color,
        type: event.type,
        location: event.location || "",
        attendees: event.attendees ? event.attendees.join(", ") : "",
        reminder: event.reminder || 15,
        image: event.image || null,
      })
      if (event.image) {
        setImagePreview(event.image)
      }
    } else if (selectedDate) {
      setFormData((prev) => ({
        ...prev,
        date: selectedDate.format("YYYY-MM-DD"),
      }))
    }
  }, [event, selectedDate])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.title.trim()) return

    let eventData = {
      ...formData,
      attendees: formData.attendees
        .split(",")
        .map((email) => email.trim())
        .filter((email) => email),
    }

    if (formData.type === "birthday") {
      eventData = {
        ...eventData,
        startTime: "00:00",
        endTime: "23:59",
        reminder: 1080,
        color: "#ff69b4",
      }
    }

    onSave(eventData)
  }

  const handleDelete = () => {
    if (event && window.confirm("Are you sure you want to delete this event?")) {
      onDelete(event.id)
    }
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageData = e.target.result
        setFormData({ ...formData, image: imageData })
        setImagePreview(imageData)
      }
      reader.readAsDataURL(file)
    }
  }

  const colorOptions = [
    "#4285f4",
    "#ea4335",
    "#34a853",
    "#fbbc04",
    "#ff9800",
    "#9c27b0",
    "#00bcd4",
    "#795548",
    "#607d8b",
    "#e91e63",
    "#3f51b5",
    "#009688",
  ]

  const isBirthday = formData.type === "birthday"

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">{event ? "Edit Event" : "Create Event"}</h3>
          <button className="close-button" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Event Title</label>
              <input
                type="text"
                className="form-input"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder={isBirthday ? "Enter person's name" : "Enter event title"}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Event Type</label>
                <select
                  className="form-select"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                >
                  {Object.entries(eventCategories).map(([key, category]) => (
                    <option key={key} value={key}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {!isBirthday && (
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Start Time</label>
                  <input
                    type="time"
                    className="form-input"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">End Time</label>
                  <input
                    type="time"
                    className="form-input"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    required
                  />
                </div>
              </div>
            )}

            {!isBirthday && (
              <div className="form-group">
                <label className="form-label">Location</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Enter location"
                />
              </div>
            )}

            {!isBirthday && (
              <div className="form-group">
                <label className="form-label">Attendees (comma-separated emails)</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.attendees}
                  onChange={(e) => setFormData({ ...formData, attendees: e.target.value })}
                  placeholder="email1@example.com, email2@example.com"
                />
              </div>
            )}

            {!isBirthday && (
              <div className="form-group">
                <label className="form-label">Reminder</label>
                <select
                  className="form-select"
                  value={formData.reminder}
                  onChange={(e) => setFormData({ ...formData, reminder: Number.parseInt(e.target.value) })}
                >
                  <option value={0}>No reminder</option>
                  <option value={5}>5 minutes before</option>
                  <option value={15}>15 minutes before</option>
                  <option value={30}>30 minutes before</option>
                  <option value={60}>1 hour before</option>
                  <option value={120}>2 hours before</option>
                  <option value={1440}>1 day before</option>
                </select>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Color</label>
              <div className="color-picker">
                {colorOptions.map((color) => (
                  <div
                    key={color}
                    className={`color-option ${formData.color === color ? "selected" : ""}`}
                    style={{ backgroundColor: color }}
                    onClick={() => setFormData({ ...formData, color })}
                  />
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Event Image (Optional)</label>
              <div
                className={`image-upload ${imagePreview ? "has-image" : ""}`}
                onClick={() => document.getElementById("image-input").click()}
              >
                <input
                  id="image-input"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: "none" }}
                />
                {imagePreview ? (
                  <img src={imagePreview || "/placeholder.svg"} alt="Event preview" className="image-preview" />
                ) : (
                  <div className="upload-text">📷 Click to upload an image</div>
                )}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="form-textarea"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder={isBirthday ? "Birthday wishes or notes" : "Enter event description"}
                rows="4"
              />
            </div>
          </div>

          <div className="modal-footer">
            {event && (
              <button type="button" className="delete-button" onClick={handleDelete}>
                Delete Event
              </button>
            )}

            <div className="modal-actions">
              <button type="button" className="cancel-button" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="save-button">
                {event ? "Update Event" : "Create Event"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EventModal
