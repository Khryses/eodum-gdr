const fs = require('fs').promises;
const path = require('path');

// File dove salvare i dati delle mappe (in produzione userei un database)
const MAPS_FILE = path.join(__dirname, '../data/maps.json');

// Dati di default caricati da file JSON
const DEFAULT_MAPS_FILE = path.join(__dirname, '../data/default-maps.json');
const defaultMaps = require(DEFAULT_MAPS_FILE);

// Assicura che la directory data esista
const ensureDataDirectory = async () => {
  const dataDir = path.dirname(MAPS_FILE);
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
};

// Carica mappe da file o usa default
const loadMaps = async () => {
  try {
    await ensureDataDirectory();
    const data = await fs.readFile(MAPS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.log('File mappe non trovato, uso dati di default');
    // Salva i dati di default al primo accesso
    await saveMaps(defaultMaps);
    return defaultMaps;
  }
};

// Salva mappe su file
const saveMaps = async (maps) => {
  try {
    await ensureDataDirectory();
    await fs.writeFile(MAPS_FILE, JSON.stringify(maps, null, 2));
    console.log('✅ Mappe salvate con successo');
  } catch (error) {
    console.error('❌ Errore nel salvare le mappe:', error);
    throw error;
  }
};

// GET /api/maps - Recupera tutte le mappe
const getAllMaps = async (req, res) => {
  try {
    const maps = await loadMaps();
    res.json(maps);
  } catch (error) {
    console.error('Errore nel recupero delle mappe:', error);
    res.status(500).json({ message: 'Errore nel recupero delle mappe' });
  }
};

// POST /api/maps/zones - Crea una nuova zona
const createZone = async (req, res) => {
  try {
    const { name, description } = req.body;
    
    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Nome zona richiesto' });
    }

    const maps = await loadMaps();
    
    if (maps[name]) {
      return res.status(409).json({ message: 'Zona già esistente' });
    }

    maps[name] = {
      description: description || '',
      places: {}
    };

    await saveMaps(maps);
    
    console.log(`✅ Zona "${name}" creata con successo`);
    res.status(201).json({ message: 'Zona creata con successo', zone: maps[name] });
  } catch (error) {
    console.error('Errore nella creazione della zona:', error);
    res.status(500).json({ message: 'Errore nella creazione della zona' });
  }
};

// PUT /api/maps/zones/:zoneName - Aggiorna una zona
const updateZone = async (req, res) => {
  try {
    const { zoneName } = req.params;
    const { description } = req.body;

    const maps = await loadMaps();
    
    if (!maps[zoneName]) {
      return res.status(404).json({ message: 'Zona non trovata' });
    }

    maps[zoneName].description = description || '';
    
    await saveMaps(maps);
    
    console.log(`✅ Zona "${zoneName}" aggiornata con successo`);
    res.json({ message: 'Zona aggiornata con successo' });
  } catch (error) {
    console.error('Errore nell\'aggiornamento della zona:', error);
    res.status(500).json({ message: 'Errore nell\'aggiornamento della zona' });
  }
};

// DELETE /api/maps/zones/:zoneName - Elimina una zona
const deleteZone = async (req, res) => {
  try {
    const { zoneName } = req.params;

    const maps = await loadMaps();
    
    if (!maps[zoneName]) {
      return res.status(404).json({ message: 'Zona non trovata' });
    }

    delete maps[zoneName];
    
    await saveMaps(maps);
    
    console.log(`✅ Zona "${zoneName}" eliminata con successo`);
    res.json({ message: 'Zona eliminata con successo' });
  } catch (error) {
    console.error('Errore nell\'eliminazione della zona:', error);
    res.status(500).json({ message: 'Errore nell\'eliminazione della zona' });
  }
};

// POST /api/maps/locations - Crea una nuova location
const createLocation = async (req, res) => {
  try {
    const { name, zone, image, description } = req.body;
    
    if (!name || !name.trim() || !zone || !zone.trim()) {
      return res.status(400).json({ message: 'Nome e zona richiesti' });
    }

    const maps = await loadMaps();
    
    if (!maps[zone]) {
      return res.status(404).json({ message: 'Zona non trovata' });
    }

    if (maps[zone].places[name]) {
      return res.status(409).json({ message: 'Location già esistente in questa zona' });
    }

    maps[zone].places[name] = {
      image: image || 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=200&fit=crop',
      description: description || ''
    };

    await saveMaps(maps);
    
    console.log(`✅ Location "${name}" creata nella zona "${zone}"`);
    res.status(201).json({ message: 'Location creata con successo' });
  } catch (error) {
    console.error('Errore nella creazione della location:', error);
    res.status(500).json({ message: 'Errore nella creazione della location' });
  }
};

// PUT /api/maps/locations - Aggiorna una location
const updateLocation = async (req, res) => {
  try {
    const { originalName, originalZone, name, zone, image, description } = req.body;
    
    if (!originalName || !originalZone || !name || !zone) {
      return res.status(400).json({ message: 'Dati originali e nuovi richiesti' });
    }

    const maps = await loadMaps();
    
    if (!maps[originalZone] || !maps[originalZone].places[originalName]) {
      return res.status(404).json({ message: 'Location non trovata' });
    }

    if (!maps[zone]) {
      return res.status(404).json({ message: 'Nuova zona non trovata' });
    }

    // Se zona o nome sono cambiati, elimina la vecchia e crea la nuova
    if (originalName !== name || originalZone !== zone) {
      // Controolla se la nuova location esiste già
      if (maps[zone].places[name]) {
        return res.status(409).json({ message: 'Location già esistente nella zona di destinazione' });
      }
      
      // Rimuovi dalla vecchia posizione
      delete maps[originalZone].places[originalName];
    }
    
    // Aggiorna o crea nella nuova posizione
    maps[zone].places[name] = {
      image: image || 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=200&fit=crop',
      description: description || ''
    };

    await saveMaps(maps);
    
    console.log(`✅ Location "${originalName}" aggiornata a "${name}" nella zona "${zone}"`);
    res.json({ message: 'Location aggiornata con successo' });
  } catch (error) {
    console.error('Errore nell\'aggiornamento della location:', error);
    res.status(500).json({ message: 'Errore nell\'aggiornamento della location' });
  }
};

// DELETE /api/maps/locations - Elimina una location
const deleteLocation = async (req, res) => {
  try {
    const { name, zone } = req.body;
    
    if (!name || !zone) {
      return res.status(400).json({ message: 'Nome e zona richiesti' });
    }

    const maps = await loadMaps();
    
    if (!maps[zone] || !maps[zone].places[name]) {
      return res.status(404).json({ message: 'Location non trovata' });
    }

    delete maps[zone].places[name];
    
    await saveMaps(maps);
    
    console.log(`✅ Location "${name}" eliminata dalla zona "${zone}"`);
    res.json({ message: 'Location eliminata con successo' });
  } catch (error) {
    console.error('Errore nell\'eliminazione della location:', error);
    res.status(500).json({ message: 'Errore nell\'eliminazione della location' });
  }
};

module.exports = {
  getAllMaps,
  createZone,
  updateZone,
  deleteZone,
  createLocation,
  updateLocation,
  deleteLocation
};