import { Button, Modal } from "react-bootstrap"
import useModal from "../../CustomHooks/useModal";

export default function CustomModal() {
    const { modal, closeModal } = useModal();
    return (
        <Modal
            size="lg"
            show={modal.isOpen}
            onHide={closeModal}
        >
            <Modal.Header closeButton>
                <Modal.Title>
                    {modal.title}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {modal.content}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={closeModal}>
                    Đóng
                </Button>
                <Button variant="dark" onClick={modal.onAccept}>
                    Lưu
                </Button>
            </Modal.Footer>
        </Modal>
    );
}
