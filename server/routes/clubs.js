const express = require('express');
const router = express.Router();
const Clubs = require('../models/clubs');
const cron = require('node-cron');

let randomObjects = [];

generateRandomObjects();

cron.schedule('0 0 * * *', () => {
    generateRandomObjects();
  });

// Function to generate 5 random objects from the database
async function generateRandomObjects() {
  try {
    const count = await Clubs.countDocuments();
    const randomIndexes = [];
    while (randomIndexes.length < 5) {
      const randomIndex = Math.floor(Math.random() * count);
      if (!randomIndexes.includes(randomIndex)) {
        randomIndexes.push(randomIndex);
      }
    }
    randomObjects = await Clubs.find().skip(randomIndexes[0]).limit(5);
  } catch (error) {
    console.error('Error generating random objects:', error);
  }
}

// Get all Clubs
router.get('/', async (req, res) => {
    try {
        const jobs = await Clubs.find();
        res.status(201).json(jobs);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/random-clubs', (req, res) => {
    res.json(randomObjects);
})

module.exports = router;
