import { useState } from 'react';
import CustomModal from '../Components/Fragments/CustomModal';
import { ModalContext } from './Context';

export default function ModalProvider({ children }) {
    const [modal, setModal] = useState({
        isOpen: false,
        title: '',
        content: '',
        onAccept: () => {},
    });

    const openModal = (title, content, onAccept) => {
        setModal({
            isOpen: true,
            title,
            content,
            onAccept,
        });
    };

    const closeModal = () => {
        setModal({
            isOpen: false,
            title: '',
            content: '',
            onAccept: () => {},
        });
    };

    return (
        <ModalContext.Provider value={{ modal, openModal, closeModal }}>
            {modal.isOpen && <CustomModal />}
            {children}
        </ModalContext.Provider>
    );
}
