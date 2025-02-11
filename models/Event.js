const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // ✅ Ensure this field allows updates
    description: { type: String },
    date: { type: Date, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);
