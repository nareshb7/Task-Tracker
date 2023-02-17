import React, { useState } from "react";
import "./Modal.css";

export default function Modal({isOpen, setModal, header, data, requestAcceptFunc}) {
//   const [modal, setModal] = useState(false);

  const toggleModal = () => {
    setModal(!isOpen);
  };

  if(isOpen) {
    document.body.classList.add('active-modal')
  } else {
    document.body.classList.remove('active-modal')
  }

  return (
    <>
      {isOpen && (
        <div className="modal">
          <div onClick={toggleModal} className="overlay"></div>
          <div className="modal-content">
            <h2>{header}</h2>
            {
                data.map((user,idx)=> {
                    return (
                        <li key={idx} className='li-style'><h3>{user.fName} - {user.email} </h3><span ><button onClick={()=> requestAcceptFunc( user._id, true)}>Approve</button> <button onClick={()=> requestAcceptFunc(user._id, false)}>Deny</button></span> </li>
                    )
                })
            }
            <button className="close-modal" onClick={toggleModal}>
              CLOSE
            </button>
          </div>
        </div>
      )}
    </>
  );
}
