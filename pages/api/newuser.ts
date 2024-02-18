// pages/api/contact.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import nodemailer from 'nodemailer'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      const { firstName, lastName, email, phoneNumber, message } = req.body

      // Load environment variables
      const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: process.env.NODEMAILER_EMAIL, // Use environment variable for email
          pass: process.env.NODEMAILER_PW, // Use environment variable for password
        },
      })

      // Console log the destination email and password
      console.log('Destination Email:', 'airtaska1@gmail.com')
      console.log('Password Used:', process.env.NODEMAILER_PW)

      // Compose email
      const mailOptions = {
        from: process.env.NODEMAILER_EMAIL, // Use environment variable for sender email
        to: 'airtaska1@gmail.com', // Destination email address
        subject: 'New User Signup on QualityunitedWriters',
        text: `
        A new user with the following details has just signed up.
          Name: ${firstName} 
          Last name:${lastName}
          Email: ${email}
        `,
      }

      // Send email
      await transporter.sendMail(mailOptions)

      res.status(200).json({ message: 'Email sent successfully!' })
    } catch (error) {
      console.error(error)
      res
        .status(500)
        .json({ error: 'An error occurred while sending the email.' })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed.' })
  }
}
