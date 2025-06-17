import { useState } from 'react';

export const useModal = (initialModalOpenState: boolean = false) => {
  const [isOpen, setIsOpen] = useState(initialModalOpenState);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return {
    isOpen,
    setIsOpen,
    openModal,
    closeModal,
    toggleModal: () => setIsOpen(!isOpen),
  };
};
