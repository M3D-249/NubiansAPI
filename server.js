
const express = require('express');
require('dotenv').config();
const bodyParser = require('body-parser');
const cors = require('cors');
const updatesRouter = require('./routes/updates');
const { Sequelize, DataTypes } = require('sequelize');
const PORT = process.env.PORT || 5000;


const app = express();
const sequelize = new Sequelize(process.env.DB_URL, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    },
    logging: false
});

sequelize.sync()
    .then(() => {
        console.log('Database connected successfully');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

const post = sequelize.define('post', {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    timestamps: true
});


app.use(cors());
app.use(bodyParser.json());
app.use('/api/updates', updatesRouter);

app.use(express.static(require('path').join(__dirname, 'public')));

let updates = [
    { id: 1, title: 'Update 1', content: 'Content for update 1' },
    { id: 2, title: 'Update 2', content: 'Content for update 2' },
    { id: 3, title: 'Update 3', content: 'Content for update 3' }
];

app.get('/', (req, res) => {
    res.send({
        message: 'Welcome to the Updates API! Use /api/updates to access updates.'
    })
});

app.get('/api/updates', (req, res) => {
    res.json({ updates });
});

app.get('/api/updates/:id', (req, res) => {
    const updateId = parseInt(req.params.id, 10);
    const update = updates.find(u => u.id === updateId);
    
    if (update) {
        res.json(update);
    } else {
        res.status(404).json({ error: 'Update not found' });
    }
});

app.post('/api/updates', (req, res) => {
    const newUpdate = {
        id: updates.length + 1,
        title: req.body.title,
        content: req.body.content
    };
    
    updates.push(newUpdate);
    res.status(201).json(newUpdate);
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.post('/api/updates', async (req, res) => {
    try {
        const { title, content } = req.body;
        const newPost = await post.create({ title, content });
        res.status(201).json(newPost);
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});