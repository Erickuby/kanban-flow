import { useState } from 'react'

function ColumnModal({ column, colors, onSave, onClose }) {
  const [title, setTitle] = useState(column?.title || '')
  const [color, setColor] = useState(column?.color || colors[0])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim()) return

    onSave({
      title: title.trim(),
      color,
    })
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">{column ? 'Edit Column' : 'New Column'}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label">Column Name *</label>
              <input
                type="text"
                className="form-input"
                placeholder="Enter column name..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                autoFocus
              />
            </div>

            <div className="form-group">
              <label className="form-label">Color</label>
              <div className="color-picker">
                {colors.map(c => (
                  <button
                    key={c}
                    type="button"
                    className={`color-option ${color === c ? 'selected' : ''}`}
                    style={{ backgroundColor: c }}
                    onClick={() => setColor(c)}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={!title.trim()}>
              {column ? 'Save Changes' : 'Create Column'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ColumnModal
