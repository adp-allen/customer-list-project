import './LoginModal.css';

interface ConfirmModalProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal = ({ message, onConfirm, onCancel }: ConfirmModalProps) => (
  <div className="modal-overlay">
    <div className="modal">
      <button className="close-btn" onClick={onCancel}>×</button>
      <h2 className="modal-title">Confirm</h2>
      <div style={{ margin: '1.5rem 0' }}>{message}</div>
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center', // Center the buttons horizontally
          marginTop: '1.5rem'
        }}
      >
        <button className="login-btn" onClick={onCancel}>Cancel</button>
        <button className="login-btn" style={{ background: '#e53935' }} onClick={onConfirm}>Delete</button>
      </div>
    </div>
  </div>
);

export default ConfirmModal;