import React, { useContext, useEffect, useRef, useState } from 'react'
import { Button, CloseButton, Form } from 'react-bootstrap'
import { Link } from "react-router-dom";
import { UserContext } from '../../App'
import { getFullName } from '../utils/GetFullName'
import DotTyping from '../utils/typing/DotTyping'
import { responseMessage } from './ResponseMessage'
import { messagesData as data } from './messagesData2'
import { uploadedIssues } from '../issues/UserIssues';
import { getTodayTicketsFunc } from '../../pages/dashboard/UserDashboard';
import { CHAT_BOT_ERROR_MESSAGE } from '../utils/Constants';
import { fetchCall } from '../utils/fetch/UseFetch';

const Chatbot2 = ({ setShowBot, showBot }) => {
    const { currentUserVal, socket } = useContext(UserContext)
    const messageEndRef = useRef(null)
    const [message, setMessage] = useState('')
    const [messages, setMessages] = useState([])
    const [mszTyping, setMszTyping] = useState(false)
    const [chatBotSubmitMessage,setChatBotSubmitMessage] = useState('')

    const getTodayTickets = async (id) => {
        const res = await getTodayTicketsFunc(id)
        if (res.success) {
            const names = res.data.map(tkt => tkt.consultantName).join(', ')
            const status = res.data.map(tkt => tkt.status).join(", ")
            const msz = <div>
                Your today tickets are {res.data.length} , those are {names} and these tickets are in {status} state.
            </div>
            setMessages(e=> [...e,  mszFormatter(msz)])
        } else setMessages(e=> [...e,  mszFormatter(CHAT_BOT_ERROR_MESSAGE)])
        return 
    }
    const getTotalTickets =async (id)=> {
        const res = await uploadedIssues(id)
        if (Array.isArray(res)) {
            const names = [...new Set(res.map(tkt => tkt.cName))].join(", ")
            const msz = <div>
                Your total tickets are {res.length}, those are {names}
            </div>
            setMessages(e=> [...e,  mszFormatter(msz)])
        } else setMessages(e=> [...e,  mszFormatter(CHAT_BOT_ERROR_MESSAGE)])
    }
    const chatBotRequests=async (request)=> {
        const resp = await fetchCall('/api/botRequest', {request})
        console.log('BOT-REQUEST', request, resp)
        socket.emit('new-bot-request', request)
    }
    const handleChange = (e)=> {
        const newValue = e.target.value;
        setChatBotSubmitMessage(newValue);
    }
    const createBotObject = (type, msz) => {
        return {
            user: {name: getFullName(currentUserVal), id: currentUserVal._id},
            type, 
            description: msz
        }
    }

    const messagesData = [
        {
            key: 'initialResponse',
            response: 'Now you are in main Page',
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
                <Button onClick={() => handleClick('todayTickets', ()=> getTodayTickets(currentUserVal._id))} className='btn btn-primary my-1'>1. Today Tickets</Button><br />
                <Button onClick={() => handleClick('totalTickets', ()=> getTotalTickets(currentUserVal._id))} className='btn btn-primary my-1'>2. Total Tickets</Button><br />
                <Button onClick={() => handleClick('ticketProgress')} className='btn btn-primary my-1'>3. Know Ticket Progress</Button><br />
                <Button onClick={() => handleClick('updateStatus')} className='btn btn-primary my-1'>4. Update Status</Button><br />
                <Button onClick={() => handleClick('initialResponse')} className='btn btn-warning my-1'> Back</Button><br />
            </div>
            ],
            nextStep: {
                key: 'todayTickets',
                response:'Your Today Tickets is counting...',
                value: [
                    <div>
                        <Button onClick={() => handleClick('ticketsData')} className='btn btn-warning my-1'> Back</Button>        
                    </div>
                ]
            }
        , }, {
            key:'todayTickets',
            response:['Your Today Tickets are fetching....'],
            value: [
                <div>
                    <Button onClick={() => handleClick('ticketsData')} className='btn btn-warning my-1'> Back</Button>        
                </div>
            ],
        }, {
            key:'totalTickets',
            response:['Your Total Tickets are fetching....'],
            value: [
                <div>
                    <Button onClick={() => handleClick('ticketsData')} className='btn btn-warning my-1'> Back</Button>        
                </div>
            ],
        },{
            key: 'technicalIssue',
            response: "Select one option for technical assistance",
            keys: [["ticketsUpdatingIssue", "1", "ticket updating issue"], ["sendMessagetoIT", "2", "send a message to it team"]],
            value: [
                <div>
                    <Button onClick={() => handleClick('ticketsUpdatingIssue')} className='btn btn-primary my-1'>1. Tickets updating Issue</Button><br />
                    <Button onClick={() => handleClick('sendaMessagetoIT')} className='btn btn-primary my-1'>2. Send a message to IT team</Button><br />
                    <Button onClick={() => handleClick('initialResponse')} className='btn btn-warning my-1'> Back</Button><br />
                </div>
            ]
        },{
            key: 'ticketsUpdatingIssue',
            response: <div>What issue u r facing??? <br/> Type below</div>,
            keys: [["ticketUpdatingIssueSubmitted", "1", "submit"]],
            value: [
                <div>
                    <Form.Control onChange={handleChange} defaultValue={chatBotSubmitMessage} as='textarea' rows={3} />
                    <Button onClick={() => handleClick('ticketUpdatingIssueSubmitted', (msz) => chatBotRequests(createBotObject('TicketUpdating', msz)), chatBotSubmitMessage)} className='btn btn-warning my-1'> Submit</Button><br />
                </div>
            ]
        }, {
            key: 'ticketUpdatingIssueSubmitted',
            response: <div>Okey, we will work on this issue and we will give u update within an hour</div>,
            value: [
                <div>
                    <Button onClick={() => handleClick('technicalIssue')} className='btn btn-warning my-1'> Back</Button><br />
                </div>
            ]
        }, {
            key: 'sendaMessagetoIT',
            response: <div>Type message here</div>,
            keys: [["sentMessagetoIT", "1", "submit"]],
            value: [
                <div>
                    <Form.Control onChange={handleChange} as='textarea' rows={3} />
                    <Button onClick={() => handleClick('sentMessagetoIT', (msz) => chatBotRequests(createBotObject('IT Team Message', msz)))} className='btn btn-warning my-1'> Submit</Button><br />
                </div>
            ]
        }, {
            key: 'sentMessagetoIT',
            response: <div>Okey, One of our IT person will contact you shortly, Thank you!</div>,
            value: [
                <div>
                    <Button onClick={() => handleClick('technicalIssue')} className='btn btn-warning my-1'> Back</Button><br />
                </div>
            ]
        }, {
            key: 'contactAdmin',
            response: 'For which purpose you want to contact admin',
            keys: [["hrAdmin", "1", "contact hr admin"], ["contactManager", "2",'manager']],
            value: [
                <div>
                    <Button onClick={() => handleClick('hrAdmin')} className='btn btn-primary my-1'>1. Contact HR Admin</Button><br />
                    <Button onClick={() => handleClick('contactManager')} className='btn btn-primary my-1'>2. Manager</Button><br />
                    <Button onClick={() => handleClick('initialResponse')} className='btn btn-warning my-1'> Back</Button><br />
                </div>
            ]
        }, {
            key: 'hrAdmin',
            response: <div>Why do you want contact HR Admin??</div>,
            keys: [["hrAdminForLeave", "1", "leave"], ["hrAdminForSalary", "2",'salary'],["hrAdminForOther", "3",'other']],
            value: [
                <div>
                    <Button onClick={() => handleClick('hrAdminForLeave')} className='btn btn-primary my-1'>1. For Leave</Button><br />
                    <Button onClick={() => handleClick('hrAdminForSalary')} className='btn btn-primary my-1'>2. Salary Issues</Button><br />
                    <Button onClick={() => handleClick('hrAdminForOther')} className='btn btn-primary my-1'>3. Other</Button><br />
                    <Button onClick={() => handleClick('contactAdmin')} className='btn btn-warning my-1'> Back</Button><br />
                </div>
            ]
        }, {
            key: 'hrAdminForLeave',
            response: <div>Type a message here for leave</div>,
            keys: [["hrAdminForLeaveSubmitted", "1", "leave"], ["hrAdminForSalary", "2",'salary'],["hrAdminForOther", "3",'other']],
            value: [
                <div>
                    <Form.Control onChange={handleChange} as='textarea' rows={3} />
                    <Button onClick={() => handleClick('hrAdminForLeaveSubmitted', (msz) => chatBotRequests(createBotObject('Leave Request', msz)))} className='btn btn-primary my-1'>Submit</Button><br />
                    <Button onClick={() => handleClick('hrAdmin')} className='btn btn-warning my-1'> Back</Button><br />
                </div>
            ]
        },  {
            key: 'hrAdminForLeaveSubmitted',
            response: <div>Thank You, you will get a response after going through ur message</div>,
            value: [
                <div>
                    <Button onClick={() => handleClick('hrAdmin')} className='btn btn-warning my-1'> Back</Button><br />
                </div>
            ]
        }, {
            key: 'hrAdminForSalary',
            response: <div>What's issue mention here </div>,
            keys: [["hrAdminForSalarySubmitted", "1", "leave"], ["hrAdminForSalary", "2",'salary'],["hrAdminForOther", "3",'other']],
            value: [
                <div>
                    <Form.Control onChange={handleChange} as='textarea' rows={3} />
                    <Button onClick={() => handleClick('hrAdminForSalarySubmitted', (msz) => chatBotRequests(createBotObject('Salary Issue', msz)))} className='btn btn-primary my-1'>Submit</Button><br />
                    <Button onClick={() => handleClick('hrAdmin')} className='btn btn-warning my-1'> Back</Button><br />
                </div>
            ]
        }, {
            key: 'hrAdminForSalarySubmitted',
            response: <div>We will look into your salary issue and we will get back to you shortly with a positive response </div>,
            value: [
                <div>
                    <Button onClick={() => handleClick('hrAdmin')} className='btn btn-warning my-1'> Back</Button><br />
                </div>
            ]
        }, {
            key: 'hrAdminForOther',
            response: <div>What do you want to know from HR team?</div>,
            keys: [["hrAdminForOtherSubmitted", '1', 'submit']],
            value: [
                <div>
                    <Form.Control onChange={handleChange} as='textarea' rows={3} />
                    <Button onClick={() => handleClick('hrAdminForOtherSubmitted', (msz) => chatBotRequests(createBotObject('Other Query HR Team', msz)))} className='btn btn-primary my-1'>Submit</Button><br />
                    <Button onClick={() => handleClick('hrAdmin')} className='btn btn-warning my-1'> Back</Button><br />
                </div>
            ]
        }, {
            key: 'hrAdminForOtherSubmitted',
            response: <div>Okey, we will look into this one. </div>,
            value: [
                <div>
                    <Button onClick={() => handleClick('hrAdmin')} className='btn btn-warning my-1'> Back</Button><br />
                </div>
            ]
        }, {
            key: 'contactManager',
            response: <div>Send a Message to ur manager</div>,
            keys: [["contactManagerMszSubmitted", '1', 'submit']],
            value: [
                <div>
                    <Form.Control onChange={handleChange} as='textarea' rows={3} />
                    <Button onClick={() => handleClick('contactManagerMszSubmitted', (msz) => chatBotRequests(createBotObject('Manager Message', msz)))} className='btn btn-primary my-1'>Submit</Button><br />
                    <Button onClick={() => handleClick('hrAdmin')} className='btn btn-warning my-1'> Back</Button><br />
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
                    <div> If u want to update other details in ur profile u can update in ur profile page, click here to go to <Link to='/login'>Profile Page</Link> </div>
                    <Button onClick={() => handleClick('initialResponse')} className='btn btn-warning my-1'> Back</Button><br />
                </div>
            ]
        }, {
            key: 'mobileUpdate',
            response: 'Provide your new mobile number',
            keys: [["mobileUpdateSubmitted", "1", "submit"]],
            value: [
                <div>
                    <Form.Control onChange={handleChange}/>
                    <Button onClick={() => handleClick('mobileUpdateSubmitted', (msz) => chatBotRequests(createBotObject('Mobile number Update', msz)))} className='btn btn-primary my-1'>Submit</Button><br />
                    <Button onClick={() => handleClick('profileUpdate')} className='btn btn-warning my-1'> Back</Button><br />
                </div>
            ]
        }, {
            key: 'emailUpdate',
            response: 'Provide your mail id',
            keys: [["emailUpdateSubmitted", "1", "submit"]],
            value: [
                <div>
                    <Form.Control onChange={handleChange}/>
                    <Button onClick={() => handleClick('emailUpdateSubmitted', (msz) => chatBotRequests(createBotObject('Email Update', msz)))} className='btn btn-primary my-1'>Submit</Button><br />
                    <Button onClick={() => handleClick('profileUpdate')} className='btn btn-warning my-1'> Back</Button><br />
                </div>
            ]
        }, {
            key: 'feedbackSuggestions',
            response: 'Please submit the feedback/ suggestion',
            keys: [["feedbackResponse", "submit"]],
            value: [
                <div>
                    <Form.Control onChange={handleChange} as='textarea' rows={3} />
                    <Button onClick={() => handleClick('feedbackResponse', (msz) => chatBotRequests(createBotObject('Feedback/Suggestion', msz)))}>Submit</Button>
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
            keys: [["reactHelp", "1", "react"],['angularHelp', '2', 'angular'], ['cssHelp', '3', 'css']],
            value: [
                <div>
                    <Button onClick={() => handleClick('reactHelp')} className='btn btn-primary my-1'>1. React</Button><br />
                    <Button onClick={() => handleClick('angularHelp')} className='btn btn-primary my-1'>2. Angular</Button><br />
                    <Button onClick={() => handleClick('cssHelp', () => chatBotRequests(createBotObject('CSS Help', 'Required')))} className='btn btn-primary my-1'>3. CSS</Button><br />
                    <Button onClick={() => handleClick('initialResponse')} className='btn btn-warning my-1'>Back</Button>
                </div>
            ]
        }, {
            key: 'reactHelp',
            response: 'Select requirement',
            keys: [["reactFunctionality", "1", "functionality"], ['reactTestCases',"2", "test cases"]],
            value: [
                <div>
                    <Button onClick={() => handleClick('reactFunctionality', () => chatBotRequests(createBotObject('React Help', 'Needs Help in rect functionality')))} className='btn btn-primary my-1'>Functionality</Button><br />
                    <Button onClick={() => handleClick('reactTestCases', () => chatBotRequests(createBotObject('React Help', 'Needs help in React TestCases')))} className='btn btn-primary my-1'>Test Cases</Button><br />
                    <Button onClick={() => handleClick('needHelpinTicketSolving')} className='btn btn-warning my-1'>Back</Button>
                </div>
            ]
        }, {
            key: 'reactFunctionality',
            response: 'Ok, You will get a response shortly from one of our React developer',
            value: [
                <div>
                    <Button onClick={() => handleClick('needHelpinTicketSolving')} className='btn btn-warning my-1'>Back</Button><br />
                    <Button onClick={() => handleClick('initialResponse')} className='btn btn-warning my-1'>Main Menu</Button>
                </div>
            ]
        },{
            key:'reactTestCases',
            response: 'Ok, You will get a response shortly from one of our React developer for TestCases',
            value: [
                <div>
                    <Button onClick={() => handleClick('needHelpinTicketSolving')} className='btn btn-warning my-1'>Back</Button><br />
                    <Button onClick={() => handleClick('initialResponse')} className='btn btn-warning my-1'>Main Menu</Button>
                </div>
            ]
        }, {
            key: 'angularHelp',
            response: 'Select requirement',
            keys: [["angularFunctionality", "1", "functionality"], ['angularTestCases',"2", "test cases"]],
            value: [
                <div>
                    <Button onClick={() => handleClick('angularFunctionality', () => chatBotRequests(createBotObject('Angular Help', 'Needs help for Angular Functionality')))} className='btn btn-primary my-1'>Functionality</Button><br />
                    <Button onClick={() => handleClick('angularTestCases', () => chatBotRequests(createBotObject('Angular Help', 'Needs help for Angular TestCases')))} className='btn btn-primary my-1'>Test Cases</Button><br />
                    <Button onClick={() => handleClick('needHelpinTicketSolving')} className='btn btn-warning my-1'>Back</Button>
                </div>
            ]
        }, {
            key: 'angularFunctionality',
            response: 'Ok, You will get a response shortly from one of our Angular developer',
            value: [
                <div>
                    <Button onClick={() => handleClick('needHelpinTicketSolving')} className='btn btn-warning my-1'>Back</Button><br />
                    <Button onClick={() => handleClick('initialResponse')} className='btn btn-warning my-1'>Main Menu</Button>
                </div>
            ]
        },{
            key:'angularTestCases',
            response: 'Ok, You will get a response shortly from one of our Angular developer for TestCases',
            value: [
                <div>
                    <Button onClick={() => handleClick('needHelpinTicketSolving')} className='btn btn-warning my-1'>Back</Button><br />
                    <Button onClick={() => handleClick('initialResponse')} className='btn btn-warning my-1'>Main Menu</Button>
                </div>
            ]
        }, {
            key: 'cssHelp',
            response: 'Ok, You will get a response shortly from one of our UI/UX Designer',
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
    const getMessage =async ()=> {
        let msz = ''
        await setChatBotSubmitMessage((e)=> msz = e);
        return msz
    }
    const handleClick =async (response, cb) => {
        if (cb) cb(await getMessage()) 
        setMszTyping(true)
        const reply = messagesData.find(msz => msz.key == response)
        if (reply) {
            setMessage('')
            setTimeout(() => {
                setMszTyping(false)
            }, 500)
            setLastSystemMsz(reply)
            setMessages((e) => [...e, mszFormatter(reply.response), mszFormatter(reply.value, 'right')])
        } else {
            setMessages((e) => [...e, mszFormatter('ERROR')])
            setMszTyping(false)
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
                {mszTyping && <DotTyping />}
                <div ref={messageEndRef}></div>
            </div>
            <div className='bot-footer d-flex gap-1 p-1' >
                <input
                    value={message}
                    type='text'
                    className='form-control'
                    placeholder='Ask me...'
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key == 'Enter' && addMessage()}
                />
                <Button onClick={addMessage}><i className='fas fa-arrow-right'></i></Button>
            </div>
        </div>
    )
}

export default Chatbot2

const mszFormatter = (value, cls = 'left') => {
    return { class: cls, value: value }
}