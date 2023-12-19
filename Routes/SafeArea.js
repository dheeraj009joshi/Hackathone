const express = require("express");
const router = express.Router();
const User = require("../Models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// User registration route
router.post("/register", async (req, res) => {
  function generateCircularCoordinates(
    centerLat,
    centerLng,
    radius,
    numPoints
  ) {
    const coordinates2km = [];
    const coordinates3km = [];

    for (let i = 0; i < numPoints; i++) {
      const angle = (i / numPoints) * 2 * Math.PI;

      // Calculate coordinates for a circle with a radius of 2 km
      const lat2km = centerLat + (2 / 111) * Math.cos(angle);
      const lng2km = centerLng + (2 / 111) * Math.sin(angle);
      coordinates2km.push({ lat: lat2km, lng: lng2km });

      // Calculate coordinates for a circle with a radius of 3 km
      const lat3km = centerLat + (3 / 111) * Math.cos(angle);
      const lng3km = centerLng + (3 / 111) * Math.sin(angle);
      coordinates3km.push({ lat: lat3km, lng: lng3km });
    }

    return { coordinates2km, coordinates3km };
  }

  const result = generateCircularCoordinates(
    centerLatitude,
    centerLongitude,
    2,
    numPoints
  );
  res.json({ coordinates: result });
  try {
  } catch (error) {
    res.json({ message: "error while getting safe area" });
  }
});
