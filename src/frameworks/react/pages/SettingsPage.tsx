import { Modal, Button } from 'react-bootstrap';
import type { OptionsController } from '../../../adapters/controllers/OptionsController';

type Props = {
  controller: OptionsController;
  show: boolean;
  onClose: () => void;
};

export function SettingsModal({ controller, show, onClose }: Props) {
  function handleLogout(){
    controller.signOut();
  }

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Settings</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex justify-content-between align-items-center">
          <span>Logout</span>
          <Button variant="outline-danger" onClick={handleLogout}>
            <i className="bi bi-box-arrow-right me-2"></i>
            Logout
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
}
