import { useContext } from 'react'
import { ModalContext } from '../ContextProvider/Context';


export default function useModal() {
    return useContext(ModalContext);
}
