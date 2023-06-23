import React, { useContext, useEffect, useRef, useState } from 'react'
import { Button, CloseButton, Form } from 'react-bootstrap'
import { Link } from "react-router-dom";
import { UserContext } from '../../App'
import { getFullName } from '../utils/GetFullName'
import DotTyping from '../utils/typing/DotTyping'
import { responseMessage } from './ResponseMessage'
import { messagesData as data } from './messagesData2'

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
            keys: [
                ['ticketsData', '1', 'tickets'],
                ['technicalIssue', '2', 'technical issue'],
                ['contactAdmin', '3', 'contact admin'],
                ['profileUpdate', '4', 'profile update'],
                ['needHelpinTicketSolving', '5', 'need help in ticket solving'],
                ['feedbackSuggestions', '6', 'feedback suggestions']],
            value: [<div><Button onClick={() => handleClick('ticketsData')} className='btn btn-primary my-1'>1.Tickets</Button><br />
                <Button onClick={() => handleClick('technicalIssue')} className='btn btn-primary my-1'>2.Technical Issue</Button><br />
                <Button onClick={() => handleClick('contactAdmin')} className='btn btn-primary my-1'>3.Contact Admin</Button><br />
                <Button onClick={() => handleClick('profileUpdate')} className='btn btn-primary my-1'>4.Profile Update</Button><br />
                <Button onClick={() => handleClick('needHelpinTicketSolving')} className='btn btn-primary my-1'>5. Need help in Ticket Solving</Button><br />
                <Button onClick={() => handleClick('feedbackSuggestions')} className='btn btn-primary my-1'>6.Feedback/ Suggestions</Button></div>]
        },
        {
            key: 'ticketsData',
            response: 'You selected Tickets',
            keys: [['todayTickets', '1', 'today tickets'], ["totalTickets", "2", "total tickets"], ["ticketProgress", '3', 'know ticket progress'], ["updateStatus", "4", "update status"]],
            value: [<div>
                <Button onClick={() => handleClick('todayTickets')} className='btn btn-primary my-1'>1. Today Tickets</Button><br />
                <Button onClick={() => handleClick('totalTickets')} className='btn btn-primary my-1'>2. Total Tickets</Button><br />
                <Button onClick={() => handleClick('ticketProgress')} className='btn btn-primary my-1'>3. Know Ticket Progress</Button><br />
                <Button onClick={() => handleClick('updateStatus')} className='btn btn-primary my-1'>4. Update Status</Button><br />
                <Button onClick={() => handleClick('initialResponse')} className='btn btn-warning my-1'> Back</Button><br />
            </div>
            ]
        }, {
            key: 'technicalIssue',
            response: "Select one option for technical assistance",
            keys: [["ticketsUpdatingIssue", "1", "ticket updating issue"], ["sendMessagetoIT", "2", "send a message to it team"]],
            value: [
                <div>
                    <Button onClick={() => handleClick('ticketsUpdatingIssue')} className='btn btn-primary my-1'>1. Tickets updating Issue</Button><br />
                    <Button onClick={() => handleClick('sendMessagetoIT')} className='btn btn-primary my-1'>2. Send a message to IT team</Button><br />
                    <Button onClick={() => handleClick('initialResponse')} className='btn btn-warning my-1'> Back</Button><br />
                </div>
            ]
        }, {
            key: 'contactAdmin',
            response: 'For which purpose you want to contact admin',
            keys: [["hrAdmin", "1", "contact hr admin"], ["manager", "2",]],
            value: [
                <div>
                    <Button onClick={() => handleClick('hrAdmin')} className='btn btn-primary my-1'>1. Contact HR Admin</Button><br />
                    <Button onClick={() => handleClick('manager')} className='btn btn-primary my-1'>2. Manager</Button><br />
                    <Button onClick={() => handleClick('initialResponse')} className='btn btn-warning my-1'> Back</Button><br />
                </div>
            ]
        }, {
            key: 'profileUpdate',
            response: 'Select what do u want to update in ur profile?',
            keys: [["emailupdate", "1", "email"], ["mobileUpdate", "2", "mobile"]],
            value: [
                <div>
                    <Button onClick={() => handleClick('emailUpdate')} className='btn btn-primary my-1'>1. Email</Button><br />
                    <Button onClick={() => handleClick('mobileUpdate')} className='btn btn-primary my-1'>2. Mobile</Button>
                    <div> If u want to update other details in ur profile u can update in ur profile page click here to go to <Link to='/login'>Profile Page</Link> </div>
                    <Button onClick={() => handleClick('initialResponse')} className='btn btn-warning my-1'> Back</Button><br />
                </div>
            ]
        }, {
            key: 'feedbackSuggestions',
            response: 'Please submit the feedback/ suggestion',
            keys: [["feedbackResponse", "submit"]],
            value: [
                <div>
                    <Form.Control as='textarea' rows={3} />
                    <Button onClick={() => handleClick('feedbackResponse')}>Submit</Button>
                </div>
            ]
        }, {
            key: 'feedbackResponse',
            response: 'Thank you for sharing your thoughts',
            value: [
                <Button onClick={() => handleClick('initialResponse')} className='btn btn-warning my-1'>Back</Button>
            ]
        }, {
            key: 'needHelpinTicketSolving',
            response: 'Select Technology',
            keys: [["reactHelp", "1", "react", "2", 'angular', "3", 'css']],
            value: [
                <div>
                    <Button onClick={() => handleClick('reactHelp')} className='btn btn-primary my-1'>1. React</Button><br />
                    <Button onClick={() => handleClick('reactHelp')} className='btn btn-primary my-1'>2. Angular</Button><br />
                    <Button onClick={() => handleClick('reactHelp')} className='btn btn-primary my-1'>3. CSS</Button><br />
                    <Button onClick={() => handleClick('initialResponse')} className='btn btn-warning my-1'>Back</Button>
                </div>
            ]
        }, {
            key: 'reactHelp',
            response: 'Select requirement',
            keys: [["reactFunctionality", "1", "functionality", "2", "test cases"]],
            value: [
                <div>
                    <Button onClick={() => handleClick('reactFunctionality')} className='btn btn-primary my-1'>Functionality</Button><br />
                    <Button onClick={() => handleClick('reactFunctionality')} className='btn btn-primary my-1'>Test Cases</Button><br />
                    <Button onClick={() => handleClick('needHelpinTicketSolving')} className='btn btn-warning my-1'>Back</Button>
                </div>
            ]
        }, {
            key: 'reactFunctionality',
            response: 'Ok, You will get a response shortly from one of our developer',
            value: [
                <div>
                    <Button onClick={() => handleClick('needHelpinTicketSolving')} className='btn btn-warning my-1'>Back</Button><br />
                    <Button onClick={() => handleClick('initialResponse')} className='btn btn-warning my-1'>Main Menu</Button>
                </div>
            ]
        }
    ]
    const [lastSystemMsz, setLastSystemMsz] = useState(messagesData[0])

    const scrollToBottom = () => {
        messageEndRef.current?.scrollIntoView({ behaviour: 'smooth' })
    }
    const handleClick = (response) => {
        setMszLoading(true)
        const reply = messagesData.find(msz => msz.key == response)
        if (reply) {
            setMessage('')
            setTimeout(()=> {
                setMszLoading(false)
            },500)
            setLastSystemMsz(reply)
            setMessages((e) => [...e, mszFormatter(reply.response), mszFormatter(reply.value, 'right')])
        } else {
            setMessages((e) => [...e, mszFormatter('ERROR')])
            setMszLoading(false)
        }
    }
    const addMessage = async () => {
        const reply = lastSystemMsz.keys.find(val => val.includes(message.toLowerCase()) && val)
        if (reply) {
            handleClick(reply[0])
        } else {
            setMessages((e) => [...e, mszFormatter('Not Found')])
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