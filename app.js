const express = require("express");
const app = express();
const multer = require("multer");
const bodyParser = require("body-parser");
const cors = require("cors");
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

require("dotenv").config();

const upload = multer({ dest: "./uploads/" });

app.use(bodyParser.json());
app.use(express.static("public"));
app.use(cors());

app.post("/api/contact", upload.single("file"), (req, res) => {
  const { name, phone, adresse } = req.body;
  const file = req.file;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  // Generate a unique identifier
  const uniqueId = uuidv4();

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: process.env.GMAIL_CLIENT,
    subject: ` لديك طلب جديد من - ${name} `,
    text: `
      Name: ${name}
      Phone: ${phone}
      Adresse: ${adresse}
    `,
    attachments: [
      {
        filename: file.originalname,
        path: file.path,
      },
    ],
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      return res.status(500).send("Error sending email", error);
    }

    // Delete the file after email is sent
    fs.unlink(file.path, (err) => {
      if (err) {
        console.error("Error deleting file:", err);
      } else {
        console.log("File deleted successfully");
      }
    });

    res.status(200).send("Form data received and email sent successfully!");
  });
});

const port = 3001;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
