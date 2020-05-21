import React from 'react';
import Part from './Part';
import { CoursePart } from './index';

const Content: React.FC<{ courseParts: CoursePart[] }> = ({ courseParts }) => {
    return (
        <>
            {courseParts.map(coursePart => <Part key={coursePart.name} coursePart={coursePart}></Part>)}
        </>
    );
};

export default Content;