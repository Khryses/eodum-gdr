const express = require('express');
const router = express.Router();

// METEO SIMULATO
router.get('/weather', (req, res) => {
  const now = new Date();
  const month = now.getMonth(); // 0-11
  const hour = now.getHours();

  const season = (month < 2 || month === 11) ? 'winter'
                : (month < 5) ? 'spring'
                : (month < 8) ? 'summer'
                : 'autumn';

  const baseTemp = {
    winter: [-10, 5],
    spring: [6, 16],
    summer: [17, 30],
    autumn: [5, 15]
  };

  const [min, max] = baseTemp[season];
  const temp = Math.floor(Math.random() * (max - min + 1)) + min;

  const conditions = ['sunny', 'cloudy', 'rainy', 'snowy'];
  const condition = temp <= 0 ? 'snowy' : conditions[Math.floor(Math.random() * conditions.length)];

  const moonPhases = ['new', 'waxing', 'full', 'waning'];
  const moon = moonPhases[Math.floor((now.getDate() % 28) / 7)];

  res.json({
    temperature: temp,
    condition,
    moon,
    humidity: Math.floor(Math.random() * 40) + 40
  });
});

// UTENTI PRESENTI (simulati)
router.get('/presenze', (req, res) => {
  const users = [
    { name: 'Raven', status: 'online' },
    { name: 'Isabelle', status: 'entering' },
    { name: 'Ace', status: 'leaving' },
    { name: 'Sylas', status: 'online' }
  ];
  res.json(users);
});

module.exports = router;
