import { useCallback, useState } from "react";

interface UseModal {
  isOpen: boolean;
  toggleModal: () => void;
  closeModal: () => void;
}

const useModal = (): UseModal => {
  const [isOpen, setOpen] = useState(false);

  const toggleModal = useCallback(() => {
    setOpen((open) => !open);
  }, []);

  const closeModal = useCallback(() => {
    setOpen(false);
  }, []);

  return { isOpen, toggleModal, closeModal };
};

export default useModal;
