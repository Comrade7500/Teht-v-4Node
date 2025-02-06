import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;
const host = 'localhost';

app.use(express.json());
app.use(express.urlencoded({extended: true}))


const feedbackFile = path.join(__dirname, 'feedback_mock.json');
let feedbackData = JSON.parse(fs.readFileSync(feedbackFile, 'utf8'));


app.get('/palaute', (req, res) => {
    res.json(feedbackData);
});

app.get('/palaute/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const feedback = feedbackData.find(f => f.id === id);
    if (!feedback) {
        return res.status(404).json({ error: 'Palaute ei löytynyt' });
    }
    res.json(feedback);
});

// POST
app.post('/palaute/uusi', (req, res) => {
    let name = req.body.name;
    let email = req.body.email;
    let feedback = req.body.feedback;
    console.log(name,email,feedback)
    if (!name || !email || !feedback) {
        return res.status(400).json({ error: 'Kaikki kentät ovat pakollisia' });
    }
    const newFeedback = {
        id: feedbackData.length ? Math.max(...feedbackData.map(f => f.id)) + 1 : 1,
        name,
        email,
        feedback
    };
    feedbackData.push(newFeedback);
    res.status(200).json(newFeedback);
});

// PUT
app.put('/palaute/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = feedbackData.findIndex(f => f.id === id);
    if (index === -1) {
        return res.status(404).json({ error: 'Palaute ei löytynyt' });
    }
    const { name, email, feedback } = req.body;
    feedbackData[index] = { id, name: name || feedbackData[index].name, email: email || feedbackData[index].email, feedback: feedback || feedbackData[index].feedback };
    res.status(200).json(feedbackData[index]);
});


app.delete('/palaute/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = feedbackData.findIndex(f => f.id === id);
    if (index === -1) {
        return res.status(404).json({ error: 'Palaute ei löytynyt' });
    }
    const deletedFeedback = feedbackData.splice(index, 1);
    res.status(200).json(deletedFeedback[0]);
});

app.listen(port, host, () => console.log(`Palvelin TOIMII tässä portissa ${port}`));
