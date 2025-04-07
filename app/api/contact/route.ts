import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const transporterConfig = {
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
  debug: true,
  logger: true
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    let { name, email, message } = body;
    
    if (!process.env.EMAIL_PASSWORD || !process.env.EMAIL_USER) {
      return NextResponse.json(
        { error: "Failed to send message: Email configuration missing. Need to fix application." },
        { status: 500 }
      );
    }
    
    console.log("Message received:");
    console.log(`From: ${name} (${email})`);
    console.log(`Message: ${message}`);
    
    let transporter;
    try {
      transporter = nodemailer.createTransport(transporterConfig);

      console.log('Attempting to verify transport...');
      await transporter.verify();
      console.log('Transport verified successfully');
    } catch (error) {
      console.error('Failed to create email transport:', error);
      return NextResponse.json(
        { error: "Failed to initialize email service. Please try again later." },
        { status: 500 }
      );
    }

    const htmlMessage = message
      .split('\n')
      .map((line: string) => `<div>${line}</div>`)
      .join('');
    
    const mailOptions = {
      from: `"Typing Game Contact Form" <${process.env.EMAIL_USER}>`,
      to: "shinguakira1022@gmail.com",
      replyTo: email,
      subject: `New message from ${name} via Typing Game Contact Form`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
          <h2 style="color: #333;">New Contact Form Submission</h2>
          <p><strong>From:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong></p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
            ${htmlMessage}
          </div>
          <p style="margin-top: 20px; font-size: 12px; color: #666;">
            This email was sent from the contact form on the Typing Game website.
          </p>
        </div>
      `,
    };
    
    try {
      console.log('Attempting to send email...');
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', info);
      
      return NextResponse.json({
        success: true,
        messageId: info.messageId
      });
    } catch (error) {
      console.error('Failed to send email:', error);
      return NextResponse.json(
        { error: "Failed to send email. Please try again later." },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error details:", error instanceof Error ? error.toString() : "Unknown error");
    return NextResponse.json(
      { error: "Failed to send message: Need to fix application." },
      { status: 500 }
    );
  }
}
