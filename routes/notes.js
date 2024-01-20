const express = require('express');
const router = express.Router();
const fetch_user = require('../middleware/fetchuser');
const Notes = require('../models/Notes');
const { body, validationResult } = require('express-validator');

// Route 1: Get all notes using GET "/api/auth/getuser" LOGIN required
router.get('/fetchallnotes', fetch_user, async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.user.id });
        res.json(notes)
    } catch (error) {
        console.error(error.message);
        res.status(500).send("fetch all note ke try me kuch bhand he")
    }
})

// Route 2: Add a new note using PORT "/api/auth/addnote" LOGIN required
router.post('/addnote', fetch_user,
    [
        body('title', "title dal").isLength({ min: 3 }),
        body('description', "describe your note").isLength({ min: 15 })
    ], async (req, res) => {

        try {
            // check for error and send bad request for errors
            const errors_my = validationResult(req);
            if (!errors_my.isEmpty()) {
                return res.status(400).json({ errors: errors_my.array() })
            }

            // adding a note 
            const { title, description, tag } = req.body;
            const note = new Notes({
                title, description, tag, user: req.user.id
            })
            const savedNote = await note.save();

            res.json(savedNote)
        } catch (error) {
            console.error(error.message);
            res.status(500).send("add a note ke try me kuch bhand he")
        }
    });

// Route 3: Update a note PORT "updatenote" LOGIN required
router.put('/updatenote/:id', fetch_user,
    async (req, res) => {
        try {
            const { title, description, tag } = req.body;

            // create newNotes object
            const newNote = {};
            if (title) { newNote.title = title };
            if (description) { newNote.description = description };
            if (tag) { newNote.tag = tag };

            // find the note to be updated and update
            let note = await Notes.findById(req.params.id);
            if (!note) { return res.status(404).send("Not Found") }

            // check authority
            if (note.user.toString() !== req.user.id) {
                return res.status(401).send('Not Allowed');
            }

            note = await Notes.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
            res.json({ note })
        } catch (error) {
            console.error(error.message);
            res.status(500).send("update a note ke try me kuch bhand he")
        }
    }
)

// Route 4: Delete a note PORT "deletenote" LOGIN required
router.delete('/deletenote/:id', fetch_user,
    async (req, res) => {
        try {
            const { title, description, tag } = req.body;

            // find the note to be deleted and delete
            let note = await Notes.findById(req.params.id);
            if (!note) { return res.status(404).send("Not Found") }

            // check authority
            if (note.user.toString() !== req.user.id) {
                return res.status(401).send('Not Allowed');
            }

            note = await Notes.findByIdAndDelete(req.params.id)
            res.json({ "message": "note has been deleted" })

        } catch (error) {
            console.error(error.message);
            res.status(500).send("delete a note ke try me kuch bhand he")
        }
    }
)

module.exports = router;