import React, { useContext, useEffect, useRef, useState } from 'react'
import { Button, CloseButton, Form } from 'react-bootstrap'
import { Link } from "react-router-dom";
import { UserContext } from '../../App'
import { getFullName } from '../utils/GetFullName'
import DotTyping from '../utils/typing/DotTyping'
import { responseMessage } from './ResponseMessage'
import { messagesData as data} from './messagesData2'

const Chatbot2 = ({ setShowBot, showBot }) => {
    const { currentUserVal } = useContext(UserContext)
    const messageEndRef = useRef(null)
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState([])
    const [mszLoading, setMszLoading] = useState(false)
    
    const messagesData = [
        {
            key: 'initialResponse',
            response: 'Now you are main Page',
            keys: [['1', 'tickets'],['2','technical issue'], ['3', 'contact admin'], ['4', 'profile update'], ['5', 'feedback suggestions']],
            value: [<div><Button onClick={()=> handleClick('tickets')} className='btn btn-primary my-1'>1.Tickets</Button><br/>
            <Button onClick={()=> handleClick('technicalIssue')} className='btn btn-primary my-1'>2.Technical Issue</Button><br/>
            <Button onClick={()=> handleClick('contactAdmin')} className='btn btn-primary my-1'>3.Contact Admin</Button><br/>
            <Button onClick={()=> handleClick('profileUpdate')} className='btn btn-primary my-1'>4.Profile Update</Button><br/>
            <Button onClick={()=> handleClick('needHelpinTicketSolving')} className='btn btn-primary my-1'>5. Need help in Ticket Solving</Button><br/>
            <Button onClick={()=> handleClick('feedbackSuggestions')} className='btn btn-primary my-1'>6.Feedback/ Suggestions</Button></div>]
        },
        {
            key:'tickets',
            response: 'You selected Tickets',
            value: [<div>
                <Button onClick={()=> handleClick('todayTickets')} className='btn btn-primary my-1'>1. Today Tickets</Button><br/>
                <Button onClick={()=> handleClick('totalTickets')} className='btn btn-primary my-1'>2. Total Tickets</Button><br/>
                <Button onClick={()=> handleClick('ticketProgress')} className='btn btn-primary my-1'>3. Know Ticket Progress</Button><br/>
                <Button onClick={()=> handleClick('updateStatus')} className='btn btn-primary my-1'>4. Update Status</Button><br/>
                <Button onClick={()=> handleClick('initialResponse')} className='btn btn-warning my-1'> Back</Button><br/>
                </div>
            ]
        },{
            key: 'technicalIssue',
            response: "Select one option for technical assistance",
            value: [
                <div>
                    <Button onClick={()=> handleClick('ticketsUpdatingIssue')} className='btn btn-primary my-1'> Tickets updating Issue</Button><br/>
                    <Button onClick={()=> handleClick('sendMessagetoIT')} className='btn btn-primary my-1'> Send a message to IT team</Button><br/>
                    <Button onClick={()=> handleClick('initialResponse')} className='btn btn-warning my-1'> Back</Button><br/>
                </div>
            ]
        }, {
            key:'contactAdmin',
            response: 'For which purpose you want to contact admin',
            value: [
                <div>
                    <Button onClick={()=> handleClick('hrAdmin')} className='btn btn-primary my-1'> Contact HR Admin</Button><br/>
                    <Button onClick={()=> handleClick('manager')} className='btn btn-primary my-1'> Manager</Button><br/>
                    <Button onClick={()=> handleClick('initialResponse')} className='btn btn-warning my-1'> Back</Button><br/>
                </div>
            ]
        }, {
            key: 'profileUpdate',
            response: 'Select what do u want to update in ur profile?',
            value: [
                <div>
                    <Button onClick={()=> handleClick('emailUpdate')} className='btn btn-primary my-1'> Email</Button><br/>
                    <Button onClick={()=> handleClick('mobileUpdate')} className='btn btn-primary my-1'> Mobile</Button>
                    <div> If u want to update other details in ur profile u can update in ur profile page click here to go to <Link to='/login'>Profile Page</Link> </div>
                    <Button onClick={()=> handleClick('initialResponse')} className='btn btn-warning my-1'> Back</Button><br/>
                </div>
            ]
        }, {
            key:'feedbackSuggestions',
            response: 'Please submit the feedback/ suggestion',
            value:[
                <div>
                    <Form.Control as='textarea' rows={3} />
                    <Button onClick={()=> handleClick('feedbackResponse')}>Submit</Button>
                </div>
            ]
        }, {
            key:'feedbackResponse',
            response: 'Thank you for sharing your thoughts',
            value:[
                <Button onClick={()=> handleClick('initialResponse')} className='btn btn-warning my-1'>Back</Button>
            ]
        }, {
            key:'needHelpinTicketSolving',
            response: 'Select Technology',
            value: [
                <div>
                    <Button onClick={()=> handleClick('reactHelp')} className='btn btn-primary my-1'>React</Button><br/>
                    <Button onClick={()=> handleClick('reactHelp')} className='btn btn-primary my-1'>Angular</Button><br/>
                    <Button onClick={()=> handleClick('reactHelp')} className='btn btn-primary my-1'>CSS</Button><br/>
                    <Button onClick={()=> handleClick('initialResponse')} className='btn btn-warning my-1'>Back</Button>
                </div>
            ]
        }, {
            key: 'reactHelp',
            response: 'Select requirement',
            value:[
                <div>
                    <Button onClick={()=> handleClick('reactFunctionality')} className='btn btn-primary my-1'>Functionality</Button><br/>
                    <Button onClick={()=> handleClick('reactFunctionality')} className='btn btn-primary my-1'>Test Cases</Button><br/>
                    <Button onClick={()=> handleClick('needHelpinTicketSolving')} className='btn btn-warning my-1'>Back</Button>
                </div>
            ]
        }, {
            key:'reactFunctionality',
            response: 'Ok, You will get a response shortly from one of our developer',
            value:[
                <div>
                    <Button onClick={()=> handleClick('needHelpinTicketSolving')} className='btn btn-warning my-1'>Back</Button><br/>
                    <Button onClick={()=> handleClick('initialResponse')} className='btn btn-warning my-1'>Main Menu</Button>
                </div>
            ]
        }
    ]
    const [lastSystemMsz, setLastSystemMsz] = useState(messagesData[0])
    const addMessage = async () => {
        console.log('ADDMSZ', message, lastSystemMsz)
        // const reply = lastSystemMsz.find(val => val.keys.includes(message.toLowerCase()) && val)
        // console.log("ADDREPLY", reply)
        
    }
    const scrollToBottom = () => {
        messageEndRef.current?.scrollIntoView({ behaviour: 'smooth' })
    }
    const handleClick = (response) => {
        console.log(lastSystemMsz, response)
        const reply = messagesData.find(msz => msz.key == response)
        console.log('REPLY', reply)
        if (reply) {
            setLastSystemMsz(reply)
            setMessages((e) => [...e, mszFormatter(reply.response), mszFormatter(reply.value, 'right')])
        } else {
            setMessages((e)=> [...e, mszFormatter('ERROR')])
        }
    }
    useEffect(() => {
        scrollToBottom()
    }, [messages])
    useEffect(() => {
        let msz = `Hii ${currentUserVal?.fName ? getFullName(currentUserVal) : 'User'}, This is Hoyna, How may i help you?`
        const reply = messagesData.find(msz => msz.key == 'initialResponse')
        currentUserVal?.fName ? setMessages([mszFormatter(msz), mszFormatter(reply.value, 'right')]) : setMessages([mszFormatter(msz), mszFormatter('May I know ur name?')])
    }, [currentUserVal])
    return (
        <div id='chat-bot' className='chat-bot-main'>
            <span onClick={() => setShowBot(!showBot)} style={{ position: 'absolute', right: '10px', top: '5px' }}><CloseButton onClick={() => setShowBot(!showBot)} /></span>
            <div className='bot-header'>
                <h3>Resource One IT Solutions</h3>
                <p>We typically reply in few minutes.</p>
            </div>
            <div className='bot-body scrollbar-container'>
                {
                    messages.map((msz, idx) => {
                        return <div key={idx} className={msz.class} > {msz.value}</div>
                    })
                }
                {mszLoading && <DotTyping />}
                <div ref={messageEndRef}></div>
            </div>
            <div className='bot-footer d-flex gap-1 p-1' >
                <input list='keys' value={message} onChange={(e) => setMessage(e.target.value)} onKeyPress={(e) => e.key == 'Enter' && addMessage()} type='text' className='form-control' placeholder='Ask me...' />
                {/* <datalist id='keys'>
                    {
                        keys.map((val, idx)=> <option value={val} key={idx} />)
                    }
                </datalist> */}
                <Button onClick={addMessage}><i className='fas fa-arrow-right'></i></Button>
            </div>
        </div>
    )
}

export default Chatbot2

const mszFormatter = (value, cls = 'left') => {
    return { class: cls, value: value }
}