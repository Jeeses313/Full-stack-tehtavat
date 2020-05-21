import React from 'react';
import { CoursePart } from './index';

const Part: React.FC<{ coursePart: CoursePart }> = ({ coursePart }) => {
    const assertNever = (value: never): never => {
        throw new Error(
            `Unhandled discriminated union member: ${JSON.stringify(value)}`
        );
    };
    switch (coursePart.name) {
        case "Deeper type usage":
            return (
                <p>
                    {coursePart.name} {coursePart.exerciseCount} {coursePart.description} {coursePart.exerciseSubmissionLink}
                </p>
            );
        case "Fundamentals":
            return (
                <p>
                    {coursePart.name} {coursePart.exerciseCount} {coursePart.description}
                </p>
            );
        case "Using props to pass data":
            return (
                <p>
                    {coursePart.name} {coursePart.exerciseCount} {coursePart.groupProjectCount}
                </p>
            );
        case "FS":
            return (
                <p>
                    {coursePart.name} {coursePart.exerciseCount} {coursePart.description}
                </p>
            );
        default:
            return assertNever(coursePart);
    }
};

export default Part;