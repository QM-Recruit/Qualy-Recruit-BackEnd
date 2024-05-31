import express from "express";
const router = express.Router();
import multer from "multer";
import nodemailer from "nodemailer";

const upload = multer({
  storage: multer.memoryStorage(),
});

// send mail
router.post("/send", upload.single("cv"), async (req, res) => {
  const { selectedPosition, emailAddress, phNumber, shiftSystem, fullName } = req.body;

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    // Mail options for recipient (process.env.EMAIL)
    const recipientMailOptions = {
      from: `Qualy Myanmar Recruit Notifications <${process.env.EMAIL}>`,
      to: process.env.EMAIL,
      subject: `QM Recruit - New Application From ${fullName}`,
      html: `
      <h3>A new application has been received from QM recruit site.</h3>
      <h4>Information</h4>
      <p>- Name: ${fullName}</p>
      <p>- Email Address: ${emailAddress}</p>
      <p>- Phone Number: ${phNumber}</p>
      <p>- Position: ${selectedPosition}</p>
      <p>- Shift System: ${shiftSystem}</p>
      <p>Please contact the applicant and ask he/she to send his/her resume (CV).</p>`,
      attachments: [
        {
          filename: req.file.originalname,
          content: req.file.buffer,
        },
      ],
    };

    // Mail options for user (emailAddress)
    const userMailOptions = {
      from: `Qualy Myanmar <${process.env.EMAIL}>`,
      to: emailAddress,
      subject: `Qualy Myanmar Recruit - Your Application for ${selectedPosition}`,
      html: `
      <h3>Thank you for your application, ${fullName}.</h3>
      <p>We have received your application for the ${selectedPosition} position.</p>
      <p>Our team will review your application and contact you soon.</p>
      <p>Best regards,<br>Qualy Myanmar Recruit Team</p>`,
    };

    // Send email to recipient
    const recipientInfo = await transporter.sendMail(recipientMailOptions);

    // Send email to user
    const userInfo = await transporter.sendMail(userMailOptions);

    console.log("Email sent to recipient: " + recipientInfo.response);
    console.log("Email sent to user: " + userInfo.response);
    res.status(201).json({ status: 201, info: { recipientInfo, userInfo } });
  } catch (error) {
    console.error("Error" + error);
    res.status(401).json({ status: 401, error });
  }
});

export default router;
