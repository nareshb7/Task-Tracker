import React from 'react'
import Modal from './Modal'
import { Button, Col, Row } from 'react-bootstrap'

const AssignTicketModal = ({ modelOpen, setModelOpen, selectedTicket, selectedDev, employeesdata, assignTicket, cancelTicket, setSelectedDev }) => {
    return (
        <Modal isOpen={modelOpen} setModal={setModelOpen}>
            <Row>
                <Col style={{ width: "300px" }} >
                    <div>
                        <span className='fs-4 fw-bold'>Consultant :</span>
                        <span className='fs-4 fst-italic'> {selectedTicket.consultantName}</span>
                    </div>
                    <div>
                        <span className='fs-4 fw-bold'> Technology:</span>
                        <span className='fs-4 fst-italic'> {selectedTicket.technology}</span>
                    </div>
                    <div>
                        <span className='fs-4 fw-bold'>Select Developer: </span>
                        <select className='form-control fst-italic' value={selectedDev} onChange={(e) => setSelectedDev(JSON.parse(e.target.value))}>
                            {
                                [{ fName: 'Select Developer', lName: '' }, ...employeesdata.employees].map((val, idx) => {
                                    const name = `${val?.fName} ${val?.lName}`
                                    return <option key={idx + Math.random()} value={JSON.stringify({ _id: val?._id, name })}> {name}</option>
                                })
                            }
                        </select>
                    </div>
                    <div className='d-flex justify-content-around my-2'>
                        <Button onClick={assignTicket}>Assign</Button>
                        <Button onClick={cancelTicket} variant='warning'>Cancel</Button>
                    </div>
                </Col>
            </Row>
        </Modal>
    )
}

export default AssignTicketModal