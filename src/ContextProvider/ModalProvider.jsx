import { useState } from 'react';
import CustomModal from '../Components/Fragments/CustomModal';
import { ModalContext } from './Context';

export default function ModalProvider({ children }) {
    const [modal, setModal] = useState({
        isOpen: false,
        title: '',
        content: '',
        isNoti: false,
        onAccept: () => {},
    });

    const openModal = (title, content, onAccept, isNoti) => {
        setModal({
            isOpen: true,
            title,
            content,
            isNoti,
            onAccept,
        });
    };

    const closeModal = () => {
        setModal({
            isOpen: false,
            title: '',
            content: '',
            isNoti: false,
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
