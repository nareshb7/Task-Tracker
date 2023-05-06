import React, { useContext, useEffect, useState } from 'react'
import { Button, Col, Row } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import './style/Home.css'
import { UserContext } from '../App'

const Home = () => {
    const {currentUserVal, quote} = useContext(UserContext)
    
    
    return (
        <Row>
            <Col md={6} className='d-flex flex-direction-column align-items-center justify-content-center'>
                <div>
                    <h1>Welcome,</h1>
                    <p>This is the Task-Tracker Application, It will track your daily issue status</p>
                    <Row>
                        <Col className='card m-1 bg-primary'>
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
            <Col md={6} className='home__bg'>
            </Col>
        </Row>
    )
}
export default Home