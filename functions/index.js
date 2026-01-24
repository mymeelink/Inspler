const functions = require("firebase-functions");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "mail.inspelr@gmail.com",
    pass: "vgxnlazckwqvrvgw",
  },
});

exports.contactForm = functions.https.onRequest(
    async (req, res) => {
      res.set("Access-Control-Allow-Origin", "*");
      res.set("Access-Control-Allow-Methods", "POST","OPTIONS");
      res.set("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    return res.status(200).send("");
  }
      if (req.method !== "POST") {
        return res.status(405).json({
          type: "danger",
          message: "Method Not Allowed",
        });
      }

      const {name, email, subject, message} = req.body;

      if (!name || !email || !message) {
        return res.status(400).json({
          type: "danger",
          message: "Missing required fields",
        });
      }

      try {
        await transporter.sendMail({
          from: `"Inspler Website" <mail.inspelr@gmail.com>`,
          to: "shameem@inspler.com",
          replyTo: email,
          subject:
          subject ||
          "New message from Inspler Website contact form",
          text: [
            "You have new message from contact form",
            "=============================",
            "",
            `Name: ${name}`,
            `Email: ${email}`,
            `Subject: ${subject}`,
            "",
            "Message:",
            message,
          ].join("\n"),
        });

        return res.json({
          type: "success",
          message:
          "Contact form successfully submitted. " +
          "Thank you, I will get back to you soon!",
        });
      } catch (error) {
        console.error(error);
        return res.status(500).json({
          type: "danger",
          message:
          "There was an error while submitting the form. " +
          "Please try again later.",
        });
      }
    },
);
