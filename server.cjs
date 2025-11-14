// // server.cjs
// // Paste this file into your backend folder (overwrite existing server.cjs).
// require("dotenv").config();
// const express = require("express");
// const multer = require("multer");
// const fetch = require("node-fetch"); // keep for compatibility; Node 18+ has global fetch
// const upload = multer({ storage: multer.memoryStorage() });
// const app = express();
// const cors = require("cors");
// app.use(cors()); // allow all origins during development

// app.use(express.json({ limit: "10mb" }));

// // --- OpenAI compatibility wrapper ---
// let openaiClient = null;
// let openaiMode = null; // "old" or "new"

// try {
//   const OpenAIPkg = require("openai");
//   if (OpenAIPkg.Configuration && OpenAIPkg.OpenAIApi) {
//     const { Configuration, OpenAIApi } = OpenAIPkg;
//     const cfg = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
//     openaiClient = new OpenAIApi(cfg);
//     openaiMode = "old";
//     console.log("OpenAI client: old OpenAIApi style");
//   } else {
//     const OpenAI = OpenAIPkg.default || OpenAIPkg;
//     openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
//     openaiMode = "new";
//     console.log("OpenAI client: new OpenAI style");
//   }
// } catch (e) {
//   console.error("Failed to initialize OpenAI client. Install `openai` package.", e);
//   process.exit(1);
// }

// async function callChatCompletion({ model, messages, max_tokens = 1000, temperature = 0.0 }) {
//   if (openaiMode === "old") {
//     const resp = await openaiClient.createChatCompletion({
//       model,
//       messages,
//       max_tokens,
//       temperature,
//     });
//     return resp.data.choices?.[0]?.message?.content || "";
//   } else {
//     const resp = await openaiClient.chat.completions.create({
//       model,
//       messages,
//       max_tokens,
//       temperature,
//     });
//     return resp.choices?.[0]?.message?.content || "";
//   }
// }

// // ---------- Utilities ----------
// const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&q=80";

// function extractJsonFromText(raw) {
//   if (!raw) return null;
//   const firstBrace = raw.indexOf("{");
//   const lastBrace = raw.lastIndexOf("}");
//   if (firstBrace >= 0 && lastBrace > firstBrace) {
//     const possible = raw.slice(firstBrace, lastBrace + 1);
//     try {
//       return JSON.parse(possible);
//     } catch (e) {}
//   }
//   const firstArr = raw.indexOf("[");
//   const lastArr = raw.lastIndexOf("]");
//   if (firstArr >= 0 && lastArr > firstArr) {
//     const possible = raw.slice(firstArr, lastArr + 1);
//     try {
//       return { items: JSON.parse(possible) };
//     } catch (e) {}
//   }
//   return null;
// }

// // ---------- Improved image search ----------
// async function findImageUrl(query) {
//   try {
//     const ACCESS_KEY = process.env.UNSPLASH_ACCESS_KEY;
//     if (!ACCESS_KEY) return "";
//     const attempts = [
//       query,
//       `${query} food`,
//       `${query} dish`,
//       query.replace(/\b(dish|food)\b/gi, "").trim(),
//       `${query} indian food`,
//       `${query} top view`,
//     ].filter(Boolean);

//     for (const q of attempts) {
//       try {
//         const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(q)}&per_page=1&client_id=${ACCESS_KEY}`;
//         const res = await fetch(url);
//         if (!res.ok) {
//           console.warn("Unsplash non-ok for query:", q, res.status);
//           continue;
//         }
//         const data = await res.json();
//         if (data.results && data.results[0]) {
//           console.log(`Unsplash hit for query="${q}" => ${data.results[0].urls.small}`);
//           return data.results[0].urls.regular || data.results[0].urls.small || "";
//         }
//       } catch (e) {
//         console.warn("Unsplash attempt failed for q=", q, e);
//       }
//     }
//   } catch (e) {
//     console.error("findImageUrl outer error", e);
//   }
//   return "";
// }

// // ---------- Improved heading detection & category assignment ----------
// function detectHeadingsAndAssignCategories(ocrText, items) {
//   const lines = ocrText.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
//   const looksLikeItem = lines.map((line) => {
//     const hasPrice = /(?:₹|INR|Rs\.?|₹\s?)\s*\d/.test(line) || /\d{2,}\s*$/.test(line);
//     const trailingDigits = /\b\d{2,}\b/.test(line);
//     return hasPrice || trailingDigits;
//   });

//   const headings = [];
//   for (let i = 0; i < lines.length; i++) {
//     const line = lines[i];
//     if (line.length > 30) continue;
//     if (!/^[A-Za-z &'(),-]+$/.test(line)) continue;
//     const lookAheadLimit = Math.min(i + 6, lines.length - 1);
//     let foundItemAhead = false;
//     for (let k = i + 1; k <= lookAheadLimit; k++) {
//       if (looksLikeItem[k]) {
//         foundItemAhead = true;
//         break;
//       }
//     }
//     if (foundItemAhead) headings.push({ line, index: i });
//   }

