const Note = require("../models/Note");
const Pyq = require("../models/Pyq");
const bucket = require("../config/firebaseConfig");
const path = require("path");

exports.createNote = async (req, res) => {
  try {
    const { subject, title, uploadedBy } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    if (!uploadedBy) {
      return res.status(400).json({ message: "uploadedBy field is required" });
    }
    if (!subject) {
      return res.status(400).json({ message: "Subject field is required" });
    }

    // Sanitize subject and filename
    const sanitizedSubject = subject.replace(/\s+/g, "_").toUpperCase();
    const sanitizedFileName = `${Date.now()}_${path
      .basename(file.originalname)
      .replace(/[^\w.-]/g, "_")}`;

    // Define the storage path
    const folderPath = `notes/${sanitizedSubject}`;
    const blob = bucket.file(`${folderPath}/${sanitizedFileName}`);

    // Stream the file to the storage bucket
    const blobStream = blob.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    blobStream.on("error", (err) => {
      console.error("File upload error:", err);
      return res.status(500).json({ error: "File upload error" });
    });

    blobStream.on("finish", async () => {
      try {
        // Generate signed URLs for viewing and downloading
        const [viewURL, downloadURL] = await Promise.all([
          blob.getSignedUrl({
            action: "read",
            expires: "03-09-2491",
            responseDisposition: "inline", // For viewing in the browser
          }),
          blob.getSignedUrl({
            action: "read",
            expires: "03-09-2491",
            responseDisposition: `attachment; filename="${sanitizedFileName}"`, // For download
          }),
        ]);

        // Save the note details to the database
        const newNote = new Note({
          subject,
          title,
          viewURL: viewURL[0],
          downloadURL: downloadURL[0],
          uploadedBy,
          date: new Date(),
          time: new Date().toLocaleTimeString(),
        });

        await newNote.save();

        return res
          .status(201)
          .json({ message: "Notes stored successfully", newNote });
      } catch (err) {
        console.error("Error generating signed URLs:", err);
        return res.status(500).json({ error: "Error generating signed URLs" });
      }
    });

    blobStream.end(file.buffer);
  } catch (error) {
    console.error("Error storing note:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getContent = async (req, res) => {
  try {
    const { type, subject } = req.query;

    if (!type) {
      return res.status(400).json({ error: "Type is required" });
    }

    // Initialize an empty query object
    const query = {};

    // Apply subject filter if not "All"
    if (subject && subject !== "All") {
      query.subject = subject;
    }

    let content;
    if (type === "notes") {
      content = await Note.find(query);
    } else if (type === "pyq") {
      content = await Pyq.find(query);
    } else {
      return res.status(400).json({ error: "Invalid content type" });
    }

    res.status(200).json({ content });
  } catch (error) {
    console.error("Error retrieving content:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
