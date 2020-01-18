import React, { useState } from 'react'
import ReactDOM from 'react-dom'


const Feedback = ({ good, setGood, neutral, setNeutral, bad, setBad }) => {
    const increaseGood = () => setGood(good + 1);
    const increaseNeutral = () => setNeutral(neutral + 1);
    const increaseBad = () => setBad(bad + 1);
    return (
        <>
            <h1>give feedback</h1>
            <div>
                <Button handleClick={increaseGood} text={"good"}></Button>
                <Button handleClick={increaseNeutral} text={"neutral"}></Button>
                <Button handleClick={increaseBad} text={"bad"}></Button>
            </div>
        </>
    )
}

const Statistics = ({ good, neutral, bad }) => {
    let all = good + neutral + bad;
    let average = (good + (neutral * 0) + (bad * -1)) / all;
    let positive = good / all;
    if (all === 0) {
        return (
            <>
                <h1>statistics</h1>
                <p>No feedback given</p>
            </>
        )
    }
    return (
        <>
            <h1>statistics</h1>
            <table>
                <tbody>
                    <StatisticsLine text="good" value={good}></StatisticsLine>
                    <StatisticsLine text="neutral" value={neutral}></StatisticsLine>
                    <StatisticsLine text="bad" value={bad}></StatisticsLine>
                    <StatisticsLine text="all" value={all}></StatisticsLine>
                    <StatisticsLine text="average" value={average}></StatisticsLine>
                    <StatisticsLine text="positive" value={positive} endText="%"></StatisticsLine>
                </tbody>
            </table>
        </>
    )
}

const StatisticsLine = ({ text, value, endText }) => (
    <tr>
        <td>{text}</td>
        <td>{value} {endText}</td>
    </tr>
)

const Button = ({ handleClick, text }) => (<button onClick={handleClick}>{text}</button>)


const App = () => {
    const [good, setGood] = useState(0)
    const [neutral, setNeutral] = useState(0)
    const [bad, setBad] = useState(0)

    return (
        <>
            <Feedback good={good} setGood={setGood} neutral={neutral} setNeutral={setNeutral} bad={bad} setBad={setBad}></Feedback>
            <Statistics good={good} neutral={neutral} bad={bad}></Statistics>
        </>
    )
}


ReactDOM.render(<App />,
    document.getElementById('root')
)