//   if (headings.length === 0) {
//     for (let i = 0; i < lines.length; i++) {
//       const line = lines[i];
//       if (line.length <= 40 && /^[A-Z][A-Za-z ]+$/.test(line)) {
//         headings.push({ line, index: i });
//       }
//     }
//   }

//   if (headings.length === 0) return items;

//   function findNearestHeadingBefore(lineIndex) {
//     let chosen = "";
//     for (let h = headings.length - 1; h >= 0; h--) {
//       if (headings[h].index <= lineIndex) {
//         chosen = headings[h].line;
//         break;
//       }
//     }
//     return chosen;
//   }

//   for (const it of items) {
//     if (it.category && it.category.trim() !== "") continue;
//     const name = (it.name || "").toLowerCase().replace(/[^\w\s]/g, "").trim();
//     if (!name) continue;

//     let matchedLineIndex = -1;
//     for (let i = 0; i < lines.length; i++) {
//       const norm = lines[i].toLowerCase().replace(/[^\w\s]/g, "");
//       if (norm.includes(name) || name.includes(norm) || norm.startsWith(name.split(" ")[0])) {
//         matchedLineIndex = i;
//         break;
//       }
//     }

//     if (matchedLineIndex === -1) {
//       const tokens = name.split(/\s+/).filter(Boolean);
//       if (tokens.length >= 1) {
//         const prefix = tokens.slice(0, 2).join(" ");
//         for (let i = 0; i < lines.length; i++) {
//           const norm = lines[i].toLowerCase().replace(/[^\w\s]/g, "");
//           if (norm.includes(prefix)) {
//             matchedLineIndex = i;
//             break;
//           }
//         }
//       }
//     }

//     if (matchedLineIndex >= 0) {
//       const chosenHeading = findNearestHeadingBefore(matchedLineIndex);
//       if (chosenHeading) {
//         it.category = chosenHeading;
//         continue;
//       }
//     }

//     const keywordsToCategory = [
//       { kws: ["biryani", "rice"], cat: "Main Course" },
//       { kws: ["tikka", "chicken", "paneer", "curry", "butter", "palak"], cat: "Main Course" },
//       { kws: ["gulab", "laddu", "jalebi", "kaju", "ras malai"], cat: "Dessert" },
//       { kws: ["salad", "chutney", "starter", "appetizer"], cat: "Starters" },
//     ];
//     for (const map of keywordsToCategory) {
//       for (const kw of map.kws) {
//         if (name.includes(kw)) {
//           it.category = map.cat;
//           break;
//         }
//       }
//       if (it.category) break;
//     }
//   }

//   return items;
// }

// // ---------- LLM parsing ----------
// async function parseMenuTextWithLLM(ocrText) {
//   const prompt = `
// You are a strict JSON-only parser that converts raw restaurant menu text into a clean JSON structure.

// INPUT:
// - The variable OCR_TEXT contains text extracted from a menu (by OCR). The text may include section headers like "Starters", "Breads", "Main Course", "Desserts", currency symbols (₹, INR, Rs, $), item names, item descriptions (often on the next line or after the item), and prices.
// - If a description for a dish is present in the OCR text, keep that description in the output. Do NOT override descriptions found in OCR with a generated one.
// - If a description is NOT present in OCR for an item, generate a short appetizing description (one sentence, 10-25 words).
// - If the OCR text contains clear section headers (one-word or multi-word headings such as "Starters", "Appetizers", "Main Course", "Vegetarian", "Sides", "Desserts"), use them as the category for items that appear under that heading (assign the nearest previous heading to each item).
// - For images: provide an "imageQuery" string (short, e.g. "paneer butter masala top view") for each item. The server will turn it into an imageURL when possible.
// - Price should be a number (no commas in decimals). If price is missing or can't be parsed, set price to 0.

// OUTPUT:
// Return *only* a JSON object with a single key "items" whose value is an array of objects.
// Each object in items must have these keys:
// - name (string)
// - price (number)
// - category (string)
// - description (string)
// - imageQuery (string)
// - veg (boolean) optional
// - spicy (boolean) optional

// Do NOT write any explanation, headings, or markdown. STRICT JSON ONLY.

// Here is the OCR_TEXT to parse:
// """${ocrText}"""
// `;

//   const raw = await callChatCompletion({
//     model: "gpt-4o-mini",
//     messages: [
//       { role: "system", content: "You parse menu text into strict JSON output only." },
//       { role: "user", content: prompt },
//     ],
//     max_tokens: 1200,
//     temperature: 0.0,
//   });

