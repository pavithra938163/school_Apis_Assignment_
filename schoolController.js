const db = require("../config/db");
const calculateDistance = require("../utils/distance");


// Add School
exports.addSchool = (req, res) => {
  const { name, address, latitude, longitude } = req.body;

  if (!name || !address || latitude == null || longitude == null) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  if (isNaN(latitude) || isNaN(longitude)) {
    return res.status(400).json({
      message: "Latitude and Longitude must be numbers",
    });
  }

  const sql =
    "INSERT INTO schools (name,address,latitude,longitude) VALUES (?,?,?,?)";

  db.query(sql, [name, address, latitude, longitude], (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.json({
      message: "School added successfully",
      schoolId: result.insertId,
    });
  });
};



// List Schools by Distance
exports.listSchools = (req, res) => {
  const { latitude, longitude } = req.query;

  if (!latitude || !longitude) {
    return res.status(400).json({
      message: "Latitude and Longitude are required",
    });
  }

  const userLat = parseFloat(latitude);
  const userLon = parseFloat(longitude);

  const sql = "SELECT * FROM schools";

  db.query(sql, (err, schools) => {
    if (err) {
      return res.status(500).json(err);
    }

    const schoolsWithDistance = schools.map((school) => {
      const distance = calculateDistance(
        userLat,
        userLon,
        school.latitude,
        school.longitude
      );

      return { ...school, distance };
    });

    schoolsWithDistance.sort((a, b) => a.distance - b.distance);

    res.json(schoolsWithDistance);
  });
};