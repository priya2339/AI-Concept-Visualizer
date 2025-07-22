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
    const res = await fetch("http://localhost:3000/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic })
    });

    const data = await res.json();
    const explanationText = data.explanation || "No explanation generated.";

    explanationEl.innerHTML = marked.parse(explanationText);

    const code = data.code;
    if (code) {
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

      // 💾 Save the concept
      await fetch("http://localhost:3000/api/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          explanation: explanationText,
          codeSnippet: code
        })
      });
    }
  } catch (err) {
    explanationEl.innerHTML = `<p style="color: red">❌ Error: ${err.message}</p>`;
  }
}

function runCode() {
  const code = document.getElementById("livePreview").getAttribute("data-code");
  if (code) {
    document.getElementById("livePreview").srcdoc = code;
  } else {
    alert("No code snippet found to run.");
  }
}
