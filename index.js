const express = require("express");
const app = express();
const cors = require("cors");
const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());

const { initializeDatabase } = require("./db/db.connect");
const Event = require("./models/event.models");
initializeDatabase();

app.get("/", (req, res) => {
  res.send("Welcome to Meetup Events API Server.");
});

// ─── CREATE NEW EVENT ─────────────────────────────────────────

async function createEvent(newEvent) {
  try {
    const event = new Event(newEvent);
    const savedEvent = await event.save();
    return savedEvent;
  } catch (error) {
    throw error;
  }
}

app.post("/events", async (req, res) => {
  try {
    const savedEvent = await createEvent(req.body);
    res.status(201).json({
      message: "Event added successfully.",
      event: savedEvent,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to add event." });
  }
});
// ─── GET ALL EVENTS ───────────────────────────────────────────

async function getAllEvents() {
  try {
    const allEvents = await Event.find();
    return allEvents;
  } catch (error) {
    console.log(error);
  }
}

app.get("/events", async (req, res) => {
  try {
    const allEvents = await getAllEvents();
    if (allEvents.length != 0) {
      res.json({ message: "All events retrieved.", allEvents: allEvents });
    } else {
      res.status(404).json({ error: "No events found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch events." });
  }
});

// ─── GET EVENT BY ID ──────────────────────────────────────────

async function readEventById(eventId) {
  try {
    const event = await Event.findById(eventId);
    return event;
  } catch (error) {
    throw error;
  }
}

app.get("/events/id/:eventId", async (req, res) => {
  try {
    const event = await readEventById(req.params.eventId);
    if (event) {
      res.json({ message: "Event retrieved.", event: event });
    } else {
      res.status(404).json({ error: "Event not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch event." });
  }
});

// ─── GET EVENT BY TITLE ───────────────────────────────────────

async function readEventByTitle(eventTitle) {
  try {
    const event = await Event.findOne({ title: eventTitle });
    return event;
  } catch (error) {
    throw error;
  }
}

app.get("/events/title/:eventTitle", async (req, res) => {
  try {
    const event = await readEventByTitle(req.params.eventTitle);
    if (event) {
      res.json({ message: "Event retrieved.", event: event });
    } else {
      res.status(404).json({ error: "Event not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch event." });
  }
});

// ─── GET EVENTS BY TAG ────────────────────────────────────────

async function readEventsByTag(tag) {
  try {
    const events = await Event.find({ tags: tag });
    return events;
  } catch (error) {
    console.log(error);
  }
}

app.get("/events/tag/:tag", async (req, res) => {
  try {
    const events = await readEventsByTag(req.params.tag);
    if (events.length != 0) {
      res.json({
        message: `Events with tag: ${req.params.tag}`,
        events: events,
      });
    } else {
      res.status(404).json({ error: "No events found for this tag." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch events." });
  }
});

// ─── GET EVENTS BY KEYWORD (title, description, tags) ────────

async function readEventsByKeyword(keyword) {
  try {
    const events = await Event.find({
      $or: [
        { title: { $regex: keyword, $options: "i" } },
        { details: { $regex: keyword, $options: "i" } },
        { tags: { $regex: keyword, $options: "i" } },
      ],
    });
    return events;
  } catch (error) {
    console.log(error);
  }
}

app.get("/events/search/:keyword", async (req, res) => {
  try {
    const events = await readEventsByKeyword(req.params.keyword);
    if (events.length != 0) {
      res.json({
        message: `Events matching: ${req.params.keyword}`,
        events: events,
      });
    } else {
      res.status(404).json({ error: "No events found for this keyword." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch events." });
  }
});

// ─── UPDATE EVENT ─────────────────────────────────────────────

async function updateEvent(eventId, dataToUpdate) {
  try {
    const updatedEvent = await Event.findByIdAndUpdate(eventId, dataToUpdate, {
      new: true,
    });
    return updatedEvent;
  } catch (error) {
    console.log("Error updating event.", error);
  }
}

app.post("/events/:eventId", async (req, res) => {
  try {
    const updatedEvent = await updateEvent(req.params.eventId, req.body);
    if (updatedEvent) {
      res.status(200).json({
        message: "Event updated successfully.",
        updatedEvent: updatedEvent,
      });
    } else {
      res.status(404).json({ error: "Event not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to update event." });
  }
});

// ─── DELETE EVENT ─────────────────────────────────────────────

async function deleteEvent(eventId) {
  try {
    const deletedEvent = await Event.findByIdAndDelete(eventId);
    return deletedEvent;
  } catch (error) {
    console.log(error);
  }
}

app.delete("/events/:eventId", async (req, res) => {
  try {
    const deletedEvent = await deleteEvent(req.params.eventId);
    if (deletedEvent) {
      res.status(200).json({
        message: "Event deleted successfully.",
        event: deletedEvent,
      });
    } else {
      res.status(404).json({ error: "Event not found." });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to delete event." });
  }
});

// ─── PORT ─────────────────────────────────────────────────────

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
