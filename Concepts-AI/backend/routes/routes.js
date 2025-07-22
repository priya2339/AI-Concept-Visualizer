// const express = require("express");
// const router = express.Router();
// const Concept = require("../models/model");
// require("dotenv").config(); // Keep this

// // No need for: const fetch = require("node-fetch");

// router.post("/generate", async (req, res) => {
//   const { topic } = req.body;
//   console.log("🔍 Topic received from frontend:", topic);

//   try {
//     const response = await fetch(
//       `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.API_KEY}`,
//       {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           contents: [
//             {
//               parts: [
//                 {
//                   text: `Explain the topic "${topic}" in simple English. Include one HTML, CSS, and JavaScript example combined in one code block.`
//                 }
//               ]
//             }
//           ]
//         })
//       }
//     );

//     const json = await response.json();
//     console.log("🌐 Gemini API response:", JSON.stringify(json, null, 2)); // <--- Add this

//     const explanation = json.candidates?.[0]?.content?.parts?.[0]?.text || "";
//     const codeMatch = explanation.match(/```html([\s\S]*?)```/);
//     const code = codeMatch ? codeMatch[1].trim() : null;

//     res.json({ explanation, code });
//   } catch (error) {
//     console.error("❌ Error generating explanation:", error.message);
//     res.status(500).json({ error: "Failed to generate content" });
//   }
// });

// // Other routes (save, get concepts) remain unchanged

// // Save concept
// router.post("/save", async (req, res) => {
//   try {
//     const { topic, explanation, codeSnippet } = req.body;
//     const newConcept = new Concept({ topic, explanation, codeSnippet });
//     await newConcept.save();
//     res.status(201).json({ message: "Concept saved successfully" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Fetch all concepts
// router.get("/concepts", async (req, res) => {
//   try {
//     const concepts = await Concept.find();
//     res.json(concepts);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// module.exports = router;



























// const express = require("express");
// const router = express.Router();
// const Concept = require("../models/model");
// require("dotenv").config();

// // POST: Generate explanation using Gemini API
// router.post("/generate", async (req, res) => {
//   const { topic } = req.body;
//   console.log("🔍 Topic received from frontend:", topic);

//   try {
//     const response = await fetch(
//       `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.API_KEY}`,
//       {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           contents: [
//             {
//               parts: [
//                 {
//                   text: `Explain the topic "${topic}" in simple English. Include one HTML, CSS, and JavaScript example combined in one code block.`
//                 }
//               ]
//             }
//           ]
//         })
//       }
//     );

//     const json = await response.json();
//     console.log("🌐 Gemini API response:", JSON.stringify(json, null, 2));

//     if (json.error) {
//       const { message, code } = json.error;
//       return res
//         .status(503)
//         .json({ error: `Gemini API Error (${code}): ${message}` });
//     }

//     const explanation = json.candidates?.[0]?.content?.parts?.[0]?.text || "";
//     const codeMatch = explanation.match(/```html([\s\S]*?)```/);
//     const code = codeMatch ? codeMatch[1].trim() : null;

//     res.json({ explanation, code });
//   } catch (error) {
//     console.error("❌ Error generating explanation:", error.message);
//     res.status(500).json({ error: "Internal server error. Try again later." });
//   }
// });

// // POST: Save a concept to MongoDB
// router.post("/save", async (req, res) => {
//   try {
//     const { topic, explanation, codeSnippet } = req.body;
//     const newConcept = new Concept({ topic, explanation, codeSnippet });
//     await newConcept.save();
//     res.status(201).json({ message: "Concept saved successfully" });
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // GET: Fetch all concepts
// router.get("/concepts", async (req, res) => {
//   try {
//     const concepts = await Concept.find();
//     res.json(concepts);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// module.exports = router;





























const express = require("express");
const router = express.Router();
const Concept = require("../models/model");
require("dotenv").config();

// POST: Generate explanation using Gemini API
router.post("/generate", async (req, res) => {
  const { topic } = req.body;

  if (!topic || topic.trim() === "") {
    return res.status(400).json({ error: "Topic is required." });
  }

  console.log("🔍 Topic received from frontend:", topic);

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Explain the topic "${topic}" in simple English. Include one HTML, CSS, and JavaScript example combined in one code block.`
                }
              ]
            }
          ]
        })
      }
    );

    const json = await response.json();
    console.log("🌐 Gemini API response:", JSON.stringify(json, null, 2));

    if (json.error) {
      return res.status(503).json({
        error: `Gemini API Error (${json.error.code}): ${json.error.message}`
      });
    }

    const explanation = json?.candidates?.[0]?.content?.parts?.[0]?.text || "No explanation found.";

    // Extract code block
    const codeMatch = explanation.match(/```html([\s\S]*?)```/);
    const code = codeMatch ? codeMatch[1].trim() : null;

    res.json({ explanation, code });
  } catch (error) {
    console.error("❌ Error generating explanation:", error.message);
    res.status(500).json({ error: "Internal server error. Try again later." });
  }
});

// POST: Save a concept to MongoDB
router.post("/save", async (req, res) => {
  try {
    const { topic, explanation, codeSnippet } = req.body;

    if (!topic || !explanation || !codeSnippet) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const newConcept = new Concept({ topic, explanation, codeSnippet });
    await newConcept.save();
    res.status(201).json({ message: "✅ Concept saved successfully." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET: Fetch all concepts
router.get("/concepts", async (req, res) => {
  try {
    const concepts = await Concept.find();
    res.json(concepts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
