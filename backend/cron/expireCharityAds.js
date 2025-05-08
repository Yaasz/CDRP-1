const cron = require("node-cron");
const CharityAd = require("../models/charityadModel");

cron.schedule("*/10 * * * *", async () => {
  try {
    const currentDate = new Date();
    await CharityAd.updateMany(
      { expiryDate: { $lt: currentDate } },
      { status: "closed" }
    );
  } catch (error) {
    console.error("Error updating expired charity ads:", error.message);
  }
});