//   let json = extractJsonFromText(raw);
//   if (json && Array.isArray(json.items)) return json.items;

//   try {
//     const fallbackPrompt = `
// Please return a JSON object with a single key "items", value is an array of objects with keys name, price, category, description, imageQuery.
// Here is the OCR text:
// """${ocrText}"""
// Return only JSON.
// `;
//     const raw2 = await callChatCompletion({
//       model: "gpt-4o-mini",
//       messages: [{ role: "user", content: fallbackPrompt }],
//       max_tokens: 1200,
//       temperature: 0.0,
//     });
//     const json2 = extractJsonFromText(raw2);
//     if (json2 && Array.isArray(json2.items)) return json2.items;
//   } catch (e) {
//     console.error("LLM fallback parse failed", e);
//   }

//   console.error("Failed to parse OCR text into JSON. Model raw output:\n", raw);
//   return [];
// }

// // ---------- Endpoint ----------
// app.post("/api/enrich-menu", upload.single("file"), async (req, res) => {
//   try {
//     const ocrText = req.body.ocrText || "";
//     let items = await parseMenuTextWithLLM(ocrText);

//     // assign categories if missing
//     items = detectHeadingsAndAssignCategories(ocrText, items);

//     // fix types, descriptions, imageQuery -> imageURL
//     for (const it of items) {
//       it.name = (it.name || "").trim();
//       it.price = it.price ? Number(String(it.price).replace(/[^\d.]/g, "")) : 0;
//       it.category = (it.category || "").trim();
//       it.description = (it.description || "").trim();

//       // only generate description when missing
//       if (!it.description) {
//         try {
//           const desc = await callChatCompletion({
//             model: "gpt-4o-mini",
//             messages: [
//               { role: "system", content: "You generate a 1-sentence menu description for a dish." },
//               { role: "user", content: `Write a 12-20 word appetizing description for: ${it.name}` },
//             ],
//             max_tokens: 60,
//             temperature: 0.7,
//           });
//           it.description = (desc || "").trim();
//         } catch (e) {
//           console.warn("Description generation failed for", it.name, e);
//           it.description = it.description || "";
//         }
//       }

//       const maybeQuery = (it.imageQuery || "").trim();
//       const fallbackQuery = `${it.category || ""} ${it.name} dish`.trim();
//       const queryToUse = maybeQuery || fallbackQuery || `${it.name} food`;
//       it.imageQuery = queryToUse;

//       let imageUrl = await findImageUrl(queryToUse);
//       if (!imageUrl) {
//         imageUrl = (await findImageUrl(it.name)) || "";
//       }
//       it.imageURL = imageUrl || PLACEHOLDER_IMAGE;
//     }

//     // debug log to inspect what will be returned
//     console.log(
//       "Enriched items (first 8):",
//       items.slice(0, 8).map((it) => ({
//         name: it.name,
//         price: it.price,
//         category: it.category,
//         imageQuery: it.imageQuery,
//         imageURL: it.imageURL,
//       }))
//     );

//     res.json({ items });
//   } catch (err) {
//     console.error("enrich-menu error", err);
//     res.status(500).json({ error: "Failed to enrich menu" });
//   }
// });

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log("Server listening on", PORT));











// // server.cjs
// require("dotenv").config();
// const express = require("express");
// const multer = require("multer");
// const { fetch } = require("undici"); // use undici fetch
// const cors = require("cors");

// const app = express();
// app.use(cors());
// app.use(express.json({ limit: "10mb" }));
// const upload = multer({ storage: multer.memoryStorage() });

// /* ---------------- OpenAI setup ---------------- */
// let openaiClient = null;
// let openaiMode = null;
// try {
//   const OpenAIPkg = require("openai");
//   if (OpenAIPkg.Configuration && OpenAIPkg.OpenAIApi) {
//     const { Configuration, OpenAIApi } = OpenAIPkg;
//     const cfg = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
//     openaiClient = new OpenAIApi(cfg);
//     openaiMode = "old";
//   } else {
//     const OpenAI = OpenAIPkg.default || OpenAIPkg;
//     openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
//     openaiMode = "new";
//   }
// } catch (e) {
//   console.error("❌ OpenAI init failed:", e);
//   process.exit(1);
// }

// async function callChatCompletion({ model, messages, max_tokens = 1000, temperature = 0 }) {
//   if (openaiMode === "old") {
//     const resp = await openaiClient.createChatCompletion({ model, messages, max_tokens, temperature });
//     return resp.data.choices?.[0]?.message?.content || "";
//   } else {
//     const resp = await openaiClient.chat.completions.create({ model, messages, max_tokens, temperature });
//     return resp.choices?.[0]?.message?.content || "";
//   }
// }

