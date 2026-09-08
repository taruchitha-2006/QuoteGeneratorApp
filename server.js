const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const db = new sqlite3.Database("./quotes.db");

db.run(`
    CREATE TABLE IF NOT EXISTS favorites (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        quote TEXT NOT NULL,
        author TEXT NOT NULL
    )
`);

app.get("/api/favorites", (req, res) => {
    db.all(
        "SELECT * FROM favorites ORDER BY id DESC",
        [],
        (err, rows) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            res.json(rows);
        }
    );
});

app.post("/api/favorites", (req, res) => {
    const { quote, author } = req.body;

    if (!quote || !author) {
        return res.status(400).json({
            error: "Quote and author are required"
        });
    }

    db.run(
        "INSERT INTO favorites (quote, author) VALUES (?, ?)",
        [quote, author],
        function (err) {
            if (err) {
                return res.status(500).json({
                    error: err.message
                });
            }

            res.json({
                id: this.lastID,
                quote,
                author
            });
        }
    );
});

app.listen(PORT, () => {
    console.log(`Quote Generator running on port ${PORT}`);
});