const express = require("express");
const app = express();
const multer = require("multer");
const bodyParser = require("body-parser");
const cors = require("cors");
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");

require("dotenv").config();

const upload = multer({ dest: "./uploads/" });

app.use(bodyParser.json());
app.use(express.static("public"));
app.use(cors());

app.post("/api/contact", upload.single("file"), (req, res) => {
  const { name, phone, adresse } = req.body;
  const file = req.file;
  console.log(process.env.GMAIL_USERM, process.env.GMAIL_PASS);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: process.env.GMAIL_CLIENT,
    subject: "طلب جديد",
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
      return res.status(500).send("Error sending email");
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
