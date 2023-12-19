const express = require("express");
const router = express.Router();
const FCM = require('fcm-node');

const serverKey = 'AAAAD_k68xg:APA91bE52cR2rJvIBuO1Nu_cZ0Mh0ZgPRoOMI6oeDUP1eGWviujpHndJaye90aXNKx9eOK0KNrUbNpz3G9WE0TbPsJQ3pRdqHfmsr7Ahzk4vOQdmEMY0-T1enjm2U4HzFSQ84_J3cK__';
const fcm = new FCM(serverKey);

router.post('/notify', (req, res) => {
  try {
    const { deviceToken, title, body, data } = req.body;

    // Validate if required parameters are provided
    if (!deviceToken || !title || !body || !data) {
      return res.status(400).json({ error: 'Missing required parameters in the request body' });
    }

    sendFCMNotification(deviceToken, title, body, data);
    res.status(200).json({ message: 'Notification sent successfully' });
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

function sendFCMNotification(deviceToken, title, body, data) {
  const message = {
    to: deviceToken,
    notification: {
      title: title,
      body: body,
    },
    data: data,
  };

  fcm.send(message, function (err, response) {
    if (err) {
      console.log("Something has gone wrong!", err);
      console.log("Response:", response);
    } else {
      console.log("Successfully sent with response:", response);
    }
  });
}







module.exports = router;





