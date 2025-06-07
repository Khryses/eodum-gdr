const fs = require('fs').promises;
const path = require('path');

// File dove salvare i dati delle mappe (in produzione userei un database)
const MAPS_FILE = path.join(__dirname, '../data/maps.json');

// Dati di default
const defaultMaps = {
  "Centro": {
    description: "Il cuore pulsante di Eodum, dove il potere e la tecnologia si concentrano.",
    places: {
      "Piazza Centrale": {
        image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=200&fit=crop",
        description: "Una vasta piazza lastricata in pietra grigia, circondata da antichi edifici dalle facciate logore dal tempo. Al centro si erge una fontana di marmo nero, le cui acque scorrono silenziose come lacrime di pietra."
      },
      "Fortezza": {
        image: "https://images.unsplash.com/photo-1520637836862-4d197d17c38a?w=800&h=200&fit=crop",
        description: "Una massiccia struttura di pietra nera che domina il centro della città. Le sue mura spesse nascondono segreti antichi, mentre le torri si perdono nella nebbia perenne di Eodum."
      },
      "Banca": {
        image: "https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?w=800&h=200&fit=crop",
        description: "Un edificio imponente con colonne di marmo e porte dorate. All'interno, il ticchettio degli abachi si mescola ai sussurri di transazioni segrete."
      }
    }
  },
  "Periferia": {
    description: "I confini di Eodum, dove la civilizzazione incontra l'ignoto.",
    places: {
      "Rovine": {
        image: "https://images.unsplash.com/photo-1578498721985-a2e6b5fdbe26?w=800&h=200&fit=crop",
        description: "Resti di antiche costruzioni emergono dalla nebbia come denti rotti. La vegetazione selvatica ha reclamato questi luoghi dimenticati, creando un labirinto di pietra e natura."
      },
      "Ponte": {
        image: "https://images.unsplash.com/photo-1578169252050-1a2f0ac6c2f0?w=800&h=200&fit=crop",
        description: "Un antico ponte di pietra attraversa un abisso avvolto nella nebbia. I suoi archi gotici risuonano dei passi di chi osa attraversarlo, mentre sotto si odono echi misteriosi."
      },
      "Area verde": {
        image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=200&fit=crop",
        description: "Una distesa di erba pallida e alberi dalle foglie grigie. Qui la nebbia si dirada occasionalmente, rivelando fiori che brillano di una luce propria."
      }
    }
  },
  "Mercato": {
    description: "Il centro commerciale di Eodum, dove ogni cosa ha un prezzo.",
    places: {
      "Taverna del Corvo Nero": {
        image: "https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=800&h=200&fit=crop",
        description: "Un locale buio e accogliente, illuminato solo dal crepitio del fuoco nel camino e da poche candele tremolanti. L'aria è densa di fumo e del profumo di birra scura."
      },
      "Bazar": {
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=200&fit=crop",
        description: "Bancarelle di legno scuro si susseguono in file ordinate, coperte da tende logore. Mercanti incappucciati vendono merci strane: amuleti che brillano di luce propria."
      },
      "Magazzino": {
        image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=200&fit=crop",
        description: "Un edificio di mattoni rossi con ampie porte di ferro. All'interno, casse misteriose si accatastano fino al soffitto, alcune emettono strani bagliori."
      }
    }
  },
  "Quartiere": {
    description: "La zona residenziale di Eodum, dove gli abitanti conducono le loro vite quotidiane.",
    places: {
      "Biblioteca Antica": {
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=200&fit=crop",
        description: "Torreggianti scaffali di quercia scura si perdono nell'ombra, carichi di tomi polverosi e pergamene ingiallite. L'aria profuma di carta antica e inchiostro."
      },
      "Arena dei Sussurri": {
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=200&fit=crop",
        description: "Un'arena circolare scavata nella roccia nera, circondata da gradinate di pietra logore dal tempo. Al centro, un cerchio di sabbia rossastra porta ancora i segni di antichi duelli."
      },
      "Campo": {
        image: "https://images.unsplash.com/photo-1500964757637-c85e8a162699?w=800&h=200&fit=crop",
        description: "Un ampio spiazzo di terra battuta dove l'erba fatica a crescere. Utilizzato per addestramenti e duelli, il terreno è segnato da innumerevoli scontri del passato."
      }
    }
  }
};

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