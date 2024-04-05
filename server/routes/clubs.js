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
      const countriesCount = {};
      const teams = await Clubs.find();
      const randomTeams = [];
      for (const team of teams) {
        const country = team.Country;
        if (!countriesCount[country]) {
          countriesCount[country] = 0;
        }
        if (countriesCount[country] < 2) {
          randomTeams.push(team);
          countriesCount[country]++;
        }
      }
      // Shuffle the random teams array
      for (let i = randomTeams.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [randomTeams[i], randomTeams[j]] = [randomTeams[j], randomTeams[i]];
      }
      // Select the first 5 teams (or less if there are fewer than 5)
      randomObjects = randomTeams.slice(0, Math.min(randomTeams.length, 5));
    } catch (error) {
      console.error('Error generating random teams:', error);
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
