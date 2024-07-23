import nodemailer from "nodemailer";
import conn from "../dbconfig/conn";
import path from "path";
import { IncomingForm } from "formidable";
const { unlink } = require("fs").promises;

export const config = {
  api: {
    bodyParser: false,
  },
};

// Create a nodemailer transporter

const transporter = nodemailer.createTransport({
  host: process.env.NEXT_PUBLIC_EMAIL_HOST,
  port: 465,
  secure: true,
  auth: {
    user: process.env.NEXT_PUBLIC_EMAIL,
    pass: process.env.NEXT_PUBLIC_EMAIL_PASS,
  },
});

// Function to send an email
const sendEmail = async (email, subject, text) => {
  try {
    await transporter.sendMail({
      from: process.env.NEXT_PUBLIC_EMAIL,
      to: email,
      subject,
      text,
    });
    return true; // Indicate success
  } catch (error) {
    throw new Error("Email not sent");
  }
};

export default async function handler(req, res) {
  const { id } = req.query; // Get the dynamic ID from the URL parameter
  if (req.method === "POST") {
    try {
      const form = new IncomingForm();
      form.parse(req, async (err, fields, files) => {
        const { email, comment } = fields;
        // Send email with dynamic content
        const subject = "Feedback Received";
        const text = comment;
        const emailSent = await sendEmail(email, subject, text);

        if (emailSent) {
          res.status(200).json({ message: "Email sent successfully" });
        } else {
          res.status(500).json({ message: "Error sending email" });
        }
      });
    } catch (err) {
      res.status(500).json({ message: "Cannot Send Mail" });
    } finally {
      conn.releaseConnection();
    }
  }

  // Handling DELETE request for deleting a contact form
  if (req.method === "DELETE") {
    try {
      // Get contact form data
      const [contactForm] = await conn.query(
        "SELECT resume FROM contact_form WHERE id = ?",
        [id]
      );

      // Query to delete contact form data
      const deleteQuery = "DELETE FROM contact_form WHERE id = ?";
      const [deleteRows] = await conn.query(deleteQuery, [id]);
      res.status(200).json({ message: "Data deleted successfully" });

      // Check if the resume is available
      if (contactForm.length !== 0) {
        const resumeFile = contactForm[0].resume;
        const uploadDir = path.resolve(
          __dirname,
          "../../../../../public/assets/upload/career"
        );
        const resumePath = path.join(uploadDir, resumeFile);

        // Delete the resume file
        try {
          await fs.access(resumePath);
          console.log(`Deleting file: ${resumePath}`);
          await fs.unlink(resumePath);
        } catch (error) {
          console.error(
            `File not found or could not be deleted: ${resumePath}`
          );
        }
      }

      // Send the response
      res.status(200).json({ message: "Data deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error processing request" });
    } finally {
      conn.releaseConnection();
    }
  }
}
