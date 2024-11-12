import express from 'express'
import cors from 'cors'

const app = express()
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
// Endpoint POST /mutant
const restApiURL = "https://meli-mutant-api.onrender.com"

app.post(restApiURL+"/mutant/", (req, res) => {
  const { dna } = req.body
  if (isMutant(dna)) {
    return res.status(200).json({ message: "Mutant detected" })
  } else {
    return res.status(403).json({ message: "Forbidden" })
  }
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
