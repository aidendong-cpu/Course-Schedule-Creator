import express from "express";
import path from "path";
import { GoogleGenAI, Type } from "@google/genai";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Initialize GoogleGenAI server-side
const getAI = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not configured.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// Healthcheck API
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

// Endpoint 1: Parse raw text/pasted course list into structured course data
app.post("/api/parse-courses", async (req, res) => {
  try {
    const { rawText } = req.body;
    if (!rawText || typeof rawText !== "string") {
      return res.status(400).json({ error: "rawText parameter is required." });
    }

    const ai = getAI();
    const prompt = `Extract all courses and their sections from the following raw text copy-pasted from a university course catalog, syllabus, or registration portal.
Return a structured array of courses. Each course must contain its code, title, department, credits, and list of sections.
For each section include sectionId, professor, professorRating (number from 1.0 to 5.0, default to 4.0 if unknown), timeSlots (days, startTime 24hr e.g. "09:00", endTime 24hr e.g. "10:15", location e.g. "Hall 101"), and openSeats/status if available.

Raw Text:
"""
${rawText}
"""`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          description: "List of parsed courses",
          items: {
            type: Type.OBJECT,
            properties: {
              code: { type: Type.STRING, description: "e.g., CS 101" },
              title: { type: Type.STRING, description: "e.g., Intro to Computer Science" },
              department: { type: Type.STRING, description: "e.g., Computer Science" },
              credits: { type: Type.NUMBER, description: "Course credit hours, e.g. 3 or 4" },
              sections: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    sectionId: { type: Type.STRING, description: "e.g., CS101-01 or Sec 01" },
                    professor: { type: Type.STRING, description: "Professor name" },
                    professorRating: { type: Type.NUMBER, description: "Rating out of 5.0" },
                    location: { type: Type.STRING, description: "Building/Room" },
                    status: { type: Type.STRING, description: "Open, Closed, or Waitlist" },
                    timeSlots: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          days: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING },
                            description: "Days of week e.g. ['Mon', 'Wed', 'Fri'] or ['Tue', 'Thu']"
                          },
                          startTime: { type: Type.STRING, description: "24h format e.g. '09:00' or '14:30'" },
                          endTime: { type: Type.STRING, description: "24h format e.g. '10:15' or '16:00'" },
                          location: { type: Type.STRING }
                        },
                        required: ["days", "startTime", "endTime"]
                      }
                    }
                  },
                  required: ["sectionId", "professor", "professorRating", "timeSlots"]
                }
              }
            },
            required: ["code", "title", "sections"]
          }
        }
      }
    });

    const parsedData = JSON.parse(response.text || "[]");
    res.json({ courses: parsedData });
  } catch (error: any) {
    console.error("Error in /api/parse-courses:", error);
    res.status(500).json({ error: error?.message || "Failed to parse course text using Gemini AI" });
  }
});

// Endpoint 2: AI Natural Language Preference Parser & Schedule Critique Advisor
app.post("/api/ai-schedule-advisor", async (req, res) => {
  try {
    const { action, naturalText, scheduleSummary, userWeights } = req.body;
    const ai = getAI();

    if (action === "parse_preferences") {
      // Natural language to preference weights & settings
      const prompt = `Analyze this student's natural language request regarding their preferred class schedule and map it into structured numerical preferences (0-100 weights) and flags.

Student Request: "${naturalText}"

Convert into JSON according to the schema.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              professorRatingWeight: { type: Type.NUMBER, description: "0-100 weight for valuing high professor ratings" },
              preferredTimeOfDay: { type: Type.STRING, description: "ANY, MORNING, AFTERNOON, or EVENING" },
              timeOfDayWeight: { type: Type.NUMBER, description: "0-100 weight for time of day preference" },
              compactnessMode: { type: Type.STRING, description: "COMPACT (classes close together) or SPACED (gaps for study/breaks) or BALANCED" },
              compactnessWeight: { type: Type.NUMBER, description: "0-100 weight for compactness/gap style" },
              avoidEarlyMornings: { type: Type.BOOLEAN, description: "True if user wants to avoid classes before 9:00/10:00 AM" },
              morningAvoidanceWeight: { type: Type.NUMBER, description: "0-100 weight for avoiding early mornings" },
              preferredDaysOff: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "List of days user prefers to have no classes, e.g. ['Fri', 'Mon']"
              },
              daysOffWeight: { type: Type.NUMBER, description: "0-100 weight for wanting days off" },
              summaryExplanation: { type: Type.STRING, description: "Brief friendly 1-sentence summary of how their preferences were interpreted." }
            },
            required: [
              "professorRatingWeight",
              "preferredTimeOfDay",
              "timeOfDayWeight",
              "compactnessMode",
              "compactnessWeight",
              "avoidEarlyMornings",
              "morningAvoidanceWeight",
              "preferredDaysOff",
              "daysOffWeight",
              "summaryExplanation"
            ]
          }
        }
      });

      const parsedPref = JSON.parse(response.text || "{}");
      return res.json({ preferences: parsedPref });
    }

    if (action === "critique_schedule") {
      // Provide AI feedback & tips on a generated schedule
      const prompt = `You are an expert academic advisor helping a student evaluate a proposed class schedule.
User preferences set by student: ${JSON.stringify(userWeights)}
Schedule summary details: ${JSON.stringify(scheduleSummary)}

Provide a concise, encouraging, 2-3 sentence assessment highlighting key strengths of this schedule (e.g. prof ratings, gap spacing, free days) and 1 helpful tip for their upcoming semester based on this setup.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt
      });

      return res.json({ critique: response.text });
    }

    res.status(400).json({ error: "Invalid action parameter." });
  } catch (error: any) {
    console.error("Error in /api/ai-schedule-advisor:", error);
    res.status(500).json({ error: error?.message || "Failed to process AI schedule advice." });
  }
});

// Vite middleware / Static server setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
