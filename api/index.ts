import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// API routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Razorpay Order Creation
app.post("/api/create-order", async (req, res) => {
  try {
    const { amount, currency } = req.body;
    
    if (!amount || amount < 100) {
      return res.status(400).json({ error: "Invalid amount. Minimum amount is 100 paise (1 INR)." });
    }

    const Razorpay = (await import("razorpay")).default;
    
    const rzpId = process.env.RAZORPAY_KEY_ID || "rzp_live_SaynzqwF2GvwDh";
    const rzpSecret = process.env.RAZORPAY_KEY_SECRET || "hT97KNAif3fSuqs4rxnbgyCv";

    const razorpay = new Razorpay({
      key_id: rzpId,
      key_secret: rzpSecret,
    });

    const options = {
      amount: Math.round(amount),
      currency: currency || "INR",
      receipt: "receipt_" + Math.random().toString(36).substring(7),
    };

    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error: any) {
    console.error("Razorpay Error:", error);
    res.status(500).json({ 
      error: "Internal Server Error", 
      details: error?.message || "Unknown error"
    });
  }
});

export default app;
