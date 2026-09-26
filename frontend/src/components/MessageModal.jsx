import { FaTimes } from "react-icons/fa";

function MessageModal({
  show,
  type = "info",
  title,
  message,
  onClose,
  onConfirm,
  confirmText = "OK",
  cancelText = "Cancel",
  showCancel = false,
}) {
  if (!show) return null;

  return (
    <div className="message-modal-overlay">
      <div className={`message-modal-box ${type}`}>
        <button
          type="button"
          className="message-modal-close"
          onClick={onClose}
        >
          <FaTimes />
        </button>

        <h2>{title}</h2>

        <p>{message}</p>

        <div className="message-modal-actions">
          {showCancel && (
            <button
              type="button"
              className="message-modal-cancel"
              onClick={onClose}
            >
              {cancelText}
            </button>
          )}

          <button
            type="button"
            className="message-modal-ok"
            onClick={onConfirm || onClose}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default MessageModal;