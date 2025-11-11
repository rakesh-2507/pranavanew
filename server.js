process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

import dotenv from "dotenv";
import express from "express";
import fetch from "node-fetch";
import bodyParser from "body-parser";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// ✅ Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ✅ Proper __dirname handling
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Serve static files from "public" folder
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());

// ✅ Load credentials from .env
const API_KEY = process.env.API_KEY;
const SENDER_ID = process.env.SENDER_ID;

// ✅ Route to handle SMS sending
app.post("/send-sms", async (req, res) => {
  const { name, mobile } = req.body;

  if (!name || !mobile) {
    return res.status(400).json({ success: false, error: "Missing name or mobile" });
  }

  try {
    // ✅ Approved template variables
    const projectName = "Greenwich Estates";

    // ✅ Use var1, var2 instead of embedding directly
    const url = `http://mysmsshop.in/V2/http-api.php?apikey=${API_KEY}&senderid=${SENDER_ID}&number=91${mobile}&templateid=1707174884480272903&var1=${encodeURIComponent(
      name
    )}&var2=${encodeURIComponent(projectName)}&format=json`;

    const response = await fetch(url);
    const text = await response.text();

    console.log(`${new Date().toISOString()} - ${name} (${mobile}) - ${text}`);

    res.json({ success: true, response: text });
  } catch (err) {
    console.error("Error sending SMS:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ✅ Start server
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
