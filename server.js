const express = require('express');
const bodyParser = require('body-parser');
const data = require('./data.json');
const fs = require('fs');

const app = express();
app.use(bodyParser.json());

app.get('/api/data', (req, res) => {
  res.send(data);
});

app.get('/articles/:id', (req, res) => {
    const id = req.params.id;
    fs.readFile('data.json', (err, data) => {
        if (err) throw err;
        const articles = JSON.parse(data);
        const article = articles.find(article => article.id === parseInt(id));
        if (!article) {
            res.status(404).send('Article not found');
        } else {
            res.send(article);
        }
    });
});
// Endpoint to retrieve articles by topic and/or date
app.get('/articles', (req, res) => {
    const topic = req.query.topic;
    const dateString = req.query.date;
    fs.readFile('data.json', (err, data) => {
        if (err) throw err;
        const articles = JSON.parse(data);
        let matchingArticles = articles;
        if (topic) {
            matchingArticles = matchingArticles.filter(article => article.topic === topic);
        }
        if (dateString) {
            const date = new Date(dateString);
            matchingArticles = matchingArticles.filter(article => {
                const articleDate = new Date(article.date);
                return articleDate.getFullYear() === date.getFullYear() &&
                    articleDate.getMonth() === date.getMonth() &&
                    articleDate.getDate() === date.getDate();
            });
        }
        matchingArticles.sort((a, b) => new Date(a.date) - new Date(b.date));
        res.send(matchingArticles);
    });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
