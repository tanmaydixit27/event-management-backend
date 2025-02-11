const Event = require("../models/Event");

const getEvents = async (req, res) => {
  try {
    const events = await Event.find({ createdBy: req.user.id }).populate("createdBy", "name email");
    res.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const createEvent = async (req, res) => {
  try {
    const { name, description, date } = req.body;
    if (!name || !date) {
      return res.status(400).json({ message: "Name and date are required" });
    }

    const event = new Event({ name, description, date, createdBy: req.user.id });
    await event.save();
    res.status(201).json(event);
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, date } = req.body;

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    event.name = name || event.name;
    event.description = description || event.description;
    event.date = date || event.date;

    await event.save();
    res.json(event);
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    if (event.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await event.deleteOne();
    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getEvents, createEvent, updateEvent, deleteEvent };
