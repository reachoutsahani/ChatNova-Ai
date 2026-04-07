const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: true
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false
    },
    content: {
      type: String,
      required: true,
      trim: true
    },
    role: {   // ✅ FIX ADDED
      type: String,
      enum: ["user", "assistant", "system"],
      default: "user"
    },
    embedding: {   // ✅ FUTURE AI MEMORY
      type: [Number],
      default: []
    }
  },
  {
    timestamps: true
  }
);

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;