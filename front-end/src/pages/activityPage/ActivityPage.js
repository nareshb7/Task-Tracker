import React, { useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import { fetchCall, fetchGetCall } from '../../components/utils/fetch/UseFetch'
import { getFullName } from '../../components/utils/GetFullName'
import { useLocation } from 'react-router-dom'

export const addActivity = async (user, label, content) => {
    const payLoad = {
        label,
        content,
        id: user._id,
        name: getFullName(user)
    }
    const response = await fetchCall('/api/addactivity', {payLoad})
    console.log('Activity Res', response)
}

const ActivityPage = ({ id, name }) => {
    const [activityData,setActivityData] = useState([])
    const getActivityList = async ()=> {
        const {success,data} = await fetchGetCall('/api/getactivity',{id})
        console.log('Activity RES', success, data)
        success && setActivityData(data)
    }
    useEffect(()=> {
        getActivityList()
    },[])
    return (
        <div>
            <Row className='fw-bold fs-4 justify-content-center my-2'>{name}'s Activity</Row>
            <Row style={{ height: "300px", overflowY: 'scroll' }}>
                {
                    activityData.map((_, idx) => (
                        <Row key={idx} className='flex-column card my-2'>
                            <Col className='fw-bold fs-4'>{_.label}</Col>
                            <Col className='fs-5'>{_.content}</Col>
                            <Col style={{ color: '#888' }}>
                                <span>{new Date(_.createdAt).toLocaleTimeString()}</span>
                                <span> Details</span>
                            </Col>
                        </Row>
                    ))
                }
            </Row>
        </div>
    )
}

export default ActivityPage