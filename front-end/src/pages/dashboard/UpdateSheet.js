import React from 'react'
import { useState } from 'react'
import { Table } from 'react-bootstrap'
import { Button } from 'react-bootstrap'
import Modal from '../../components/modal/Modal'
import { fetchCall } from '../../components/utils/fetch/UseFetch'

const UpdateSheet = ({ currentUserVal, todayTickets }) => {
    const [mailUpdateModalOpen, setMailUpdateModalOpen] = useState(false)
    const [mailObject, setMailObject] =  useState({
        email:'',
        subject:'',
        description:''
    })
    const handleChange = (e)=> {
        setMailObject({...mailObject, [e.target.name]: e.target.value})
    }
    const handleSend = ()=> {
        setMailUpdateModalOpen(!mailUpdateModalOpen); 
        
    }
    const handleMailSend =async ()=> {
        setMailUpdateModalOpen(false)
        mailObject.description = `<pre style="font-size:20px; font-family:none">${mailObject.description}</pre>`
        const {data, success} = await fetchCall('/api/clientupdatesend', mailObject)
        if (success) {
            console.log('MAIL UPDATE', data)
        }
    }
    return (
        <div>
            <h3>Update DataSheet</h3>
            <Table>
                <thead>
                    <tr>
                        <th>Sl. No</th>
                        <th>Consultant Name</th>
                        <th>Technology</th>
                        <th>Ticket Status</th>
                        <th>Description</th>
                        <th>Comments</th>
                        <th>Send Update</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        todayTickets.total.map((ticket, idx) => {
                            return <tr key={idx}>
                                <td>{idx + 1}</td>
                                <td>{ticket.consultantName}</td>
                                <td>{ticket.technology}</td>
                                <td>{ticket.status}</td>
                                <td>{ticket.description}</td>
                                <td>{ticket.comments}</td>
                                <td><Button onClick={handleSend}>Send Update</Button></td>
                            </tr>
                        })
                    }
                </tbody>
            </Table>
            <Modal isOpen={mailUpdateModalOpen} setModal={setMailUpdateModalOpen}>
                <div style={{width:'300px'}}>
                    <label>Email :</label>
                    <input className='form-control' name='email' value={mailObject.email} onChange={handleChange} placeholder='text' defaultValue={'naresh914421@gmail.com'} />
                    <label>Subject :</label>
                    <input className='form-control' name='subject' value={mailObject.subject} onChange={handleChange} placeholder='text' defaultValue={'Today Update'} />
                    <label>Description :</label>
                    <textarea rows={5} className='form-control' name='description' value={mailObject.description} onChange={handleChange} defaultValue={`hiii , how are you i m fine`}></textarea>
                    <Button onClick={handleMailSend}>Send</Button>
                </div>
            </Modal>
            <div style={{whiteSpace: 'pre-line'}} dangerouslySetInnerHTML={{__html: mailObject.description}}/>
        </div>
    )
}

export default UpdateSheet