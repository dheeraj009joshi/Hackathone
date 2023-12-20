const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'mum2.hostarmada.net',
    port: 465,
    secure: true, // Use SSL/TLS
    auth: {
      user: 'dheeraj@bixid.in',
      pass: 'dheeraj@bixid', // Replace with the actual password
    },
  });
  const latitude = 37.7749;
  const longitude = -122.4194;
  const recipients= [
    'dlovej009@gmail.com',
    'amitauniyal47@gmail.com',
    'dlovej142@gmail.com',
  ]
  // Email content
  const mailOptions = {
    from: 'Dheeraj@bixid.in',
    to:  recipients.join(', '),
    subject: 'Subject of the Email',
    // text: `Meeting location: ${mapUrl}`, // Include the Google Maps URL in the text version
  html: `<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hazard Information</title>
    <style>
      body {
        font-family: 'Arial', sans-serif;
        margin: 0;
        padding: 20px;
      }
  
      /* Style for table */
      table {
        width: 100%;
        margin-top: 20px;
        border-collapse: collapse;
        border: 1px solid #ddd;
      }
  
      th, td {
        border: 1px solid #ddd;
        padding: 8px;
        text-align: left;
      }
  
      th {
        background-color: #f2f2f2;
      }
    </style>
  </head>
  <body>
  
    <!-- Location and Hazard Information -->
    <div style="background-color: #f0f0f0; padding: 20px; text-align: center;">
      <h1 style="margin: 0; color: #333;">Location: Your Location Name</h1>
      <h2 style="margin: 10px 0 0; color: #555;">Hazard: Gas Leakage</h2>
    </div>
  
    <!-- Map Section (Placeholder Image) -->
    <div style="margin-top: 20px; text-align: center;">
      <!-- Replace the src attribute with your map image URL or embed your map as needed -->
      <a href="https://www.google.com/maps/search/?api=1&query=37.7749,-122.4194" style={font-size:20}>Go To Map</a>
    </div>
  
    <!-- Hazard Information Table (Horizontal) -->
    <div style="margin-top: 20px; background-color: #f0f0f0; padding: 20px; text-align: center;">
      <h2 style="margin: 0; color: #333;">Hazard Information</h2>
      <table>
        <tr>
          <th>Description</th>
          <td>Gas leakage is the unintended release of gas, which can be flammable or harmful to health.</td>
        </tr>
        <tr>
          <th>Precautions</th>
          <td>1. Install gas detectors in vulnerable areas. 2. Regularly check and maintain gas pipelines and connections. 3. Educate residents on gas safety measures.</td>
        </tr>
        <tr>
          <th>Safety Measures</th>
          <td>1. Evacuate the area if a gas leak is suspected. 2. Shut off the gas supply if possible. 3. Do not use electrical equipment that may trigger a spark.</td>
        </tr>
        <tr>
          <th>Do's and Don'ts</th>
          <td>Do: Ventilate the area if safe to do so. Don't: Use open flames or switches in the presence of a suspected gas leak.</td>
        </tr>
      </table>
    </div>
  
  </body>
  </html>`, // Include a link in the HTML version
  
  };
  
  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(`Error sending email: ${error.message}`);
    } else {
      console.log(`Email sent: ${info.response}`);
    }
  });