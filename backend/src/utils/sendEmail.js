import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Send email function
export const sendEmail = async (to, subject, text, html) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to,
      subject,
      text,
      html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email error:', error);
    return { success: false, error: error.message };
  }
};

// Send meal plan reminder
export const sendMealPlanReminder = async (userEmail, userName, mealPlan) => {
  const subject = 'Your Weekly Meal Plan Reminder 🍽️';
  const text = `Hi ${userName}, don't forget to check your meal plan for this week!`;
  const html = `
    <h2>Hello ${userName}!</h2>
    <p>This is a reminder about your meal plan for the week.</p>
    <p><strong>Week:</strong> ${mealPlan.week_start} to ${mealPlan.week_end}</p>
    <p>Log in to view your complete meal plan and track your nutrition!</p>
  `;

  return await sendEmail(userEmail, subject, text, html);
};
