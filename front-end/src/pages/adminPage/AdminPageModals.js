import React, { memo } from 'react'
import { useNavigate } from 'react-router-dom'
import UserIssues from '../../components/issues/UserIssues'
import { Button, Col, Row } from 'react-bootstrap'
import { getFullName } from '../../components/utils/GetFullName'
import { lastSeenTimeFormat } from '../chatBox/MessageBox'
import Modal from '../../components/modal/Modal'

export const UserUpdateModel = memo(({ openUpdateModal, setOpenUpdateModal, requestAcceptFunc, handleRoleChange, userLoginPermission, updateUserObj }) => {
    return <Modal isOpen={openUpdateModal} setModal={setOpenUpdateModal}>
        <>
            <h3>Update the user</h3>
            <Row className='d-flex flex-column'>
                <Col>
                    <span className='fw-bold fs-3'>Admin Access : </span>
                    <Button onClick={() => requestAcceptFunc(updateUserObj._id, true)} > Allow </Button>
                    <Button variant='warning' onClick={() => requestAcceptFunc(updateUserObj._id, false, 'isAdmin')} >Deny</Button>
                </Col>
                <Col>
                    <span className='fw-bold fs-3'>Login Access : </span>
                    <Button onClick={() => userLoginPermission(updateUserObj, true)} > Allow </Button>
                    <Button variant='warning' onClick={() => userLoginPermission(updateUserObj, false)}>Deny</Button>
                </Col>
                <Col>
                    <span className='fw-bold fs-3 '>Update Role:</span>
                    <select className='form-control' onChange={handleRoleChange}>
                        <option>Select Role</option>
                        <option value='UI Developer'>UI Developer</option>
                        <option value='ReactJS Developer'>ReactJS Developer</option>
                        <option value='Angular Developer'>Angular Developer</option>
                        <option value='UI/UX Developer'>UI/UX Designer</option>
                    </select>
                </Col>
            </Row>
        </>
    </Modal>
})

export const EmployeeDataModal = memo(({ showEmpModal, setShowEmpModal, showEmpData }) => {
    const navigate = useNavigate()
    return <Modal isOpen={showEmpModal} setModal={setShowEmpModal}>
        <div style={{ display: 'flex' }}>
            <div>
                <h3>Name : {getFullName(showEmpData)}</h3>
                <h3>Email: {showEmpData.email}</h3>
                <h3>Mobile : {showEmpData.mobile}</h3>
                {
                    showEmpData.status === 'Online' ? <h3>Status : Online</h3> :
                        <h3>Last Active On : {lastSeenTimeFormat(showEmpData.lastActiveOn)}</h3>
                }
                <h3>Active User : {showEmpData.isActive ? "Yes" : 'No'}</h3>
                <h3>Admin : {showEmpData.isAdmin ? "Yes" : "No"}</h3>
                <h3>Joined Date : {showEmpData.joinedDate ? new Date(showEmpData.joinedDate).toLocaleString() : 'No Data Found'}</h3>
                <h3>Uploaded Issues :{showEmpData.uploadedIssues?.length ? `${showEmpData.uploadedIssues.length}` : 'counting....'}</h3>
                <h3>Technologies : {showEmpData.technologies?.length ? `${showEmpData.technologies}` : "Loading...."}</h3>
                <div>
                    <Button onClick={() => {
                        setShowEmpModal(!showEmpModal)
                        setTimeout(() => {
                            navigate('/empstats', { state: showEmpData })
                        }, 0)
                    }}>
                        Go to Stats page
                    </Button>
                    <Button className='mx-2' onClick={() => navigate('/chat', { state: showEmpData })}>Send Message</Button>
                </div>
            </div>
            <div style={{ width: '100px', height: '100px' }}>
                <img src={showEmpData.binaryData} style={{ width: '100%', height: '100%' }} />
            </div>
        </div>
    </Modal>
})

export const MailChangeModal = memo(({ mailChangeModal, setMailChangeModal, mailChangeAcceptFunc, mailChangeReqIDs }) => {
    return <Modal isOpen={mailChangeModal} setModal={setMailChangeModal}>
        <>
            <h2>Profile Update Requests</h2>
            {
                mailChangeReqIDs.length ? <>
                    {
                        mailChangeReqIDs.map((user, idx) => {
                            return (
                                <li key={idx} className='li-style'>
                                    <div>
                                        {user.fName && <h3>{getFullName(user)} - {user.email} </h3>}
                                        {user.updateData && <h3><span>Update Data: </span> <span>{user.updateData.updateKey}</span> - <span>{user.updateData.updateValue}</span></h3>}
                                    </div>
                                    <div>
                                        <Button onClick={() => mailChangeAcceptFunc(user._id, true)}>Approve</Button>
                                        <Button onClick={() => mailChangeAcceptFunc(user._id, false)}>Deny</Button>
                                    </div>
                                </li>
                            )
                        })
                    }
                </> : <h4>No Requests</h4>
            }
        </>

    </Modal>
})
export const ShowTicketsModal = memo(({ showTicketsModal, setShowTicketsModal, issuesList }) => {
    return <Modal isOpen={showTicketsModal} setModal={setShowTicketsModal}>
        <div style={{ marginBlock: '20px', height: '300px', overflowY: 'scroll' }}>
            {
                issuesList.length > 0 ? (
                    <UserIssues issuesList={issuesList} />
                ) : (
                    <h3>No Solutions Added</h3>
                )
            }
        </div>
    </Modal>
})

const AdminPageModals = memo((props) => {
    const {
        requestAcceptFunc,
        isModalOpen,
        setIsModalOpen,
        adminReqData,
    } = props
    return <Modal isOpen={isModalOpen} setModal={setIsModalOpen} >
        <>
            <h2>Admin Access Requests</h2>
            {
                adminReqData.length ? <>
                    {
                        adminReqData.map((user, idx) => {
                            return (
                                <li key={idx} className='li-style'>
                                    <div>
                                        {user.fName && <h3>{getFullName(user)} - {user.email} </h3>}
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
    </Modal>
})

export default AdminPageModals