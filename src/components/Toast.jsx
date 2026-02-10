function Toast({ type, title, message, onClose }) {
  return (
    <div className={`toast ${type}`}>
      <div className="toast-content">
        <div className="toast-title">{title}</div>
        {message && <div className="toast-message">{message}</div>}
      </div>
      <button className="toast-close" onClick={onClose}>✕</button>
    </div>
  )
}

export default Toast
