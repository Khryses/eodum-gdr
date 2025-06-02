const express = require('express');
const router = express.Router();
const { User } = require('../models');
const authMiddleware = require('../middleware/authMiddleware');

// Funzione per calcolare la fase lunare reale
function calculateRealMoonPhase(date = new Date()) {
  // Luna nuova di riferimento: 6 gennaio 2000, 18:14 UTC
  const referenceNewMoon = new Date('2000-01-06T18:14:00Z');
  const lunarCycle = 29.53059; // giorni del ciclo lunare
  
  const daysSinceReference = (date.getTime() - referenceNewMoon.getTime()) / (1000 * 60 * 60 * 24);
  const cyclePosition = (daysSinceReference % lunarCycle) / lunarCycle;
  
  if (cyclePosition < 0.0625) return 'new';
  if (cyclePosition < 0.1875) return 'waxing_crescent';
  if (cyclePosition < 0.3125) return 'first_quarter';
  if (cyclePosition < 0.4375) return 'waxing_gibbous';
  if (cyclePosition < 0.5625) return 'full';
  if (cyclePosition < 0.6875) return 'waning_gibbous';
  if (cyclePosition < 0.8125) return 'last_quarter';
  return 'waning_crescent';
}

// Funzione per calcolare la stagione reale (emisfero nord)
function calculateRealSeason(date = new Date()) {
  const month = date.getMonth(); // 0-11
  const day = date.getDate();
  
  // Basato sulle date astronomiche approssimate
  if (month === 11 || month === 0 || month === 1) return 'winter'; // Dic, Gen, Feb
  if (month === 2) return day < 20 ? 'winter' : 'spring'; // Marzo: 20 circa equinozio
  if (month >= 3 && month <= 4) return 'spring'; // Apr, Mag
  if (month === 5) return day < 21 ? 'spring' : 'summer'; // Giugno: 21 circa solstizio
  if (month >= 6 && month <= 7) return 'summer'; // Lug, Ago
  if (month === 8) return day < 22 ? 'summer' : 'autumn'; // Set: 22 circa equinozio
  if (month >= 9 && month <= 10) return 'autumn'; // Ott, Nov
  return 'winter';
}

// Funzione per generare meteo stabile ogni 6 ore
function generateStableWeather(date = new Date()) {
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  const hour = date.getHours();
  
  // Determina il blocco di 6 ore (0-5, 6-11, 12-17, 18-23)
  const timeBlock = Math.floor(hour / 6);
  
  // Crea un seed basato su anno, mese, giorno e blocco di 6 ore
  const seed = year * 10000 + month * 100 + day * 10 + timeBlock;
  
  // Funzione pseudo-random basata sul seed
  const seededRandom = (s) => {
    const x = Math.sin(s) * 10000;
    return x - Math.floor(x);
  };
  
  const season = calculateRealSeason(date);
  const moonPhase = calculateRealMoonPhase(date);
  const isNight = hour < 6 || hour >= 18;
  
  // Range temperature per stagione (Italia del Nord - clima montano)
  const seasonTempRanges = {
    winter: [-5, 8],   // Inverno: freddo ma non estremo
    spring: [8, 18],   // Primavera: mite
    summer: [18, 30],  // Estate: caldo
    autumn: [5, 15]    // Autunno: fresco
  };
  
  const [minTemp, maxTemp] = seasonTempRanges[season];
  
  // Variazione giornaliera (più freddo di notte)
  const nightModifier = isNight ? -3 : 2;
  const baseTemp = minTemp + seededRandom(seed + 1) * (maxTemp - minTemp) + nightModifier;
  const temperature = Math.round(Math.max(minTemp - 5, Math.min(maxTemp + 3, baseTemp)));
  
  // Condizioni meteo per stagione (clima montano/collinare)
  const seasonConditions = {
    winter: ['cloudy', 'foggy', 'snowy', 'cloudy', 'rainy'],
    spring: ['cloudy', 'rainy', 'sunny', 'cloudy', 'foggy'],
    summer: ['sunny', 'cloudy', 'sunny', 'rainy', 'cloudy'],
    autumn: ['cloudy', 'rainy', 'foggy', 'cloudy', 'rainy']
  };
  
  // Aggiusta per temperatura (neve solo se fa freddo)
  let conditions = [...seasonConditions[season]];
  if (temperature <= 2 && season === 'winter') {
    conditions = ['snowy', 'snowy', 'cloudy', 'foggy']; // Più neve quando fa molto freddo
  } else if (temperature >= 25 && season === 'summer') {
    conditions = ['sunny', 'sunny', 'cloudy', 'sunny']; // Più sole quando fa caldo
  }
  
  // Più nebbia di notte/primo mattino
  if ((hour >= 22 || hour <= 7) && season !== 'summer') {
    conditions.push('foggy', 'foggy');
  }
  
  const conditionIndex = Math.floor(seededRandom(seed + 2) * conditions.length);
  const condition = conditions[conditionIndex];
  
  // Umidità basata su stagione e condizioni
  let baseHumidity = 60;
  if (season === 'winter') baseHumidity = 75;
  if (season === 'summer') baseHumidity = 50;
  if (condition === 'rainy' || condition === 'foggy') baseHumidity += 20;
  if (condition === 'sunny') baseHumidity -= 15;
  
  const humidity = Math.max(30, Math.min(95, 
    baseHumidity + (seededRandom(seed + 3) * 20 - 10)
  ));
  
  // Orario dell'ultimo aggiornamento (sempre alle 6, 12, 18, 00)
  const updateHours = [0, 6, 12, 18];
  const currentUpdateHour = updateHours[timeBlock];
  
  return {
    temperature: Math.round(temperature),
    condition,
    season,
    moonPhase,
    isNight,
    humidity: Math.round(humidity),
    windSpeed: Math.round(5 + seededRandom(seed + 4) * 15), // 5-20 km/h
    lastUpdate: `Oggi ${String(currentUpdateHour).padStart(2, '0')}:00`,
    nextUpdate: `${String(updateHours[(timeBlock + 1) % 4]).padStart(2, '0')}:00`,
    location: 'Eodum - Regione Montana'
  };
}

