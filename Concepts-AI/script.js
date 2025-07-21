const API_KEY = "AIzaSyBIhwFpPBq-K_dwS_Ri1EQLKQ5dye551qU";

async function generateConcept() {
  const topic = document.getElementById('topicInput').value.trim();
  const explanationEl = document.getElementById('explanation');
  const previewEl = document.getElementById('livePreview');

  if (!topic) {
    alert("Please enter a topic");
    return;
  }

  explanationEl.innerHTML = "🔄 Generating explanation...";
  previewEl.srcdoc = "";

  try {
    const explanationRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Explain the topic "${topic}" in simple English. Include one HTML, CSS, and JavaScript example combined in one code block.`
          }]
        }]
      })
    });

    const explanationData = await explanationRes.json();
    const explanationText = explanationData.candidates?.[0]?.content?.parts?.[0]?.text || "No explanation generated.";
    explanationEl.innerHTML = marked.parse(explanationText);

    // Extract HTML block (including CSS/JS)
    const codeMatch = explanationText.match(/```html([\s\S]*?)```/);
    if (codeMatch) {
      const code = codeMatch[1].trim();
      const fullStyledHTML = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: 'Segoe UI', sans-serif;
              margin: 20px;
              background: #f9f9ff;
              color: #333;
            }
            h1, h2, h3 {
              color: #5c6bc0;
            }
            .box {
              border: 2px solid #5c6bc0;
              padding: 1rem;
              border-radius: 10px;
              box-shadow: 0 0 10px rgba(0,0,0,0.1);
              background-color: white;
              margin: 1rem 0;
              transition: transform 0.3s ease;
            }
            .box:hover {
              transform: scale(1.02);
            }
            button {
              background: #5c6bc0;
              color: white;
              border: none;
              padding: 10px 20px;
              border-radius: 5px;
              cursor: pointer;
              transition: background 0.3s ease;
            }
            button:hover {
              background: #3f51b5;
            }
          </style>
        </head>
        <body>
          ${code}
        </body>
        </html>
      `;
      previewEl.setAttribute("data-code", fullStyledHTML);
    }
  } catch (err) {
    explanationEl.innerHTML = `<p style="color: red">❌ Error: ${err.message}</p>`;
  }
}

function runCode() {
  const code = document.getElementById('livePreview').getAttribute('data-code');
  if (code) {
    document.getElementById('livePreview').srcdoc = code;
  } else {
    alert("No code snippet found to run.");
  }
}
