const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

const FICHIER_DONNEES = "donnees.json";

// Enregistrement des données reçues
app.post("/collect", (req, res) => {
  let existingData = [];
  if (fs.existsSync(FICHIER_DONNEES)) {
    try {
      existingData = JSON.parse(fs.readFileSync(FICHIER_DONNEES));
      if (!Array.isArray(existingData)) existingData = [];
    } catch (err) {
      existingData = [];
    }
  }
  existingData.push(req.body);
  fs.writeFileSync(FICHIER_DONNEES, JSON.stringify(existingData, null, 2));
  res.json({ message: "Données enregistrées avec succès" });
});

// Lecture des données enregistrées
app.get("/data", (req, res) => {
  if (fs.existsSync(FICHIER_DONNEES)) {
    const contenu = fs.readFileSync(FICHIER_DONNEES);
    res.json(JSON.parse(contenu));
  } else {
    res.status(404).json({ message: "Aucune donnée collectée pour le moment." });
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`🚀 Serveur en écoute sur le port ${PORT}`));