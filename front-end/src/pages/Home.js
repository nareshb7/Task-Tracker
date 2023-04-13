import React from 'react'
import { Button, Col, Row } from 'react-bootstrap'
import { LinkContainer } from 'react-router-bootstrap'
import './style/Home.css'

const Home = () => {
    return (
        <Row>
            <Col md={6} className='d-flex flex-direction-column align-items-center justify-content-center'>
                <div>
                    <h1>Welcome ...</h1>
                    <p>This is the Tracker Application, It will track your daily issue status</p>
                    <div className='d-flex justify-content-around'>
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
                </div>
            </Col>
            <Col md={6} className='home__bg'>
            </Col>
        </Row>
    )
}
export default Home