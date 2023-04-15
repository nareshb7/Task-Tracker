import React, { useState } from "react";
import "./Modal.css";

export default function Modal({ isOpen, setModal, children }) {
  const toggleModal = () => {
    setModal(!isOpen);
  };

  if (isOpen) {
    document.body.classList.add('active-modal')
  } else {
    document.body.classList.remove('active-modal')
  }
  return (
    <>
      {isOpen && (
        <div className="modal-local">
          <div onClick={toggleModal} className="overlay"></div>
          <div className="modal-content">
            <>{children}</>
            <button className="close-modal" onClick={toggleModal}>
              X
            </button>
          </div>
        </div>
      )}
    </>
  );
}
