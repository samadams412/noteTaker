const express = require('express');
const fs = require('fs');
const util = require('util');
const path = require('path');

const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

// Set up Server
const app = express();
const PORT = process.env.PORT || 3001;

// Express Middleware
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static("./public"));

// API Route for GET request
app.get("/api/notes", function(req, res) {
    readFileAsync("./db/db.json", "utf-8").then(function(data) {
        notes = [].concat(JSON.parse(data))
        res.json(notes);
    })
});

// API Route for POST request
app.post("/api/notes", function(req, res) {
    const note = req.body;
    readFileAsync("./db/db.json", "utf-8").then(function(data) {
        const notes = [].concat(JSON.parse(data));
        note.id = notes.length +1;
        notes.push(note);
        return notes;
    }).then(function(notes) {
        writeFileAsync("./db/db.json", JSON.stringify(notes))
        res.json(note);
    })
});

// API Route for Delete request
app.delete("/api/notes/:id", function(req, res) {
    const idDelete = parseInt(req.params.id);
    readFileAsync("./db/db.json", "utf-8").then(function(data) {
        const notes = [].concat(JSON.parse(data));
        const newNotes = [];
        for(let i = 0; i <notes.length; i++) {
            if(idDelete !== notes[i].id) {
                newNotes.push(notes[i])
            } 
        }
        return newNotes;
    }).then(function(notes) {
        writeFileAsync("./db/db.json", JSON.stringify(notes))
        res.send('Save Successful');
    })
})
// HTML Routes
app.get("/notes", function(req, res) {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("/", function(req, res) {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

// Listening
app.listen(PORT, () => console.log(`App listening on port http://localhost:${PORT}`));