const express = require('express');
const router = express.Router();
const SqlQueries = require('../services/SqlQueries');
const Category = require('../services/CategoryService');

let Queries = new SqlQueries();

router.post('/getQuestions', async (req, res) => {
    let { id } = req.body;
    let questions = await Queries.getAllQuestionsByCategoryIdAsync(parseInt(id));
    if (questions.length > 0) {
        await res.json({ success: true,  questions: questions });
    } else {
        await res.json({ success: false, msg: "Not found."});
    }
});

module.exports = router;