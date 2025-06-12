// utils/gameUtils.js

/**
 * Formatta il tempo in formato MM:SS
 */
export const formatTime = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

/**
 * Calcola il tempo rimanente per la penalità di logout
 */
export const getLogoutPenaltyTime = () => {
  const forceLogoutTime = localStorage.getItem('forceLogoutTime');
  if (!forceLogoutTime) return null;
  
  const penaltyEnd = parseInt(forceLogoutTime);
  const now = Date.now();
  
  if (now >= penaltyEnd) {
    localStorage.removeItem('forceLogoutTime');
    return null;
  }
  
  return Math.ceil((penaltyEnd - now) / 1000);
};

/**
 * Imposta una penalità di logout forzato
 */
export const setLogoutPenalty = (minutes = 3) => {
  const penaltyTime = Date.now() + (minutes * 60 * 1000);
  localStorage.setItem('forceLogoutTime', penaltyTime.toString());
  return penaltyTime;
};

/**
 * Rimuove la penalità di logout
 */
export const clearLogoutPenalty = () => {
  localStorage.removeItem('forceLogoutTime');
};

/**
 * Calcola la fase lunare basata sul giorno dell'anno
 */
export const calculateMoonPhase = (date = new Date()) => {
  const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 86400000);
  const moonCycle = 28; // Ciclo lunare semplificato
  const phaseIndex = Math.floor((dayOfYear % moonCycle) / 3.5);
  
  const phases = [
    { key: 'new', name: 'Luna Nuova', icon: '🌑' },
    { key: 'waxing_crescent', name: 'Falce Crescente', icon: '🌒' },
    { key: 'first_quarter', name: 'Primo Quarto', icon: '🌓' },
    { key: 'waxing_gibbous', name: 'Gibbosa Crescente', icon: '🌔' },
    { key: 'full', name: 'Luna Piena', icon: '🌕' },
    { key: 'waning_gibbous', name: 'Gibbosa Calante', icon: '🌖' },
    { key: 'last_quarter', name: 'Ultimo Quarto', icon: '🌗' },
    { key: 'waning_crescent', name: 'Falce Calante', icon: '🌘' }
  ];
  
  return phases[Math.max(0, Math.min(7, phaseIndex))];
};

/**
 * Calcola la stagione basata sul mese
 */
export const calculateSeason = (date = new Date()) => {
  const month = date.getMonth();
  
  if (month >= 11 || month <= 1) return 'Inverno';
  if (month >= 2 && month <= 4) return 'Primavera';
  if (month >= 5 && month <= 7) return 'Estate';
  return 'Autunno';
};

/**
 * Calcola la temperatura basata su stagione e ora
 */
export const calculateTemperature = (date = new Date()) => {
  const month = date.getMonth();
  const hours = date.getHours();
  const day = date.getDate();
  
  // Range temperatura per stagione (min, max)
  const seasonRanges = {
    'Inverno': [-20, 5],
    'Primavera': [-5, 15], 
    'Estate': [10, 30],
    'Autunno': [0, 20]
  };
  
  const season = calculateSeason(date);
  const [minTemp, maxTemp] = seasonRanges[season];
  
  // Variazione giornaliera (più freddo di notte)
  const hourlyVariation = Math.sin((hours - 6) * Math.PI / 12);
  const baseTemp = minTemp + (maxTemp - minTemp) * Math.max(0, hourlyVariation);
  
  // Variazione casuale giornaliera
  const dailyVariation = Math.sin(day * 0.1) * 5;
  
  return Math.round(Math.max(minTemp, Math.min(maxTemp, baseTemp + dailyVariation)));
};

/**
 * Determina le condizioni meteo (clima montano)
 */
export const calculateWeatherCondition = (date = new Date()) => {
  const hours = date.getHours();
  const day = date.getDate();
  const temperature = calculateTemperature(date);
  const isNight = hours < 6 || hours > 20;
  
  // Clima montano: spesso nuvoloso/nebbioso
  const baseConditions = isNight 
    ? ['foggy', 'foggy', 'cloudy', 'cloudy'] // Di notte più nebbia
    : ['cloudy', 'foggy', 'sunny', 'rainy']; // Di giorno più variabile
  
  // Aggiungi neve in inverno con temperature basse
  if (calculateSeason(date) === 'Inverno' && temperature < 0) {
    baseConditions.push('snowy', 'snowy');
  }
  
  // Selezione pseudo-casuale basata su giorno e ora
  const index = Math.floor(Math.abs(Math.sin(day * 0.3 + hours * 0.1)) * baseConditions.length);
  return baseConditions[index] || 'cloudy';
};

