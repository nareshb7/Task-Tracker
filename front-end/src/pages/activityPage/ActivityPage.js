import React, { useContext, useEffect, useRef, useState } from 'react'
import { Col, Row } from 'react-bootstrap'
import { fetchCall, fetchGetCall } from '../../components/utils/fetch/UseFetch'
import { getFullName } from '../../components/utils/GetFullName'
import { useLocation } from 'react-router-dom'
import { getFormattedDate } from '../chatBox/MessageBox'
import { UserContext } from '../../App'

export const addActivity = async (user, label, content) => {
    const date = getFormattedDate(new Date(), 'yyyy/mm/dd')
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
    const lastActivityRef = useRef(null)
    const [isEndActivity, setEndActivity] = useState(false)
    const getActivityList = async (update = null) => {
        const { success, data } = await fetchGetCall('/api/getactivity', { id, update })
        console.log('Activity RES', success, data)
        if (success) {
            if (update) {
                if (data.length && data[0]?._id.includes('NO DATA AVAIALBLE')) {
                    setActivityData([...activityData, ...data])
                    setEndActivity(true)
                    return
                }
                const dates = data.map(val => val._id)
                console.log('DATES', dates)
                const formattedMsz = activityData.map(val => {
                    if (dates.includes(val._id)) {
                        const mszs = data.find(value => value._id == val._id)
                        const idx = data.findIndex(value => value._id == val._id)
                        console.log('MSZS', mszs)
                        val.activityByDate = [...val.activityByDate, ...mszs.activityByDate]
                        data.splice(idx,1)
                    }
                    return val
                })
                console.log('LATEST', {formattedMsz, data})
                if (data.length) {
                    setActivityData([...formattedMsz, ...data,])
                } else {
                    setActivityData(formattedMsz)
                }
            } else {
                setActivityData(data)
            }
        }
    }
    const handleScroll = () => {
        if (!isEndActivity) {
            const el = document.getElementById('activity-box')
            if (el.scrollHeight == (el.scrollTop + el.clientHeight)) {
                console.log('SCROLLING', el.scrollHeight, el.scrollTop + el.clientHeight, activityData)
                getActivityList(true)
            }
        }
    }
    useEffect(() => {
        getActivityList()
    }, [])
    useEffect(() => {
        const el = document.getElementById('activity-box')
        el?.addEventListener('scroll', handleScroll)
        return () => {
            el?.removeEventListener('scroll', handleScroll)
        }
    }, [activityData])
    useEffect(() => {
        console.log('REF::', lastActivityRef.current)
    }, [lastActivityRef.current])
    return (
        <div >{
            currentUserVal._id == id || currentUserVal.isAdmin ? <>
                <Row className='fw-bold fs-4 justify-content-center my-2' >{name}'s Activity</Row>
                {
                    activityData.length ?
                        <Row id='activity-box' style={{ position: 'relative', height: '300px', overflowY: 'scroll' }}>{
                            activityData.map((activity, idx) => (
                                <Row key={idx}>
                                    <Col className='text-center fw-bold bg-secondary' style={{ position: 'sticky' }}>{activity._id}</Col>
                                    <Row>
                                        {
                                            activity.activityByDate.map((_, idx) => (
                                                <Row key={idx} className='flex-column card my-2' ref={lastActivityRef}>
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