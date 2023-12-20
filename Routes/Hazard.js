const express = require("express");
const router = express.Router();
const User = require("../Models/User");
const axios = require('axios');
const nodemailer = require('nodemailer');

router.get("/", async (req, res) => {
  // Define hazard information
  const hazardInfo = {
    description: "Gas leakage is the unintended release of gas, which can be flammable or harmful to health.",
    precautions: "1. Install gas detectors in vulnerable areas.\n2. Regularly check and maintain gas pipelines and connections.\n3. Educate residents on gas safety measures.",
    safety_measures: "1. Evacuate the area if a gas leak is suspected.\n2. Shut off the gas supply if possible.\n3. Do not use electrical equipment that may trigger a spark.",
    dos_and_donts: "Do: Ventilate the area if safe to do so.\nDon't: Use open flames or switches in the presence of a suspected gas leak.",
  };

  const centerLat = 29.41386000;
  const centerLng = 77.46890000;
  const hazard_title = "Gas";
  const industryId = 12345678;

  // Fetch user emails from the database
  const users = await User.find({ industryId });
  const emails = users.map(user => user.email);

  // Get geocode information
  const address = await getGeocodeInfo(centerLat, centerLng);

  // Create a transporter using the provided SMTP settings
  const transporter = nodemailer.createTransport({
    host: 'mum2.hostarmada.net',
    port: 465,
    secure: true,
    auth: {
      user: 'dheeraj@bixid.in',
      pass: 'dheeraj@bixid',
    },
  });

  // Email content
  const mailOptions = {
    from: 'Dheeraj@bixid.in',
    to: emails.join(', '),
    subject: `${hazard_title} hazard at ${address}`,
    html: generateEmailContent(address, hazard_title, hazardInfo),
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(`Error sending email: ${error.message}`);
    } else {
      console.log(`Email sent: ${info.response}`);
    }
  });

  // Call the function to get the prediction from the Flask server
  const radius = await sendInputData();

  // Calculate coordinates for a circle with a radius of 2 km
  const coordinates2km = calculateCoordinates(centerLat, centerLng, radius.prediction);

  // Calculate coordinates for a circle with a radius of 3 km
  const coordinates3km = calculateCoordinates(centerLat, centerLng, radius.prediction + 3);

  try {
    res.json({ coordinates2km, coordinates3km });
  } catch (error) {
    res.json({ message: "error while getting safe area" });
  }
});

// Function to generate HTML content for the email
function generateEmailContent(address, hazardTitle, hazardInfo) {
  return `
    <html lang="en">
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
          <h5 style="margin: 0; color: #333;">Location: ${address}</h5>
          <h2 style="margin: 10px 0 0; color: #555;">Hazard: ${hazardTitle}</h2>
        </div>

        <!-- Hazard Information Table (Horizontal) -->
        <div style="margin-top: 20px; background-color: #f0f0f0; padding: 20px; text-align: center;">
          <h2 style="margin: 0; color: #333;">Hazard Information</h2>
          <table>
            <tr>
              <th>Description</th>
              <td>${hazardInfo.description}</td>
            </tr>
            <tr>
              <th>Precautions</th>
              <td>${hazardInfo.precautions}</td>
            </tr>
            <tr>
              <th>Safety Measures</th>
              <td>${hazardInfo.safety_measures}</td>
            </tr>
            <tr>
              <th>Do's and Don'ts</th>
              <td>${hazardInfo.dos_and_donts}</td>
            </tr>
          </table>
        </div>
      </body>
    </html>`;
}

// Function to calculate coordinates for a circle with a given radius
function calculateCoordinates(centerLat, centerLng, radius) {
  const numberPoints = 17;
  const coordinates = [];

  for (let i = 0; i < numberPoints; i++) {
    const angle = (i / numberPoints) * 2 * Math.PI;
    const lat = centerLat + (radius / 111) * Math.cos(angle);
    const lng = centerLng + (radius / 111) * Math.sin(angle);
    coordinates.push({ latitude: lat, longitude: lng });
  }

  return coordinates;
}

// Function to get geocode information
async function getGeocodeInfo(latitude, longitude) {
  const apiUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;

  try {
    const response = await axios.get(apiUrl);

    if (response.data.display_name) {
      const address = response.data.display_name;
      return address;
    } else {
      return null;
    }
  } catch (error) {
    console.error(`Error: ${error.message}`);
    return null;
  }
}

// Function to send input data to Flask server
async function sendInputData() {
  const flaskServerUrl = 'http://127.0.0.1:5000';  // Change this URL to match your Flask server

  const inputData = {
    gas_weight: 1.23,
    density: 0.8,
    amount: 100,
    wind_speed: 5.6,
    atmospheric_pressure: 1013,
    impurities: 0.05,
    // Add other properties as needed
  };

  try {
    const response = await axios.post(`${flaskServerUrl}/predict`, inputData);
    console.log('Response from Flask server:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error communicating with Flask server:', error.message);
    throw error;
  }
}

module.exports = router;
