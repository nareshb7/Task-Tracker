    import { Button, Form } from "react-bootstrap";
    import { Link } from "react-router-dom";

const handleClick =(msz)=> {
    console.log('MESSAGE', msz)
}

export const messagesData = [
    {
        key: 'initialResponse',
        response: '',
        value: [<div><Button onClick={()=> handleClick('tickets')} className='btn btn-primary my-1'>1.Tickets</Button><br/>
        <Button onClick={()=> handleClick('technicalIssue')} className='btn btn-primary my-1'>2.Technical Issue</Button><br/>
        <Button onClick={()=> handleClick('contactAdmin')} className='btn btn-primary my-1'>3.Contact Admin</Button><br/>
        <Button onClick={()=> handleClick('profileUpdate')} className='btn btn-primary my-1'>4.Profile Update</Button><br/>
        <Button onClick={()=> handleClick('feedbackSuggestions')} className='btn btn-primary my-1'>5.Feedback/ Suggestions</Button></div>]
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
        VALUE:[
            <div>
                <Button onClick={()=> handleClick('emailUpdate')} className='btn btn-primary my-1'> Email</Button><br/>
                <Button onClick={()=> handleClick('mobileUpdate')} className='btn btn-primary my-1'> Mobile</Button><br/>
                <Button onClick={()=> handleClick('initialResponse')} className='btn btn-warning my-1'> Back</Button><br/>
                <div> If u want to change other details in ur profile u can update in ur profile page click here to go to <Link to='/login'>Profile Page</Link> </div>
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

    }
]