// /* ---------------- Helpers ---------------- */
// const PLACEHOLDER_IMAGE =
//   "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&q=80";

// function extractJsonFromText(raw) {
//   if (!raw) return null;
//   try {
//     const first = raw.indexOf("{");
//     const last = raw.lastIndexOf("}");
//     if (first >= 0 && last > first) return JSON.parse(raw.slice(first, last + 1));
//   } catch {}
//   try {
//     const f = raw.indexOf("[");
//     const l = raw.lastIndexOf("]");
//     if (f >= 0 && l > f) return { items: JSON.parse(raw.slice(f, l + 1)) };
//   } catch {}
//   return null;
// }

// /* --- Improved price extractor --- */
// function findPriceForItem(ocrText, itemName) {
//   if (!ocrText || !itemName) return null;
//   const lines = ocrText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
//   const tokens = itemName.toLowerCase().replace(/[^a-z0-9\s]/g, "").split(/\s+/);
//   const regex = /(?:₹|Rs\.?|INR)?\s*([0-9]{1,4}(?:[.,][0-9]{1,2})?)/g;
//   const candidates = [];

//   for (let i = 0; i < lines.length; i++) {
//     const low = lines[i].toLowerCase();
//     if (tokens.some(t => low.includes(t))) {
//       for (let d = -2; d <= 2; d++) {
//         const idx = i + d;
//         if (idx < 0 || idx >= lines.length) continue;
//         regex.lastIndex = 0;
//         let m;
//         while ((m = regex.exec(lines[idx])) !== null) {
//           const num = Number(m[1].replace(",", "."));
//           if (num > 0) candidates.push({ num, dist: Math.abs(d) });
//         }
//       }
//     }
//   }

//   if (candidates.length) {
//     candidates.sort((a, b) => (a.dist - b.dist) || (a.num - b.num));
//     const good = candidates.find(c => c.num <= 1000);
//     return good ? good.num : candidates[0].num;
//   }

//   const all = [];
//   for (const l of lines) {
//     regex.lastIndex = 0;
//     let m;
//     while ((m = regex.exec(l)) !== null) {
//       const num = Number(m[1].replace(",", "."));
//       if (num > 10 && num < 5000) all.push(num);
//     }
//   }
//   if (all.length) {
//     all.sort((a, b) => a - b);
//     return all[Math.floor(all.length / 3)];
//   }
//   return null;
// }

// /* --- Unsplash image search --- */
// async function findImageUrl(query) {
//   try {
//     const key = process.env.UNSPLASH_ACCESS_KEY;
//     if (!key) return "";
//     const tries = [
//       query,
//       `${query} food`,
//       `${query} dish`,
//       `${query} indian food`,
//       `${query} top view`,
//       `${query} plated`,
//       `${query} restaurant`,
//     ];
//     for (const q of tries) {
//       console.log("🔍 Unsplash query:", q);
//       const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(q)}&per_page=1&client_id=${key}`;
//       const res = await fetch(url);
//       if (!res.ok) continue;
//       const data = await res.json();
//       if (data.results?.[0]) {
//         const img = data.results[0].urls?.regular || data.results[0].urls?.small;
//         console.log(`✅ Found image for "${q}" -> ${img}`);
//         return img;
//       }
//     }
//   } catch (e) {
//     console.error("Image search failed:", e);
//   }
//   return "";
// }

// /* --- Heading detection --- */
// function detectHeadingsAndAssignCategories(ocrText, items) {
//   const lines = ocrText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
//   const headings = [];
//   for (let i = 0; i < lines.length; i++) {
//     const l = lines[i];
//     if (/^[A-Za-z &]+$/.test(l) && l.length <= 30) headings.push({ line: l, index: i });
//   }
//   const nearest = idx => {
//     for (let i = headings.length - 1; i >= 0; i--) if (headings[i].index <= idx) return headings[i].line;
//     return "";
//   };
//   for (const it of items) {
//     if (it.category) continue;
//     const n = (it.name || "").toLowerCase();
//     for (let i = 0; i < lines.length; i++) {
//       if (lines[i].toLowerCase().includes(n)) {
//         const h = nearest(i);
//         if (h) it.category = h;
//         break;
//       }
//     }
//     if (!it.category && /gulab|laddu|jalebi|sweet|dessert/.test(n)) it.category = "Dessert & Sweets";
//     if (!it.category && /chicken|paneer|biryani|tikka|main/.test(n)) it.category = "Main Course";
//   }
//   return items;
// }

// /* --- LLM parse --- */
// async function parseMenuTextWithLLM(ocrText) {
//   const prompt = `
// Extract dishes as JSON: { "items":[{"name":"","price":0,"category":"","description":"","imageQuery":""}] }
// TEXT:
// """${ocrText}"""`;
//   const raw = await callChatCompletion({
//     model: "gpt-4o-mini",
//     messages: [{ role: "user", content: prompt }],
//     max_tokens: 1400,
//   });
//   const json = extractJsonFromText(raw);
//   return json?.items || [];
// }

