import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const Anecdote = ({ title, selected, anecdotes, votes }) => {
    return (
        <>
            <h1>{title}</h1>
            <div>{anecdotes[selected]}</div>
            <div>has {votes[selected]} votes</div>
        </>
    )
}

const App = (props) => {
    const [selected, setSelected] = useState(0)
    const [votes, setVotes] = useState(Array.apply(null, new Array(6)).map(Number.prototype.valueOf, 0))
    const randomAnecdote = () => setSelected(Math.floor(Math.random() * 6));
    const vote = () => {
        const newVotes = [...votes];
        newVotes[selected] += 1;
        setVotes(newVotes);
    }
    let bestAnecdote = 0;
    let i;
    for (i = 0; i < 6; i++) {
        if (votes[i] > votes[bestAnecdote]) {
            bestAnecdote = i;
        }
    }
    return (
        <>
            <Anecdote
                title="Anecdote of the day"
                selected={selected}
                anecdotes={props.anecdotes}
                votes={votes}
            ></Anecdote>
            <button onClick={vote}>vote</button>
            <button onClick={randomAnecdote}>next anectode</button>
            <Anecdote
                title="Anecdote with most votes"
                selected={bestAnecdote}
                anecdotes={props.anecdotes}
                votes={votes}
            ></Anecdote>
        </>
    )
}

const anecdotes = [
    'If it hurts, do it more often',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

ReactDOM.render(
    <App anecdotes={anecdotes} />,
    document.getElementById('root')
)