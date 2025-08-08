const express = require('express');
const router = express.Router();

let updates = [
    { id: 1, title: 'Update 1', content: 'Content for update 1' },
    { id: 2, title: 'Update 2', content: 'Content for update 2' },
    { id: 3, title: 'Update 3', content: 'Content for update 3' }
];

router.get('/api/updates', (req, res) => {
    res.json({ updates });
});

router.get('/api/updates/:id', (req, res) => {
    const updateId = parseInt(req.params.id, 10);
    const update = updates.find(u => u.id === updateId);
    
    if (update) {
        res.json(update);
    } else {
        res.status(404).json({ error: 'Update not found' });
    }
});

router.post('/api/updates', (req, res) => {
    const newUpdate = {
        id: updates.length + 1,
        title: req.body.title,
        content: req.body.content
    };
    
    updates.push(newUpdate);
    res.status(201).json(newUpdate);
});

module.exports = router;