"use client"

import { useState, useEffect } from "react"

const PriorityModal = ({ priority, onSave, onDelete, onClose }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    priority: "medium",
  })

  useEffect(() => {
    if (priority) {
      setFormData({
        title: priority.title,
        description: priority.description || "",
        priority: priority.priority || "medium",
      })
    }
  }, [priority])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.title.trim()) return
    onSave(formData)
  }

  const handleDelete = () => {
    if (priority && window.confirm("Are you sure you want to delete this priority?")) {
      onDelete(priority.id)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <header className="modal-header">
          <h3 className="modal-title">{priority ? "Edit Priority" : "Add Priority"}</h3>
          <button className="close-button" onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        </header>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label htmlFor="priority-title" className="form-label">
                Priority Title
              </label>
              <input
                id="priority-title"
                type="text"
                className="form-input"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Enter priority title"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="priority-description" className="form-label">
                Description (Optional)
              </label>
              <textarea
                id="priority-description"
                className="form-textarea"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Add details about this priority"
                rows="3"
              />
            </div>

            <div className="form-group">
              <label htmlFor="priority-level" className="form-label">
                Priority Level
              </label>
              <select
                id="priority-level"
                className="form-select"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
            </div>
          </div>

          <footer className="modal-footer">
            {priority && (
              <button type="button" className="delete-button" onClick={handleDelete}>
                Delete Priority
              </button>
            )}

            <div className="modal-actions">
              <button type="button" className="cancel-button" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="save-button">
                {priority ? "Update Priority" : "Add Priority"}
              </button>
            </div>
          </footer>
        </form>
      </div>
    </div>
  )
}

export default PriorityModal
