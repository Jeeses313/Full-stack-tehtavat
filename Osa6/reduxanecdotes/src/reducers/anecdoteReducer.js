import anecdoteService from '../services/anecdotes'

const reducer = (state = [], action) => {
  console.log('state now: ', state)
  console.log('action', action)
  switch (action.type) {
    case 'VOTE': {
      return state.map(anecdote => anecdote.id !== action.data.anecdote.id ? anecdote : action.data.anecdote)
    }
    case 'CREATE': {
      return state.concat(action.data.anecdote)
    }
    case 'INIT_ANECDOTES': {
      return action.data
    }
    default: return state
  }
}

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch({
      type: 'INIT_ANECDOTES',
      data: anecdotes
    })
  }
}

export const voteAnecdote = (anecdote) => {
  return async dispatch => {
    const votedAnecdote = await anecdoteService.update(anecdote)
    dispatch({
      type: 'VOTE',
      data: {
        anecdote: votedAnecdote
      }
    })
  }
}

export const createAnecdote = (anecdote) => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.createNew(anecdote)
    dispatch({
      type: 'CREATE',
      data: {
        anecdote: newAnecdote
      }
    })
  }
}

export default reducer