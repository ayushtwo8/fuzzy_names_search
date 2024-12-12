const express = require('express');
const router = express.Router();
const Name = require('../models/Name');
const PoliceStation = require('../models/PoliceStation');
const StationStaff = require('../models/StationStaff');
const Case = require('../models/Case');
const Suspect = require('../models/Suspect');
const Victim = require('../models/Victim');
const Witness = require('../models/Witness');
const Evidence = require('../models/Evidence');
const CrimeHistory = require('../models/CrimeHistory');
const Conviction = require('../models/Conviction');
const DutyRoster = require('../models/DutyRoster');
const BailRecord = require('../models/BailRecord');
const { Op } = require('sequelize');
const axios = require('axios');

// Add a new name record
router.post('/', async (req, res) => {
    try {
        const { originalName, caseNumber, role } = req.body;
        const response = await axios.post('http://localhost:5001/process_name', {
            name: originalName
        });

        const { romanizedName, devanagariName, phoneticCode } = response.data;

        const name = await Name.create({
            originalName,
            romanizedName,
            devanagariName,
            phoneticCode,
            caseNumber,
            role
        });

        res.status(201).json(name);
    } catch (error) {
        console.error('Error creating record:', error);
        if (error.name === 'SequelizeUniqueConstraintError') {
            res.status(400).json({ message: 'Case number already exists' });
        } else {
            res.status(500).json({ message: error.message });
        }
    }
});

// Search names with fuzzy matching
router.get('/search', async (req, res) => {
    try {
        const { query } = req.query;

        const response = await axios.post('http://localhost:5001/process_query', {
            query: query
        });

        const { processedQuery, devanagariQuery, phoneticCodes, variations } = response.data;

        const results = await Name.findAll({
            where: {
                [Op.or]: [
                    {
                        romanizedName: {
                            [Op.iLike]: `%${processedQuery}%`
                        }
                    },
                    {
                        devanagariName: {
                            [Op.iLike]: `%${devanagariQuery}%`
                        }
                    },
                    {
                        phoneticCode: {
                            [Op.in]: phoneticCodes
                        }
                    },
                    {
                        [Op.or]: variations.map(variant => ({
                            [Op.or]: [
                                {
                                    romanizedName: {
                                        [Op.iLike]: `%${variant}%`
                                    }
                                },
                                {
                                    devanagariName: {
                                        [Op.iLike]: `%${variant}%`
                                    }
                                }
                            ]
                        }))
                    }
                ]
            },
            order: [['createdAt', 'DESC']]
        });

        res.json(results);
    } catch (error) {
        console.error('Error searching records:', error);
        res.status(500).json({ message: error.message });
    }
});

// Get all names
router.get('/', async (req, res) => {
    try {
        const names = await Name.findAll({
            order: [['createdAt', 'DESC']]
        });
        res.json(names);
    } catch (error) {
        console.error('Error fetching records:', error);
        res.status(500).json({ message: error.message });
    }
});

// Voice search endpoint
router.post('/voice-search', async (req, res) => {
    try {
        const { recognizedText, language } = req.body;

        // voice search ko log karle bhai
        console.log(`Voice search attempt - Language: ${language}, Text: ${recognizedText}`);

        const results = await Name.findAll({
            where: {
                [Op.or]: [
                    // romanized names m search karlo
                    {
                        romanizedName: {
                            [Op.iLike]: `%${recognizedText}%`
                        }
                    },
                    // hindi(devanagari) names m search karlo
                    {
                        devanagariName: {
                            [Op.iLike]: `%${recognizedText}%`
                        }
                    },
                    // phonetic codes se search karlo
                    {
                        phoneticCode: {
                            [Op.eq]: recognizedText
                        }
                    }
                ]
            },
            order: [['createdAt', 'DESC']]
        });

        // result ko log karlo
        console.log(`Voice search results - Count: ${results.length}`);

        res.json({
            source: 'voice',
            language,
            recognizedText,
            results
        });
    } catch (error) {
        console.error('Error in voice search:', error);
        res.status(500).json({ 
            error: 'Error processing voice search',
            details: error.message
        });
    }
});

// PoliceStations Routes
router.post('/police-stations', async (req, res) => {
    try {
        const policeStation = await PoliceStation.create(req.body);
        res.status(201).json(policeStation);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/police-stations', async (req, res) => {
    try {
        const policeStations = await PoliceStation.findAll();
        res.json(policeStations);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// StationStaff Routes
router.post('/station-staff', async (req, res) => {
    try {
        const staff = await StationStaff.create(req.body);
        res.status(201).json(staff);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/station-staff', async (req, res) => {
    try {
        const staff = await StationStaff.findAll();
        res.json(staff);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Cases Routes
router.post('/cases', async (req, res) => {
    try {
        const caseRecord = await Case.create(req.body);
        res.status(201).json(caseRecord);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/cases', async (req, res) => {
    try {
        const cases = await Case.findAll();
        res.json(cases);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Suspects Routes
router.post('/suspects', async (req, res) => {
    try {
        const suspect = await Suspect.create(req.body);
        res.status(201).json(suspect);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/suspects', async (req, res) => {
    try {
        const suspects = await Suspect.findAll();
        res.json(suspects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Victims Routes
router.post('/victims', async (req, res) => {
    try {
        const victim = await Victim.create(req.body);
        res.status(201).json(victim);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/victims', async (req, res) => {
    try {
        const victims = await Victim.findAll();
        res.json(victims);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Witnesses Routes
router.post('/witnesses', async (req, res) => {
    try {
        const witness = await Witness.create(req.body);
        res.status(201).json(witness);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/witnesses', async (req, res) => {
    try {
        const witnesses = await Witness.findAll();
        res.json(witnesses);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Evidence Routes
router.post('/evidence', async (req, res) => {
    try {
        const evidence = await Evidence.create(req.body);
        res.status(201).json(evidence);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/evidence', async (req, res) => {
    try {
        const evidenceList = await Evidence.findAll();
        res.json(evidenceList);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// CrimeHistory Routes
router.post('/crime-history', async (req, res) => {
    try {
        const crimeHistory = await CrimeHistory.create(req.body);
        res.status(201).json(crimeHistory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/crime-history', async (req, res) => {
    try {
        const crimeHistories = await CrimeHistory.findAll();
        res.json(crimeHistories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Convictions Routes
router.post('/convictions', async (req, res) => {
    try {
        const conviction = await Conviction.create(req.body);
        res.status(201).json(conviction);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/convictions', async (req, res) => {
    try {
        const convictions = await Conviction.findAll();
        res.json(convictions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DutyRoster Routes
router.post('/duty-roster', async (req, res) => {
    try {
        const dutyRoster = await DutyRoster.create(req.body);
        res.status(201).json(dutyRoster);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/duty-roster', async (req, res) => {
    try {
        const dutyRosters = await DutyRoster.findAll();
        res.json(dutyRosters);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// BailRecords Routes
router.post('/bail-records', async (req, res) => {
    try {
        const bailRecord = await BailRecord.create(req.body);
        res.status(201).json(bailRecord);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/bail-records', async (req, res) => {
    try {
        const bailRecords = await BailRecord.findAll();
        res.json(bailRecords);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;