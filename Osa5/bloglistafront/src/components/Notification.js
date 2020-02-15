import React from 'react'
import '../index.css'
import PropTypes from 'prop-types'

const Notification = ({ message }) => {
    if (message === null) {
        return (
            <></>
        )
    }
    if (message.error) {
        return (
            <div className='errormessage'>{message.message}</div>
        )
    }
    return (
        <div className='message'>{message.message}</div>
    )
}

Notification.propTypes = {
    message: PropTypes.string
}

export default Notification