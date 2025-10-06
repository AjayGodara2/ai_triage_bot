// server.js
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors'); // ✅ add this

const app = express();
const port = process.env.PORT || 5000;

// -----------------------------
// Enable CORS
// -----------------------------
app.use(cors({
  origin: 'http://localhost:3000', // allow frontend requests
  methods: ['GET','POST','PUT','DELETE'],
  credentials: true
}));

// -----------------------------
// Middleware to parse JSON bodies
// -----------------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// -----------------------------
// Load CSV data into memory
// -----------------------------
const csvFilePath = path.join(__dirname, 'symptoms_disease.csv');
let SYMPTOM_DB = {}; // { symptom: [disease1, disease2,...] }

try {
  const csvData = fs.readFileSync(csvFilePath, 'utf8').split('\n');
  const header = csvData[0].split(',').slice(1);

  csvData.slice(1).forEach(row => {
    const cols = row.split(',');
    const diseaseName = cols[0].trim();
    cols.slice(1).forEach((val, idx) => {
      if (val.trim() === '1') {
        const symptom = header[idx].trim();
        if (!SYMPTOM_DB[symptom]) SYMPTOM_DB[symptom] = [];
        SYMPTOM_DB[symptom].push(diseaseName);
      }
    });
  });

  console.log('CSV file loaded into memory!');
} catch (err) {
  console.error('Error reading CSV file:', err);
}

// -----------------------------
// Emergency keywords
// -----------------------------
const EMERGENCY_KEYWORDS = [
  "chest pain", "difficulty breathing", "seizure", "unconscious",
  "suicidal", "severe bleeding", "stroke", "allergic reaction",
  "sudden weakness", "blurred vision", "confusion", "high fever in infant"
];

// -----------------------------
// Analyze symptoms function
// -----------------------------
function analyzeSymptoms(symptomsText, age = null, gender = null) {
  const text = symptomsText.toLowerCase();
  let possibleConditions = {};

  // Check emergency keywords
  for (const keyword of EMERGENCY_KEYWORDS) {
    if (text.includes(keyword)) {
      return {
        conditions: ["Requires immediate evaluation"],
        recommendation: "emergency",
        reason: `Emergency keyword detected: '${keyword}'`,
        actions: [
          "Call emergency services immediately",
          "Do not wait for symptoms to worsen",
          "If alone, contact someone to stay with you"
        ]
      };
    }
  }

  // Match symptoms from CSV
  Object.entries(SYMPTOM_DB).forEach(([symptom, diseases]) => {
    if (text.includes(symptom)) {
      diseases.forEach(disease => {
        possibleConditions[disease] = (possibleConditions[disease] || 0) + 1;
      });
    }
  });

  // Sort by matching symptoms
  const sortedConditions = Object.entries(possibleConditions)
    .sort((a,b) => b[1]-a[1])
    .map(entry => entry[0]);

  // Determine recommendation
  let recommendation = "home";
  let reason = "Symptoms appear mild and self-manageable";

  if (sortedConditions.length > 0) {
    recommendation = "doctor";
    reason = "Symptoms match known diseases";

    if (age !== null && (age < 3 || age > 65)) {
      recommendation = "doctor";
      reason = "High-risk age group, see a doctor";
    }

    if (gender && gender.toLowerCase() === "female") {
      if (text.includes("abdominal pain") || text.includes("vaginal discharge")) {
        recommendation = "doctor";
        reason = "Gender-specific symptom detected";
      }
    }
  }

  let actions = [];
  if (recommendation === "emergency") {
    actions = [
      "Call emergency services immediately",
      "Do not wait for symptoms to worsen",
      "If alone, contact someone to stay with you"
    ];
  } else if (recommendation === "doctor") {
    actions = [
      "Schedule a doctor appointment within 24 hours",
      "Monitor symptoms closely",
      "Rest and stay hydrated"
    ];
  } else {
    actions = [
      "Rest and hydration",
      "Over-the-counter medication as needed",
      "Monitor for worsening symptoms"
    ];
  }

  return {
    conditions: sortedConditions.length > 0 ? sortedConditions : ["Non-specific symptoms"],
    recommendation,
    reason,
    actions
  };
}

// -----------------------------
// POST endpoint
// -----------------------------
app.post('/analyze', (req, res) => {
  console.log("Received body:", req.body); // debug
  const { symptoms, age, gender } = req.body || {};

  if (!symptoms || typeof symptoms !== 'string') {
    return res.status(400).json({ error: "Symptoms description is required" });
  }

  const result = analyzeSymptoms(symptoms, age, gender);
  res.json(result);
});

// -----------------------------
// Start server
// -----------------------------
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
