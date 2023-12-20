const express = require("express");
const router = express.Router();
const User = require("../Models/User");
const axios = require('axios');
const nodemailer = require('nodemailer');
// User registration route
router.post("/", async (req, res) => {
  hazards_dictionary = {
    "Fire": {
      description:
        "Fire is the rapid combustion of material releasing heat, light, and various reaction products.",
      precautions:
        "1. Install smoke detectors.\n2. Keep flammable materials away from heat sources.\n3. Have fire extinguishers accessible.",
      safety_measures:
        "1. Evacuate the area immediately.\n2. Use fire extinguishers if trained.\n3. Follow emergency evacuation procedures.",
      dos_and_donts:
        "Do: Stay low to avoid smoke.\nDon't: Use elevators during a fire.",
    },
    "Chemical": {
      description:
        "Chemical exposure occurs when the body comes into contact with harmful substances.",
      precautions:
        "1. Wear appropriate personal protective equipment.\n2. Use chemicals in well-ventilated areas.\n3. Read and follow safety data sheets.",
      safety_measures:
        "1. Rinse affected area with water.\n2. Seek medical attention if symptoms persist.\n3. Report the incident to supervisors.",
      dos_and_donts:
        "Do: Follow chemical handling procedures.\nDon't: Eat or drink in areas with potential chemical exposure.",
    },
    "Electric": {
      description:
        "Electric shock occurs when the body comes into contact with an electric current.",
      precautions:
        "1. Turn off power before working on electrical equipment.\n2. Use insulated tools and equipment.\n3. Wear appropriate personal protective equipment.",
      safety_measures:
        "1. Disconnect power immediately.\n2. Administer CPR if necessary.\n3. Seek medical attention.",
      dos_and_donts:
        "Do: Use ground fault circuit interrupters (GFCIs).\nDon't: Touch electrical equipment with wet hands.",
    },
    
    "Gas": {
      description:
        "Gas leakage is the unintended release of gas, which can be flammable or harmful to health.",
      precautions:
        "1. Install gas detectors in vulnerable areas.\n2. Regularly check and maintain gas pipelines and connections.\n3. Educate residents on gas safety measures.",
      safety_measures:
        "1. Evacuate the area if a gas leak is suspected.\n2. Shut off the gas supply if possible.\n3. Do not use electrical equipment that may trigger a spark.",
      dos_and_donts:
        "Do: Ventilate the area if safe to do so.\nDon't: Use open flames or switches in the presence of a suspected gas leak.",
    },
  };
  const { centerLat, centerLng, hazard_title, industryId } = req.body;
  const users = await User.find({ industryId });
    // Extract and store emails
  const emails = users.map(user => user.email);
  
  console.log(emails)
  
  // const emails= [
    
  //   'amitauniyal47@gmail.com',
  //   'dlovej142@gmail.com',
  // ]
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${centerLat},${centerLat}`;

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
  
  const address = await getGeocodeInfo(centerLat, centerLng)

// Create a transporter using the provided SMTP settings
const transporter = nodemailer.createTransport({
  host: 'mum2.hostarmada.net',
  port: 465,
  secure: true, // Use SSL/TLS
  auth: {
    user: 'dheeraj@bixid.in',
    pass: 'dheeraj@bixid', // Replace with the actual password
  },
});

// Email content
const mailOptions = {
  from: 'Dheeraj@bixid.in',
  to:  emails.join(', '),
  subject: `${hazard_title} at ${address}`,
 
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
    <h5 style="margin: 0; color: #333;">Location: ${address}</h5>
    <h2 style="margin: 10px 0 0; color: #555;">Hazard: ${hazard_title}</h2>
  </div>

  <!-- Map Section (Placeholder Image) -->
  <div style="margin-top: 20px; text-align: center;">
    <!-- Replace the src attribute with your map image URL or embed your map as needed -->
    <a href="https://www.google.com/maps/search/?api=1&query=${centerLat},${centerLat}" style={font-size:20}>Go To Map</a>
  </div>

  <!-- Hazard Information Table (Horizontal) -->
  <div style="margin-top: 20px; background-color: #f0f0f0; padding: 20px; text-align: center;">
    <h2 style="margin: 0; color: #333;">Hazard Information</h2>
    <table>
      <tr>
        <th>Description</th>
        <td>${hazards_dictionary[hazard_title]['description']}</td>
      </tr>
      <tr>
        <th>Precautions</th>
        <td>${hazards_dictionary[hazard_title]['precautions']}</td>
      </tr>
      <tr>
        <th>Safety Measures</th>
        <td>${hazards_dictionary[hazard_title]['safety_measures']}</td>
      </tr>
      <tr>
        <th>Do's and Don'ts</th>
        <td>${hazards_dictionary[hazard_title]['dos_and_donts']}</td>
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


 
  const number_points = 17;
  const coordinates2km = [];
  const coordinates3km = [];
  for (let i = 0; i < number_points; i++) {
    const angle = (i / number_points) * 2 * Math.PI;

    // Calculate coordinates for a circle with a radius of 2 km
    const lat2km = centerLat + (2 / 111) * Math.cos(angle);
    const lng2km = centerLng + (2 / 111) * Math.sin(angle);
    coordinates2km.push({ latitude: lat2km, longitude: lng2km });

    // Calculate coordinates for a circle with a radius of 3 km
    const lat3km = centerLat + (3 / 111) * Math.cos(angle);
    const lng3km = centerLng + (3 / 111) * Math.sin(angle);
    coordinates3km.push({ latitude: lat3km, longitude: lng3km });
  }

  try {
    res.json({ coordinates2km, coordinates3km });
  } catch (error) {
    res.json({ message: "error while getting safe area" });
  }
});

module.exports = router;