// // ---------- Minimal local-only debug handler (paste to replace existing /api/enrich-menu) ----------
// app.post("/api/enrich-menu", upload.single("file"), async (req, res) => {
//   try {
//     console.log("=== DEBUG /api/enrich-menu (local-only) called ===");
//     console.log("Request headers origin:", req.headers.origin || "none");
//     if (req.file) console.log("Uploaded file:", req.file.originalname, "size:", req.file.size);
//     const ocrText = (req.body && req.body.ocrText) ? String(req.body.ocrText) : "";
//     console.log("OCR_TEXT preview (first 1000 chars):", ocrText.slice(0, 1000));

//     if (!ocrText || ocrText.trim().length === 0) {
//       return res.status(400).json({ ok: false, error: "ocrText missing or empty" });
//     }

//     // Simple deterministic local parse: split headings -> items by price regex
//     const lines = ocrText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);

//     // find headings (short alpha lines)
//     const headings = [];
//     lines.forEach((ln, i) => {
//       if (/^[A-Za-z &()'-]{2,30}$/.test(ln) && !/\d/.test(ln)) headings.push({ line: ln, index: i });
//     });

//     // price regex for detection
//     const priceRe = /(?:₹|Rs\.?|INR)?\s*([0-9]{1,4}(?:[.,][0-9]{1,2})?)/;

//     const items = [];
//     for (let i = 0; i < lines.length; i++) {
//       const line = lines[i];
//       const m = line.match(priceRe);
//       if (m) {
//         // extract name (text before price) and price numeric
//         const namePart = line.slice(0, m.index).replace(/[\.\-]{2,}/g, " ").trim();
//         const priceNum = Number(m[1].replace(",", "."));
//         // look up nearest heading before this line
//         let category = "";
//         for (let h = headings.length - 1; h >= 0; h--) {
//           if (headings[h].index <= i) { category = headings[h].line; break; }
//         }
//         // look for description on next line if it doesn't contain a price
//         let description = "";
//         if (i + 1 < lines.length && !priceRe.test(lines[i + 1])) description = lines[i + 1].slice(0, 200);
//         items.push({
//           name: namePart || line,
//           price: Number.isFinite(priceNum) ? priceNum : 0,
//           category,
//           description,
//           imageQuery: `${category} ${namePart}`.trim()
//         });
//       }
//     }

//     console.log("DEBUG parsed items (local-only):", items);
//     return res.json({ ok: true, debug: true, items });
//   } catch (err) {
//     console.error("DEBUG handler uncaught error:", err);
//     return res.status(500).json({ ok: false, error: String(err && err.message), stack: err && err.stack });
//   }
// });


// /* ---------------- Start server ---------------- */
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));




// // server.cjs (overwrites previous)
// // Requirements: npm i undici openai multer express cors dotenv
// require("dotenv").config();
// const express = require("express");
// const multer = require("multer");
// const { fetch } = require("undici");
// const cors = require("cors");

// const app = express();
// app.use(cors());
// app.use(express.json({ limit: "10mb" }));
// const upload = multer({ storage: multer.memoryStorage() });

// // ---------- OpenAI compatibility ----------
// let openaiClient = null;
// let openaiMode = null;
// try {
//   const OpenAIPkg = require("openai");
//   if (OpenAIPkg.Configuration && OpenAIPkg.OpenAIApi) {
//     const { Configuration, OpenAIApi } = OpenAIPkg;
//     const cfg = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
//     openaiClient = new OpenAIApi(cfg);
//     openaiMode = "old";
//     console.log("OpenAI client: old style");
//   } else {
//     const OpenAI = OpenAIPkg.default || OpenAIPkg;
//     openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
//     openaiMode = "new";
//     console.log("OpenAI client: new style");
//   }
// } catch (e) {
//   console.error("OpenAI init failed:", e && e.message);
//   process.exit(1);
// }

// async function callChatCompletion({ model, messages, max_tokens = 1000, temperature = 0.0 }) {
//   if (openaiMode === "old") {
//     const resp = await openaiClient.createChatCompletion({ model, messages, max_tokens, temperature });
//     return resp.data.choices?.[0]?.message?.content || "";
//   } else {
//     const resp = await openaiClient.chat.completions.create({ model, messages, max_tokens, temperature });
//     return resp.choices?.[0]?.message?.content || "";
//   }
// }

// // ---------- helpers ----------
// const PLACEHOLDER_IMAGE = "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&q=80";

