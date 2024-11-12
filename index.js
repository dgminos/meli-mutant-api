import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import axios from 'axios'

const app = express()

// Middleware to enable CORS and parse JSON
app.use(cors());
app.use(express.json())

// Function to check if a DNA is mutant's
function isMutant(dna) {
  if (!dna || !Array.isArray(dna)) return false
  for (const sequence of dna) {
    if (hasConsecutiveLetters(sequence)) return true
  }
  return false
}

// Checks if a string has 4 consecutive identical letters
function hasConsecutiveLetters(sequence) {
  let count = 1
  for (let i = 1; i < sequence.length; i++) {
    if (sequence[i] === sequence[i - 1]) {
      count++
      if (count === 4) return true
    } else {
      count = 1 // if sequence hasn't 4 consecutives letters reset count to 1
    }
  }
  return false
}

const restApiURL = process.env.REST_API_URL
// Endpoint to receive requests and check if the human is a mutant
app.post("/mutant", async (req, res) => {
  const { dna } = req.body;

  try {
    // Make POST request to external API using axios
    const response = await axios.post(restApiURL+ "/mutant", { dna }, {
      headers: {
        "Content-Type": "application/json"
      }
    });

    // If a mutant was detected, return HTTP 200 OK
    if (response.status === 200) {
      return res.status(200).json({ message: "Mutant detected" });
    }
  } catch (error) {
    
// If not mutant or there was an error, return HTTP 403 Forbidden
    if (error.response && error.response.status === 403) {
      return res.status(403).json({ message: "Forbidden" });
    } else {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
});

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})