import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import axios from 'axios'

const app = express()

// Middleware to enable CORS and parse JSON
app.use(cors());
app.use(express.json())


// URL of the external API to which the POST request will be made
const restApiURL = "https://meli-mutant-api.onrender.com/mutant";

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


// Endpoint to receive requests and check if the human is a mutant
app.post("/mutant", async (req, res) => {
  const { dna } = req.body;

  try {
   
// Check if the DNA sequence corresponds to a mutant
    if (isMutant(dna)) {
      // If it is a mutant, make the HTTP POST request to the external API
      const response = await axios.post(restApiURL, { dna }, {
        headers: { "Content-Type": "application/json" }
      });
      // If the response is 200 OK, it means it is a mutant
      if (response.status === 200) {
        return res.status(200).json({ message: "Mutant detected" });
      }
    } else {
      // If not a mutant, respond with Forbidden 403
      return res.status(403).json({ message: "Forbidden: Not a mutant" });
    }
  } catch (error) {
    // Error handling (external API request failed)
    console.error('Error during mutation check:', error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})