const express = require("express");
const router = express.Router();
const notesController = require("../controllers/notesController");
const verifyTeacher = require("../middleware/verifyTeacher");
const multer = require("multer");

const upload = multer({
  storage: multer.memoryStorage(), // Store the file in memory temporarily
});

// Route to create a new note (only accessible by teachers)
router.post(
  "/notes-upload",
  verifyTeacher,
  upload.single("file"),
  notesController.createNote
);

// Route to get notes (accessible by everyone)
// router.get("/notes", notesController.getContent);

router.get("/content", notesController.getContent);


module.exports = router;
