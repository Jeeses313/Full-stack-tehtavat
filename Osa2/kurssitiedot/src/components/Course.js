import React from 'react'

const Header = ({ course }) => {
    return (
        <>
            <h2>{course}</h2>
        </>
    )
}

const Content = ({ parts }) => {
    return (
        <>
            {parts.map((part, i) =>
                <Part key={i} part={part.name} exercises={part.exercises} />
            )}
        </>
    )
}

const Part = ({ part, exercises }) => {
    return (
        <>
            <p>
                {part} {exercises}
            </p>
        </>
    )
}

const Total = ({ parts }) => {
    return (
        <>
            <p><b>total of {parts.reduce((acc, cur) => acc + cur.exercises, 0)} exercises</b></p>
        </>
    )
}

const Course = ({ course }) => {
    return (
        <div>
            <Header course={course.name} />
            <Content parts={course.parts} />
            <Total parts={course.parts} />
        </div>
    )
}

export default Course