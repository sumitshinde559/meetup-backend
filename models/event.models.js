const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    hostedBy: {
      type: String,
      required: true,
    },
    eventType: {
      type: String,
      enum: ["Online", "Offline"],
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    location: {
      city: {
        type: String,
      },
      address: {
        type: String,
      },
    },
    price: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    details: {
      type: String,
      required: true,
    },
    speakers: [
      {
        name: {
          type: String,
        },
        role: {
          type: String,
        },
        image: {
          type: String,
        },
      },
    ],
    additionalInfo: {
      dressCode: {
        type: String,
      },
      ageRestrictions: {
        type: String,
      },
    },
    tags: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true },
);

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
