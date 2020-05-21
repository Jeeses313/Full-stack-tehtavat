import express from 'express';
import calculateBmi from './bmiCalculator';
import calculateExercises from './exerciseCalculator';
const app = express();
app.use(express.json());

app.get('/hello', (_req, res) => {
    res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
    const json = { weight: req.query.weight, height: req.query.height, bmi: calculateBmi(Number(req.query.height), Number(req.query.weight)) };
    if (!isNaN(Number(json.weight)) && !isNaN(Number(json.height))) {
        res.json(json);
    } else {
        res.json({ error: "malformatted parameters" });
    }
});

app.post('/exercises', (req, res) => {
    const reqJson: { daily_exercises: Array<number>; target: number } = req.body;
    if (!reqJson.daily_exercises || !reqJson.target) {
        res.json({ error: "parameters missing" });
    }
    if (reqJson.daily_exercises.filter(arg=> isNaN(Number(arg))).length === 0 && !isNaN(Number(reqJson.target))) {
        res.json(calculateExercises(reqJson.daily_exercises.map(hours => Number(hours)), Number(reqJson.target)));
    } else {
        res.json({ error: "malformatted parameters" });
    }
});

const PORT = 3001;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});