// METEO REALISTICO E STABILE (non richiede autenticazione)
router.get('/weather', (req, res) => {
  try {
    const weatherData = generateStableWeather();
    res.json(weatherData);
  } catch (error) {
    console.error('Errore nella generazione del meteo:', error);
    // Fallback in caso di errore
    res.json({
      temperature: 15,
      condition: 'cloudy',
      season: 'autumn',
      moonPhase: 'full',
      isNight: false,
      humidity: 60,
      windSpeed: 10,
      lastUpdate: 'Errore',
      nextUpdate: '06:00',
      location: 'Eodum - Regione Montana'
    });
  }
});

// TUTTI I PRESENTI NELLA LAND (richiede autenticazione)
router.get('/all-present', authMiddleware, async (req, res) => {
  try {
    const utenti = await User.findAll({
      where: {
        is_online: true
      },
      attributes: ['id', 'nome', 'cognome', 'current_location', 'updated_at']
    });

    // Raggruppa per location
    const playersByLocation = {};
    
    utenti.forEach(user => {
      const location = user.current_location || 'Sconosciuta';
      
      if (!playersByLocation[location]) {
        playersByLocation[location] = [];
      }
      
      // Determina lo status basato su quando è stato aggiornato l'ultimo accesso
      const now = new Date();
      const lastUpdate = new Date(user.updated_at);
      const diffMinutes = (now - lastUpdate) / (1000 * 60);
      
      let status = 'active';
      if (diffMinutes <= 1) {
        status = 'entering';
      } else if (diffMinutes > 10) {
        status = 'leaving';
      }
      
      playersByLocation[location].push({
        name: `${user.nome} ${user.cognome}`,
        status: status
      });
    });

    res.json({
      playersByLocation,
      totalPlayers: utenti.length,
      lastUpdate: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Errore in /system/all-present:', error);
    res.status(500).json({ message: 'Errore nel recupero dei presenti' });
  }
});

// STATISTICHE GENERALI (richiede autenticazione)
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const totalUsers = await User.count();
    const onlineUsers = await User.count({ where: { is_online: true } });
    
    res.json({
      totalUsers,
      onlineUsers,
      serverUptime: process.uptime(),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Errore in /system/stats:', error);
    res.status(500).json({ message: 'Errore nel recupero delle statistiche' });
  }
});

module.exports = router;