const { GoogleGenAI } = require("@google/genai");
const Property = require("../models/Property");

// Gemini AI setup
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// ==========================================
// GEMINI REQUEST WITH AUTOMATIC RETRY
// ==========================================

const generateWithRetry = async (prompt, retries = 3) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`Gemini request attempt ${attempt}...`);

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      return response;

    } catch (error) {
      console.error(
        `Gemini attempt ${attempt} failed:`,
        error.message
      );

      // Agar error 503 nahi hai to retry mat karo
      if (error.status !== 503) {
        throw error;
      }

      // Last attempt bhi fail ho gaya
      if (attempt === retries) {
        throw error;
      }

      // Retry se pehle wait
      const waitTime = attempt * 2000;

      console.log(
        `Gemini busy hai. ${waitTime / 1000} seconds baad retry hoga...`
      );

      await new Promise((resolve) =>
        setTimeout(resolve, waitTime)
      );
    }
  }
};


// ==========================================
// AI CHAT CONTROLLER
// ==========================================

const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;

    // Message validation
    if (!message || !message.trim()) {
      return res.status(400).json({
        message: "Please enter a message.",
      });
    }


    // ======================================
    // MONGODB SE PROPERTIES FETCH
    // ======================================

    const properties = await Property.find()
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();


    // AI ko sirf required property data bhejna
    const propertyData = properties.map((property) => ({
      id: property._id,
      title: property.title,
      location: property.location,
      price: property.price,
      propertyType: property.propertyType,
      area: property.area,
      description: property.description,
    }));


    // ======================================
    // AI PROMPT
    // ======================================

    const prompt = `
You are the AI Property Assistant for Mahadev Developer.

COMPANY INFORMATION:

Company Name: Mahadev Developer
Location: Gorakhpur, Uttar Pradesh - 273007
Contact Number: 9935926414


YOUR ROLE:

You help customers who want to buy or sell property.

You should understand the customer's requirements and recommend suitable properties from the available property database.


IMPORTANT RULES:

1. Reply in simple and natural Hinglish.

2. Keep your answers clear, friendly and concise.

3. Recommend ONLY properties that are available in the database provided below.

4. Never invent a property.

5. Never invent property prices.

6. Never invent locations.

7. Never invent property area or other property details.

8. If no matching property is available, clearly tell the customer.

9. If the customer's requirement is incomplete, ask relevant questions such as:
   - What is your budget?
   - Which location do you prefer?
   - Which property type are you looking for?

10. If a suitable property is available, explain why it matches the customer's requirement.

11. Encourage interested customers to contact Mahadev Developer.

12. Do not provide legal guarantees about property ownership, documents or approvals.


AVAILABLE PROPERTIES:

${JSON.stringify(propertyData, null, 2)}


CUSTOMER MESSAGE:

${message}


Now provide a helpful response to the customer:
`;


    // ======================================
    // GEMINI AI CALL
    // ======================================

    const response = await generateWithRetry(prompt);


    // Check response
    if (!response || !response.text) {
      return res.status(500).json({
        message: "AI did not return a valid response.",
      });
    }


    // Send response to frontend
    res.status(200).json({
      success: true,
      reply: response.text,
    });


  } catch (error) {

    console.error(
      "Gemini AI Final Error:",
      error.message
    );


    // ======================================
    // 503 - GEMINI SERVER BUSY
    // ======================================

    if (error.status === 503) {

      return res.status(503).json({
        success: false,

        message:
          "AI service abhi busy hai. Please kuch der baad dobara try karein.",
      });

    }


    // ======================================
    // 429 - RATE LIMIT / QUOTA
    // ======================================

    if (error.status === 429) {

      return res.status(429).json({
        success: false,

        message:
          "AI request limit temporarily exceed ho gayi hai. Please thodi der baad try karein.",
      });

    }


    // ======================================
    // 401 / 403 - API KEY PROBLEM
    // ======================================

    if (
      error.status === 401 ||
      error.status === 403
    ) {

      return res.status(error.status).json({
        success: false,

        message:
          "AI configuration error. Please contact administrator.",
      });

    }


    // ======================================
    // OTHER ERRORS
    // ======================================

    res.status(500).json({

      success: false,

      message:
        "AI assistant is currently unavailable.",

    });

  }
};


// ==========================================
// EXPORT CONTROLLER
// ==========================================

module.exports = {
  chatWithAI,
};