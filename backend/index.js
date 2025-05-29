require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { swaggerUi } = require("./swagger"); // Import Swagger UI configuration
const YAML = require("yamljs");
const path = require("path");

const announcementRoutes = require("./routers/announcementRoutes");
const charityAdRoutes = require("./routers/charityAdRoutes");
const incidentRoutes = require("./routers/incidentRoutes");
const newsRoutes = require("./routers/newsRoutes");
const organizationRoutes = require("./routers/organizationRoutes");
const userRoutes = require("./routers/userRoutes");
const reportRoutes = require("./routers/reportRoutes");
const volunteerRoutes = require("./routers/volunteerRoutes");
const assignmentRoutes = require("./routers/assignmentRoutes");
const { login } = require("./controllers/login");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
require("./cron/expireCharityAds");

mongoose
  .connect(process.env.DB)
  .then(() => {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Database connection error:", err);
  });
const swaggerDocument = YAML.load(path.join(__dirname, "swaggerDoc.yaml"));

// Serve Swagger UI at /api-docs
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.post("/api/login", login); //note created a common login function
app.use("/api/user", userRoutes);
app.use("/api/org", organizationRoutes);
app.use("/api/report", reportRoutes);
app.use("/api/volunteer", volunteerRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/incidents", incidentRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/charityad", charityAdRoutes);
app.use("/api/announcement", announcementRoutes);

app.get("/", (req, res) => {
  res.status(200).json("server run successfully");
});