// function extractJsonFromText(raw) {
//   if (!raw) return null;
//   try {
//     const first = raw.indexOf("{");
//     const last = raw.lastIndexOf("}");
//     if (first >= 0 && last > first) return JSON.parse(raw.slice(first, last + 1));
//   } catch (e) {}
//   try {
//     const f = raw.indexOf("[");
//     const l = raw.lastIndexOf("]");
//     if (f >= 0 && l > f) return { items: JSON.parse(raw.slice(f, l + 1)) };
//   } catch (e) {}
//   return null;
// }

// // Find nearest plausible price from OCR for a given item name
// function findPriceForItem(ocrText, itemName) {
//   if (!ocrText || !itemName) return null;
//   const lines = ocrText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
//   const nameTokens = itemName.toLowerCase().replace(/[^a-z0-9\s]/gi, "").split(/\s+/).filter(Boolean);
//   if (nameTokens.length === 0) return null;

//   const priceRegex = /(?:₹|Rs\.?|INR)?\s*([0-9]{1,4}(?:[.,][0-9]{1,2})?)/g;
//   const candidates = [];

//   for (let i = 0; i < lines.length; i++) {
//     const ln = lines[i].toLowerCase();
//     if (nameTokens.some(t => t && ln.includes(t))) {
//       for (let d = -2; d <= 2; d++) {
//         const idx = i + d;
//         if (idx < 0 || idx >= lines.length) continue;
//         priceRegex.lastIndex = 0;
//         let m;
//         while ((m = priceRegex.exec(lines[idx])) !== null) {
//           const raw = m[1].replace(",", ".");
//           const num = Number(raw);
//           if (!Number.isNaN(num) && num > 0) candidates.push({ num, dist: Math.abs(d) });
//         }
//       }
//     }
//   }

//   if (candidates.length > 0) {
//     // choose closest then smallest (prefer <= 1000)
//     candidates.sort((a, b) => (a.dist - b.dist) || (a.num - b.num));
//     const plausible = candidates.find(c => c.num <= 1000);
//     return plausible ? plausible.num : candidates[0].num;
//   }

//   // fallback: try all numbers and pick a small one
//   const all = [];
//   for (const l of lines) {
//     let mm;
//     priceRegex.lastIndex = 0;
//     while ((mm = priceRegex.exec(l)) !== null) {
//       const n = Number(mm[1].replace(",", "."));
//       if (!Number.isNaN(n) && n > 10 && n < 5000) all.push(n);
//     }
//   }
//   if (all.length) {
//     all.sort((a, b) => a - b);
//     return all[Math.floor(all.length / 3)];
//   }
//   return null;
// }

// // Unsplash image search: try several variants, returning first hit
// async function findImageUrl(query) {
//   const key = process.env.UNSPLASH_ACCESS_KEY;
//   if (!key) return "";
//   const tries = [
//     query,
//     `${query} food`,
//     `${query} dish`,
//     `${query} indian food`,
//     `${query} top view`,
//     `${query} plated`,
//     `${query} closeup`,
//   ].filter(Boolean);

//   for (const q of tries) {
//     try {
//       console.log("Unsplash -> trying:", q);
//       const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(q)}&per_page=1&client_id=${key}`;
//       const resp = await fetch(url);
//       if (!resp.ok) {
//         console.warn("Unsplash non-ok", resp.status, q);
//         continue;
//       }
//       const data = await resp.json();
//       if (data.results?.[0]) {
//         const sel = data.results[0].urls?.regular || data.results[0].urls?.small || "";
//         console.log("Unsplash -> matched:", q, sel);
//         return sel;
//       }
//     } catch (err) {
//       console.warn("Unsplash fetch failed for", q, err && err.message);
//     }
//   }
//   // try one more with just name + 'indian food'
//   try {
//     const lastQ = `${query} indian food top view`;
//     const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(lastQ)}&per_page=1&client_id=${key}`;
//     const resp = await fetch(url);
//     if (resp.ok) {
//       const data = await resp.json();
//       if (data.results?.[0]) {
//         const sel = data.results[0].urls?.regular || data.results[0].urls?.small || "";
//         console.log("Unsplash -> matched fallback:", lastQ, sel);
//         return sel;
//       }
//     }
//   } catch (e) {
//     console.warn("Unsplash fallback failed", e && e.message);
//   }
//   return "";
// }

