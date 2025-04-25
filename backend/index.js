require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const announcementRoutes = require("./routers/announcementRoutes");
const charityAdRoutes = require("./routers/charityAdRoutes");
const incidentRoutes = require("./routers/incidentRoutes");
const newsRoutes = require("./routers/newsRoutes");
const organizationRoutes = require("./routers/organizationRoutes");
const userRoutes = require("./routers/userRoutes");
const reportRoutes = require("./routers/reportRoutes");
const volunteerRoutes = require("./routers/volunteerRoutes");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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

app.use("/api/user", userRoutes);
app.use("/api/org", organizationRoutes);
app.use("/api/report", reportRoutes);
app.use("/api/volunteer", volunteerRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/incidents", incidentRoutes);
app.use("/api/charityad", charityAdRoutes);
app.use("/api/annoucement", announcementRoutes);

app.get("/", (req, res) => {
  res.status(200).json("server run successfully");
});
