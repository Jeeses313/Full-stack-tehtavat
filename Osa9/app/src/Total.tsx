import React from 'react';

const Total: React.FC<{ totalExercises: number }> = ({ totalExercises }) => {
    return <p>Number of exercises {totalExercises}</p>;
};

export default Total;