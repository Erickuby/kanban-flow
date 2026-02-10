import { useState, useRef } from 'react'
import { v4 as uuidv4 } from 'uuid'

const TAG_COLORS = ['purple', 'blue', 'green', 'orange', 'pink', 'cyan']

function TaskModal({ task, onSave, onClose }) {
  const [title, setTitle] = useState(task?.title || '')
  const [description, setDescription] = useState(task?.description || '')
  const [priority, setPriority] = useState(task?.priority || 'medium')
  const [dueDate, setDueDate] = useState(task?.dueDate || '')
  const [tags, setTags] = useState(task?.tags || [])
  const [tagInput, setTagInput] = useState('')
  const [subtasks, setSubtasks] = useState(task?.subtasks || [])
  const [newSubtask, setNewSubtask] = useState('')
  const tagInputRef = useRef(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim()) return

    onSave({
      title: title.trim(),
      description: description.trim(),
      priority,
      dueDate: dueDate || null,
      tags,
      subtasks,
    })
  }

  const handleAddTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault()
      const newTag = {
        text: tagInput.trim(),
        color: TAG_COLORS[tags.length % TAG_COLORS.length],
      }
      setTags([...tags, newTag])
      setTagInput('')
    }
  }

  const handleRemoveTag = (index) => {
    setTags(tags.filter((_, i) => i !== index))
  }

  const handleAddSubtask = () => {
    if (!newSubtask.trim()) return
    setSubtasks([...subtasks, {
      id: uuidv4(),
      text: newSubtask.trim(),
      completed: false,
    }])
    setNewSubtask('')
  }

  const handleToggleSubtask = (id) => {
    setSubtasks(subtasks.map(s =>
      s.id === id ? { ...s, completed: !s.completed } : s
    ))
  }

  const handleDeleteSubtask = (id) => {
    setSubtasks(subtasks.filter(s => s.id !== id))
  }

  const completedCount = subtasks.filter(s => s.completed).length

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal wide" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{task ? 'Edit Task' : 'New Task'}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Title *</label>
              <input
                type="text"
                className="form-input"
                placeholder="Enter task title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                autoFocus
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="form-textarea"
                placeholder="Add a description..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Priority</label>
                <select
                  className="form-select"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Due Date</label>
                <input
                  type="date"
                  className="form-input"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Tags (press Enter to add)</label>
              <div
                className="tag-input-container"
                onClick={() => tagInputRef.current?.focus()}
              >
                {tags.map((tag, index) => (
                  <span key={index} className={`tag ${tag.color}`}>
                    {tag.text}
                    <button
                      type="button"
                      className="tag-remove"
                      onClick={() => handleRemoveTag(index)}
                    >
                      ×
                    </button>
                  </span>
                ))}
                <input
                  ref={tagInputRef}
                  type="text"
                  className="tag-input"
                  placeholder={tags.length === 0 ? "Type and press Enter..." : ""}
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                />
              </div>
            </div>

            {/* Subtasks / Checklist */}
            <div className="subtasks-section">
              <div className="subtasks-header">
                <span className="subtasks-title">
                  ✓ Checklist {subtasks.length > 0 && `(${completedCount}/${subtasks.length})`}
                </span>
              </div>
              
              {subtasks.length > 0 && (
                <div className="subtask-list">
                  {subtasks.map(subtask => (
                    <div key={subtask.id} className="subtask-item">
                      <input
                        type="checkbox"
                        className="subtask-checkbox"
                        checked={subtask.completed}
                        onChange={() => handleToggleSubtask(subtask.id)}
                      />
                      <span className={`subtask-text ${subtask.completed ? 'completed' : ''}`}>
                        {subtask.text}
                      </span>
                      <button
                        type="button"
                        className="subtask-delete"
                        onClick={() => handleDeleteSubtask(subtask.id)}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="add-subtask">
                <input
                  type="text"
                  className="form-input"
                  placeholder="Add a subtask..."
                  value={newSubtask}
                  onChange={(e) => setNewSubtask(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleAddSubtask()
                    }
                  }}
                />
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={handleAddSubtask}
                >
                  Add
                </button>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={!title.trim()}>
              {task ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TaskModal
