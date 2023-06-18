import React, { useContext, useEffect, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import { fetchCall, fetchGetCall } from '../../components/utils/fetch/UseFetch'
import { getFullName } from '../../components/utils/GetFullName'
import { useLocation } from 'react-router-dom'
import { getFormattedDate } from '../chatBox/MessageBox'
import { UserContext } from '../../App'

export const addActivity = async (user, label, content) => {
    const date = getFormattedDate(new Date(),'yyyy/mm/dd')
    const payLoad = {
        label,
        content,
        date,
        id: user._id,
        name: getFullName(user)
    }
    if (user._id) {
        const response = await fetchCall('/api/addactivity', { payLoad })
        console.log('Activity Res', response)
    }
}

const ActivityPage = ({ id, name }) => {
    const { currentUserVal } = useContext(UserContext)
    const [activityData, setActivityData] = useState([])
    const getActivityList = async () => {
        const { success, data } = await fetchGetCall('/api/getactivity', { id })
        console.log('Activity RES', success, data)
        success && setActivityData(data)
    }
    useEffect(() => {
        getActivityList()
    }, [])
    return (
        <div >{
            currentUserVal._id == id || currentUserVal.isAdmin ? <>
                <Row className='fw-bold fs-4 justify-content-center my-2' >{name}'s Activity</Row>
                {
                    activityData.length ?
                        <Row style={{ position: 'relative',height: '300px', overflowY: 'scroll' }}>{
                            activityData.map((activity, idx) => (
                                <Row key={idx}>
                                    <Col className='text-center fw-bold bg-secondary' style={{ position: 'sticky' }}>{activity._id}</Col>
                                    <Row>
                                        {
                                            activity.activityByDate.map((_, idx) => (
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
                                </Row>
                            ))
                        }
                        </Row> : <Row> No Activity</Row>
                }
            </> : ''
        }
        </div>
    )
}

export default ActivityPage