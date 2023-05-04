import React, { useState } from "react";
import "./Modal.css";
import { Button, CloseButton } from "react-bootstrap";

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
            <CloseButton className="close-modal" onClick={toggleModal}/>
          </div>
        </div>
      )}
    </>
  );
}
