import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

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
      
      // Using environment variables with fallbacks to the provided keys
      const rzpId = process.env.RAZORPAY_KEY_ID || "rzp_live_SaynzqwF2GvwDh";
      const rzpSecret = process.env.RAZORPAY_KEY_SECRET || "hT97KNAif3fSuqs4rxnbgyCv";

      console.log(`Using Razorpay Key ID: ${rzpId.substring(0, 8)}...${rzpId.substring(rzpId.length - 3)}`);
      
      const razorpay = new Razorpay({
        key_id: rzpId,
        key_secret: rzpSecret,
      });

      const options = {
        amount: Math.round(amount), // amount in the smallest currency unit
        currency: currency || "INR",
        receipt: "receipt_" + Math.random().toString(36).substring(7),
      };

      console.log("Creating Razorpay order with options:", options);
      const order = await razorpay.orders.create(options);
      console.log("Razorpay order created:", order);
      res.json(order);
    } catch (error: any) {
      console.error("CRITICAL: Razorpay Order Creation Failed!");
      console.error("Error Object:", JSON.stringify(error, null, 2));
      
      res.status(500).json({ 
        error: "Internal Server Error", 
        details: error?.description || error?.message || "Unknown error",
        code: error?.code || "RAZORPAY_ERROR",
        metadata: error?.metadata || {}
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
