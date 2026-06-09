const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
require("dotenv").config();

const cloudinary = require("./utils/cloudinary");

const app = express();

app.use(cors());
app.use(express.json());

// =====================
// CLOUDINARY SETUP (IMPORTANT)
// =====================
const storage = multer.memoryStorage();
const upload = multer({ storage });

// =====================
// CLOUDINARY UPLOAD ROUTE
// =====================
app.post("/api/upload", upload.single("image"), async (req, res) => {
  try {
    const streamifier = require("streamifier");

    const streamUpload = (req) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder: "clean-india-app",
          },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );

        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };

    const result = await streamUpload(req);

    res.json({
      imageUrl: result.secure_url,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// =====================
// MongoDB CONNECT
// =====================
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected ✔"))
  .catch((err) => console.log("Mongo Error:", err));

// =====================
// ROUTES
// =====================
const reportRoutes = require("./routes/reportRoutes");
app.use("/api/reports", reportRoutes);

app.get("/", (req, res) => {
  res.send("Clean India Backend Running 🚀");
});

// =====================
// SERVER START
// =====================
app.listen(process.env.PORT, () => {
  console.log("Server running on port", process.env.PORT);
});






























































































































































































































