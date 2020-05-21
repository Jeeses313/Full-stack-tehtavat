interface Result {
    periodLength: number;
    trainingDays: number;
    success: boolean;
    rating: number;
    ratingDescription: string;
    target: number;
    average: number;
}

const calculateExercises = (exerciseHours: Array<number>, target: number): Result => {
    const periodLength = exerciseHours.length;
    const trainingDays = exerciseHours.filter(hours => hours > 0).length;
    let sum = 0;
    exerciseHours.forEach(hours => sum += hours);
    const average = sum / periodLength;
    let rating = 1;
    let ratingDescription = 'quite bad, should do better';
    let success = false;
    if (average > target) {
        rating = 3;
        ratingDescription = 'very good';
        success = true;
    } else if (average > target / 2) {
        rating = 2;
        ratingDescription = 'not too bad but could be better';
    }
    return {
        periodLength,
        trainingDays,
        success,
        rating,
        ratingDescription,
        target,
        average
    };
};

const calculateExercisesDefault = (exerciseHours: Array<number>): Result => {
    return calculateExercises(exerciseHours, 2);
};

const parseArguments = (args: Array<string>): Array<number> => {
    if (args.length < 3) throw new Error('Not enough arguments');
    if (args.filter((arg, i) => i > 1 && isNaN(Number(arg))).length === 0) {
        return args.filter((_arg, i) => i > 1).map(arg => Number(arg));
    } else {
        throw new Error('Provided values were not numbers!');
    }
};

try {
    const times = parseArguments(process.argv);
    console.log(calculateExercisesDefault(times));
} catch (e) {
    console.log(e.message);
}

export default calculateExercises;