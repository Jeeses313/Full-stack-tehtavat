const reducer = (state = {message:'', error:false}, action) => {
  switch (action.type) {
    case 'SET NOTIFICATION': {
      return action.notification
    }
    default: return state
  }
}

let timeout

export const setNotification = (notification, time) => {
  return async dispatch => {
    if (notification.message !== '') {
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        dispatch(setNotification({message:'', error:false}))
      }, time * 1000)
    }
    dispatch({
      type: 'SET NOTIFICATION',
      notification: notification
    })
  }
}

export default reducer