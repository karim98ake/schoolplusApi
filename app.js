const express = require("express");
const app = express();
const multer = require("multer");
const bodyParser = require("body-parser");
const cors = require("cors");
const nodemailer = require("nodemailer");

// Set up Multer for file uploads
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
      user: "abdelkarim17elalaoui@gmail.com",
      pass: "prlr ryjr jxns vhwu",
    },
  });

  // Define the email message
  const mailOptions = {
    from: "abdelkarim17elalaoui@gmail.com",
    to: "abdelkarim17elalaoui@gmail.com",
    subject: "New Contact Form Submission",
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

  // Send the email using Nodemailer
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log("Email sent: " + info.response);
    res.status(200).send("Form data received successfully!");
  });
});

// Start the server
const port = 3001;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
