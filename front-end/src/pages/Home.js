import React, { useContext, useEffect, useState } from 'react'
import { Button, Col, Row } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import './style/Home.css'
import { UserContext } from '../App'
import { addActivity } from './activityPage/ActivityPage'
import './home.css'

const Home = () => {
    const { currentUserVal, quote } = useContext(UserContext)
    useEffect(() => {
        addActivity(currentUserVal, 'Home page', `Visited Home page`)
    }, [])

    return (
        <div className='main2 '>
            <div className='fs-1 fw-bolder'>Welcome To,</div>
            <div className='logo1'>Resource one it solutions</div>
            <div style={{ alignSelf: 'end', fontFamily:'cursive'}} className='fs-3 fst-italic'>Chat Box</div>
        </div>
    )
}
export default Home

/*
 <Row style={{minHeight:'90vh', backgroundColor:'#95e8f3'}} className='p-2'>
            <Col md={5}  className='card m-auto m-2 shadow p-3 bg-body rounded' >
                <div >
                    <marquee style={{background:'#ff0'}}>Working on Chat-bot</marquee>
                    <div style={{textAlign:'center'}}>
                    <h1>Welcome,</h1>
                    <p>This is the Task-Tracker Application, It will track your daily issue status</p>
                    </div>
                    <Row>
                        <Col className='card m-1 ' style={{background:'#999'}}>
                            <span className='fw-bold'>Quote of the Day: </span>
                            <span className='fst-italic p-1 '>{quote.text}</span>
                            <span className='fw-bold text-end px-2'>--- {quote.author}</span>
                        </Col>
                    </Row>
                    {
                        !currentUserVal.fName && <div className='d-flex justify-content-around'>
                        <LinkContainer to='/login'>
                            <Button variant='success'>
                                Login <i className='fas fa-comments home-message-icon'></i>
                            </Button>
                        </LinkContainer>
                        <LinkContainer to='/signup'>
                            <Button variant='primary'>
                                signup <i className='fas fa-comments home-message-icon'></i>
                            </Button>
                        </LinkContainer>
                    </div>
                    }
                    
                </div>
            </Col>
            </Row>
*/