/**
 * Genera dati meteo completi
 */
export const generateWeatherData = (date = new Date()) => {
  const temperature = calculateTemperature(date);
  const condition = calculateWeatherCondition(date);
  const season = calculateSeason(date);
  const moonPhase = calculateMoonPhase(date);
  const isNight = date.getHours() < 6 || date.getHours() > 20;
  
  // Ultimo aggiornamento (ogni 6 ore)
  const lastUpdateHour = Math.floor(date.getHours() / 6) * 6;
  const updateTime = lastUpdateHour === 0 ? '00:00' : 
                    lastUpdateHour === 6 ? '06:00' : 
                    lastUpdateHour === 12 ? '12:00' : '18:00';
  
  return {
    temperature,
    condition,
    season,
    moonPhase: moonPhase.key,
    moonPhaseName: moonPhase.name,
    moonIcon: moonPhase.icon,
    isNight,
    lastUpdate: `Oggi ${updateTime}`,
    location: 'Eodum - Regione Montana',
    humidity: Math.round(60 + Math.sin(date.getDate() * 0.2) * 20), // 40-80%
    windSpeed: Math.round(5 + Math.sin(date.getHours() * 0.1) * 10) // 0-15 km/h
  };
};

/**
 * Valida un nome personaggio (no copyright)
 */
export const validateCharacterName = (name) => {
  const forbiddenNames = [
    'harry potter', 'aragorn', 'frodo', 'skywalker', 'luke skywalker',
    'darth vader', 'gandalf', 'legolas', 'gimli', 'spiderman', 'superman',
    'batman', 'iron man', 'captain america', 'thor', 'hulk', 'wolverine',
    'pikachu', 'mario', 'luigi', 'zelda', 'link', 'samus', 'sonic'
  ];
  
  const nameToCheck = name.toLowerCase().trim();
  return !forbiddenNames.some(forbidden => nameToCheck.includes(forbidden));
};

/**
 * Formatta data italiana
 */
export const formatItalianDate = (date = new Date()) => {
  return date.toLocaleDateString('it-IT', {
    day: '2-digit',
    month: '2-digit', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

/**
 * Formatta tempo relativo (es. "5 minuti fa")
 */
export const formatRelativeTime = (timestamp) => {
  const now = Date.now();
  const diff = now - new Date(timestamp).getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days} giorni fa`;
  if (hours > 0) return `${hours} ore fa`;
  if (minutes > 0) return `${minutes} minuti fa`;
  if (seconds > 10) return `${seconds} secondi fa`;
  return 'Ora';
};

/**
 * Debounce function per limitare chiamate API
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Genera un ID unico
 */
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * Controlla se è un orario "pericoloso" (notte)
 */
export const isDangerousTime = (date = new Date()) => {
  const hours = date.getHours();
  return hours >= 22 || hours <= 5; // 22:00 - 05:59
};

/**
 * Calcola bonus/malus basato su orario
 */
export const getTimeBonus = (date = new Date()) => {
  if (isDangerousTime(date)) {
    return {
      type: 'malus',
      message: 'La notte porta pericoli... (-10% esperienza)',
      multiplier: 0.9
    };
  }
  
  const hours = date.getHours();
  if (hours >= 6 && hours <= 8) {
    return {
      type: 'bonus',
      message: 'L\'alba porta fortuna! (+20% esperienza)',
      multiplier: 1.2
    };
  }
  
  return {
    type: 'normal',
    message: '',
    multiplier: 1.0
  };
};

/**
 * Storage helper con fallback
 */
export const storage = {
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },
  
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },
  
  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch {
      return false;
    }
  }
};

export default {
  formatTime,
  getLogoutPenaltyTime,
  setLogoutPenalty,
  clearLogoutPenalty,
  calculateMoonPhase,
  calculateSeason,
  calculateTemperature,
  calculateWeatherCondition,
  generateWeatherData,
  validateCharacterName,
  formatItalianDate,
  formatRelativeTime,
  debounce,
  generateId,
  isDangerousTime,
  getTimeBonus,
  storage
};