// // detect headings and assign categories (keeps previous logic)
// function detectHeadingsAndAssignCategories(ocrText, items) {
//   const lines = ocrText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
//   const headings = [];
//   for (let i = 0; i < lines.length; i++) {
//     const l = lines[i];
//     if (/^[A-Za-z &()'-]{2,30}$/.test(l) && !/\d/.test(l)) headings.push({ line: l, index: i });
//   }
//   function nearest(idx) {
//     for (let i = headings.length - 1; i >= 0; i--) if (headings[i].index <= idx) return headings[i].line;
//     return "";
//   }
//   for (const it of items) {
//     if (it.category && it.category.trim()) continue;
//     const n = (it.name || "").toLowerCase();
//     for (let i = 0; i < lines.length; i++) {
//       if (lines[i].toLowerCase().includes(n)) {
//         const h = nearest(i);
//         if (h) it.category = h;
//         break;
//       }
//     }
//     if (!it.category && /gulab|laddu|jalebi|sweet|dessert/.test(n)) it.category = "Dessert & Sweets";
//     if (!it.category && /chicken|paneer|biryani|tikka|main/.test(n)) it.category = "Main Course";
//   }
//   return items;
// }

// // LLM parser - strict JSON request
// async function parseMenuTextWithLLM(ocrText) {
//   const prompt = `
// You are an assistant that MUST return strict JSON only.
// Input: OCR_TEXT contains a printed menu (possibly noisy).
// Output: JSON object with one key "items": array of objects with keys:
// - name (string)
// - price (number)  // numeric price if clearly present; otherwise 0
// - category (string)
// - description (string)
// - imageQuery (string)

// Do NOT output explanations.
// OCR_TEXT:
// """${ocrText}"""
// `;
//   const raw = await callChatCompletion({
//     model: "gpt-4o-mini",
//     messages: [{ role: "user", content: prompt }],
//     max_tokens: 1200,
//     temperature: 0.0,
//   });
//   const parsed = extractJsonFromText(raw);
//   if (!parsed || !Array.isArray(parsed.items)) {
//     console.warn("LLM parse returned no items or invalid JSON. Raw model output preview:", String(raw).slice(0, 500));
//     return [];
//   }
//   return parsed.items;
// }

// // ---------- Robust enrich endpoint (uses LLM + OCR price + Unsplash) ----------
// app.post("/api/enrich-menu", upload.single("file"), async (req, res) => {
//   try {
//     console.log("=== /api/enrich-menu called ===");
//     const ocrText = req.body.ocrText || "";
//     console.log("ocrText length:", (ocrText || "").length);

//     // quick guard
//     if (!ocrText || String(ocrText).trim().length < 3) {
//       console.warn("ocrText empty or short; returning 400");
//       return res.status(400).json({ ok: false, error: "ocrText required" });
//     }

//     // 1) LLM parse (best-effort)
//     let items = await parseMenuTextWithLLM(ocrText);
//     console.log("LLM returned items:", items.length);

//     // 2) assign categories via headings if missing
//     items = detectHeadingsAndAssignCategories(ocrText, items);

//     // 3) post-process each item: prefer OCR price; clamp/validate; image search
//     const processed = [];
//     for (const rawItem of items) {
//       const it = {
//         name: (rawItem.name || "").trim(),
//         llmPrice: rawItem.price ? Number(String(rawItem.price).replace(/[^\d.]/g, "")) : 0,
//         category: (rawItem.category || "").trim(),
//         description: (rawItem.description || "").trim(),
//         imageQuery: (rawItem.imageQuery || "").trim(),
//       };

//       // OCR-extracted price (highest priority)
//       let ocrPrice = null;
//       try {
//         ocrPrice = findPriceForItem(ocrText, it.name);
//       } catch (e) {
//         console.warn("findPriceForItem error for", it.name, e && e.message);
//       }

//       // Determine final price:
//       // - prefer ocrPrice if present and plausible (<=2000)
//       // - else prefer llmPrice if plausible (0 < price <=2000)
//       // - else 0
//       let finalPrice = 0;
//       if (ocrPrice && ocrPrice > 0 && ocrPrice <= 2000) finalPrice = ocrPrice;
//       else if (it.llmPrice && it.llmPrice > 0 && it.llmPrice <= 2000) finalPrice = it.llmPrice;
//       else finalPrice = 0;

//       // Ensure description exists
//       if (!it.description) {
//         try {
//           const desc = await callChatCompletion({
//             model: "gpt-4o-mini",
//             messages: [
//               { role: "system", content: "Create a 1-sentence appetizing menu description (12-20 words)." },
//               { role: "user", content: `Dish: ${it.name}` },
//             ],
//             max_tokens: 60,
//             temperature: 0.7,
//           });
//           it.description = (desc || "").trim();
//         } catch (e) {
//           console.warn("Description LLM failed for", it.name, e && e.message);
//           it.description = it.description || "";
//         }
//       }

//       // Build image query priority: raw imageQuery > category+name > name
//       let q = it.imageQuery || `${it.category} ${it.name}`.trim() || it.name;
//       // try Unsplash
//       let imageURL = "";
//       try {
//         imageURL = await findImageUrl(q);
//         if (!imageURL) {
//           // try name-focused queries
//           imageURL = (await findImageUrl(`${it.name} food`)) || "";
//         }
//         if (!imageURL) {
//           imageURL = (await findImageUrl(`${it.name} indian food top view`)) || "";
//         }
//       } catch (e) {
//         console.warn("Image search exception for", q, e && e.message);
//       }

