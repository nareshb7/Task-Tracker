import React from "react";
import "./Modal.css";

export default function Modal({ isOpen, setModal, header, data, requestAcceptFunc, employee }) {
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
        <div className="modal">
          <div onClick={toggleModal} className="overlay"></div>
          <div className="modal-content">
            <h2>{header}</h2>
            {
              data && <>
                {
                  data.length ? <>
                    {
                      data.map((user, idx) => {
                        return (
                          <li key={idx} className='li-style'>
                            <div>
                            {
                              user.fName && <h3>{user.fName+" "+ user.lName} - {user.email} </h3>
                            }
                            {
                              user.updateData && <h3><span>Update Data: </span> <span>{user.updateData.updateKey}</span> - <span>{user.updateData.updateValue}</span></h3>
                            }
                            </div>
                            <div>
                              <button onClick={() => requestAcceptFunc(user._id, true)}>Approve</button>
                              <button onClick={() => requestAcceptFunc(user._id, false)}>Deny</button>
                            </div>
                          </li>
                        )
                      })
                    }
                  </> : <h4>No Requests</h4>
                }
              </>
            }

            {
              employee && employee.hasOwnProperty('mobile') && <div style={{ display: 'flex' }}>
                <div>
                  <h3>Name : {employee.fName +" "+ employee.lName}</h3>
                  <h3>Email: {employee.email}</h3>
                  <h3>Mobile : {employee.mobile}</h3>
                  <h3>Active User : {employee.isActive ? "Yes" : 'No'}</h3>
                  <h3>Admin : {employee.isAdmin ? "Yes" : "No"}</h3>
                  <h3>Joined Date : {employee.joinedDate ? new Date(employee.joinedDate).toLocaleString() : 'No Data Found'}</h3>
                  <h3>Uploaded Issues :{employee.uploadedIssues.length ? `${employee.uploadedIssues.length}` : 'counting....'}</h3>
                  <h3>Technologies : {employee.technologies.length ? `${employee.technologies}` : "Loading...."}</h3>
                </div>
                <div style={{ width: '100px', height: '100px' }}>
                  <img src={employee.binaryData} style={{ width: '100%', height: '100%' }} alt='User'/>
                </div>
              </div>
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
