import conn from "../../dbconfig/conn";
import path from "path";
import { IncomingForm } from "formidable";
import nodemailer from "nodemailer";

import fs from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method == "POST") {
    try {
      const form = new IncomingForm();
      form.parse(req, async (err, fields, files) => {
        // check if the resume file exists
        if (!files.resume) {
          try {
            const { name, email, number, salary, message, app_id } = fields;

            // SQL query for inserting data into the testimonial table
            const insertQuery =
              "INSERT INTO `contact_form`(`name`, `email`, `mobile`, `message`, `salary`, `app_id`, `identify_status`) VALUES (?, ?, ?, ?, ?, ?, ?)";
            const values = [name, email, number, message, salary, app_id, 1];

            // Execute the query
            const [result] = await conn.query(insertQuery, values);

            // Send email
            await sendContactEmail({ name, email, number, message });

            res.status(200).json(result, {
              message: "Inquiry Add Successfully",
            });
          } catch (error) {
            console.error("Error executing SQL query:", error);
            res.status(500).json({ message: "Inquiry Failed to Add" });
          }
        }

        // configuration of path and name for the resume
        const oldPathResume = files.resume[0].filepath; // Access the path of the uploaded Resume

        // new path and name for the Resume
        const nFileNameResume = `${Date.now()}.${
          files.resume[0].originalFilename
        }`;

        // remove spaces from the image name
        const newFileNameResume = nFileNameResume.replace(/\s/g, "");

        // project directory for storing images
        const projectDirectory = path.resolve(
          __dirname,
          "../../../../../../public/assets/upload/career"
        );

        // combine path and image name
        const newPathResume = path.join(projectDirectory, newFileNameResume);

        // Copy the uploaded image to the new path
        fs.copyFile(oldPathResume, newPathResume, async (moveErr1) => {
          if (moveErr1) {
            res.status(500).json({ message: "Document Upload failed." });
          } else {
            // Extracting fields from the request
            const { name, email, number, salary, message, app_id } = fields;

            // SQL query for inserting data into the testimonial table
            const insertQuery =
              "INSERT INTO `contact_form`(`name`, `email`, `mobile`, `message`, `salary`, `resume`, `app_id`, `identify_status`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
            const values = [
              name,
              email,
              number,
              message,
              salary,
              newFileNameResume,
              app_id,
              1,
            ];

            // Execute the query
            const [result] = await conn.query(insertQuery, values);

            await sendContactEmail({
              name,
              email,
              number,
              message,
              newFileNameResume,
            });

            res.status(200).json(result, {
              message: "Inquiry Add Successfully",
            });
          }
        });
      });
    } catch (err) {
      res.status(500).json({ message: "Inquiry Failed !! Please Try Again" });
    }
  }
  if (req.method == "GET") {
    try {
      // Query the database

      const q =
        "SELECT `carrer_title`, `carrer_keyword`, `carrer_desc`, `carrer_canonical` FROM `pages_seo`";
      console.log(q);
      const [rows] = await conn.query(q);
      console.log(rows);
      // Process the data and send the response
      res.status(200).json(rows);
    } catch (err) {
      res.status(401).json({ message: "Connection Error" });
    } finally {
      conn.releaseConnection();
    }
  }
}

async function sendContactEmail({
  name,
  email,
  number,
  message,
  newFileNameResume,
}) {
  // const resumeDownloadLink = `${process.env.NEXT_PUBLIC_APP_URL}/assets/upload/career/${newFileNameResume}`;

  const resumeDownloadLink = newFileNameResume
    ? `${process.env.NEXT_PUBLIC_APP_URL}/assets/upload/career/${newFileNameResume}`
    : "Resume Not Uploaded";

  // Create a Nodemailer transporter using your email service provider details
  const transporter = nodemailer.createTransport({
    host: process.env.NEXT_PUBLIC_EMAIL_HOST,
    port: 465,
    secure: true,
    auth: {
      user: process.env.NEXT_PUBLIC_EMAIL,
      pass: process.env.NEXT_PUBLIC_EMAIL_PASS,
    },
  });

  // Email content
  const mailOptions = {
    from: process.env.NEXT_PUBLIC_EMAIL,
    to: process.env.NEXT_PUBLIC_EMAIL,
    subject: "Thank you for Career Inquiry!",
    html: `
    <html>
    <head>
     
    <head>
    <style>
      @media only screen and (max-width: 600px) {
        body {
          padding: 50px 10px; 
        }

        .container {
          padding: 20px;
        }
      }
    </style>
  </head>
  
    <body style="font-family: 'Arial', sans-serif; line-height: 1.5; background-color: #e9eaec; padding: 50px 20px;">
      <div style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 30px;">
        <h1 style="color: black;">Career Inquiry</h1>
  
        <div>
          <label style="font-weight: bold; color: black;">Name</label>
          <div style="padding-top: 5px; color: black;">
            ${name}
            <hr />
          </div>
        </div>
        <div>
          <label style="font-weight: bold; color: black;">Email</label>
          <div style="padding-top: 5px;">
            ${email}
            <hr />
          </div>
        </div>
        <div>
          <label style="font-weight: bold; color: black;">Phone</label>
          <div style="padding-top: 5px; color: black;">
            +91${number}
            <hr />
          </div>
        </div>
        <div>
          <label style="font-weight: bold; color: black;">Upload Resume</label>
          <div style="padding-top: 5px; color: black;">
            <a href="${resumeDownloadLink}" target="_blank" rel="noopener noreferrer">${newFileNameResume}</a>
            <hr />
          </div>
        </div>
        <div>
          <label style="font-weight: bold; color: black;">Message</label>
          <div style="padding-top: 5px; color: black;">
            ${message}
            <hr />
          </div>
        </div>
      </div>
    </body>
  </html>  
    `,
  };

  // Send the email
  await transporter.sendMail(mailOptions);
}