//       imageURL = imageURL || PLACEHOLDER_IMAGE;

//       processed.push({
//         name: it.name,
//         price: finalPrice,
//         category: it.category,
//         description: it.description,
//         imageQuery: q,
//         imageURL,
//         llmPrice: it.llmPrice,
//         ocrPrice,
//       });
//     }

//     console.log("✅ Enriched (sample):", processed.slice(0, 8).map(p => ({ name: p.name, price: p.price, ocrPrice: p.ocrPrice, llmPrice: p.llmPrice, imageURL: p.imageURL && p.imageURL.slice(0,60) })));

//     // Return debug-rich payload
//     return res.json({ ok: true, debug: true, items: processed });
//   } catch (err) {
//     console.error("ERROR /api/enrich-menu:", err && err.stack ? err.stack : err);
//     return res.status(500).json({ ok: false, error: err?.message || "server error", stack: err?.stack ? String(err.stack).split("\n").slice(0,20).join("\n") : null });
//   }
// });

// // start
// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

// server.cjs - Minimal debug server with fixed description logic
require("dotenv").config();
const express = require("express");
const multer = require("multer");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json({ limit: "12mb" }));
const upload = multer({ storage: multer.memoryStorage() });

// global guards
process.on("unhandledRejection", (r) => { console.error("UNHANDLED REJECTION:", r && (r.stack || r)); });
process.on("uncaughtException", (err) => { console.error("UNCAUGHT EXCEPTION:", err && (err.stack || err)); });

app.post("/api/enrich-menu", upload.single("file"), (req, res) => {
  try {
    console.log("=== DEBUG /api/enrich-menu called ===");
    console.log("Headers origin:", req.headers.origin || "none");
    if (req.file) console.log("Received file:", req.file.originalname, "size:", req.file.size);

    const raw = req.body && req.body.ocrText ? String(req.body.ocrText) : "";
    // normalize literal escaped newlines if present
    const ocrText = raw.replace(/\\r\\n/g, "\n").replace(/\\n/g, "\n").replace(/\r/g, "").trim();
    console.log("OCR text length:", ocrText.length);
    console.log("OCR preview (first 400 chars):");
    console.log(ocrText.slice(0, 400).replace(/\n/g, "\\n"));

    if (!ocrText) {
      console.warn("ocrText missing or empty");
      return res.status(400).json({ ok: false, error: "ocrText missing or empty" });
    }

    const lines = ocrText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
    const priceRe = /(?:₹|Rs\.?|INR)?\s*([0-9]{1,4}(?:[.,][0-9]{1,2})?)/;

    // heading detection helper (same rules as before)
    function isHeadingLine(s) {
      if (!s) return false;
      // short alpha-only-ish lines without digits are likely headings
      return /^[A-Za-z &()'’\-,]{2,40}$/.test(s) && !/\d/.test(s);
    }

    const headings = [];
    lines.forEach((ln, i) => {
      if (isHeadingLine(ln)) headings.push({ line: ln, index: i });
    });

    const items = [];
    for (let i = 0; i < lines.length; i++) {
      const m = lines[i].match(priceRe);
      if (m) {
        const name = lines[i].slice(0, m.index).replace(/[\.\-]{2,}/g, " ").trim() || lines[i];
        const price = Number(m[1].replace(",", "."));
        // find nearest heading before this line
        let category = "";
        for (let h = headings.length - 1; h >= 0; h--) {
          if (headings[h].index <= i) { category = headings[h].line; break; }
        }

        // Only treat next line as description if it exists and is NOT a heading and NOT another item line
        let description = "";
        if (i + 1 < lines.length) {
          const next = lines[i + 1];
          const nextIsPrice = priceRe.test(next);
          const nextIsHeading = isHeadingLine(next);
          if (!nextIsPrice && !nextIsHeading && next && next.length > 0) {
            description = next.slice(0, 200);
          }
        }

        items.push({ name, price: Number.isFinite(price) ? price : 0, category, description });
      }
    }

    console.log("Parsed items count:", items.length);
    console.log("Parsed items:");
    console.log(JSON.stringify(items, null, 2));

    return res.json({ ok: true, debug: true, items });
  } catch (err) {
    console.error("ERROR in handler:", err && (err.stack || err));
    return res.status(500).json({ ok: false, error: String(err && err.message), stack: err && err.stack ? String(err.stack).split("\n").slice(0,20).join("\n") : null });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`DEBUG server listening on port ${PORT}`));
