const express = require("express"); // Import Express framework
const cors = require("cors"); // Import CORS middleware for enabling Cross-Origin Resource Sharing
const app = express(); // Create an instance of an Express application
const PORT = 4000; // Define the port number for the server

// Use CORS middleware to allow cross-origin requests
app.use(cors());

// Importing data from a JSON file
const data = require("./data.json"); // Load JSON data from a file named 'data.json'

// Define a GET endpoint to retrieve items with pagination and optional filtering by language
app.get("/items", (req, res) => {
  // Destructure query parameters with default values
  let { page = 1, limit = 50, language } = req.query;
  
  // Convert limit to a number for calculations
  limit = Number(limit);
  
  // Calculate the start and end indices for pagination
  const startIndex = (page - 1) * limit; // Calculate the starting index
  const endIndex = startIndex + limit; // Calculate the ending index

  // Initialize filteredData with the original data
  let filteredData = data;

  // Filter the data based on the 'language' query parameter, if provided
  if (language) {
    filteredData = filteredData.filter(
      (user) => user.language.toLowerCase() === language.toLowerCase() // Case-insensitive comparison
    );
  }

  // Slice the filtered data to return only the items for the current page
  const results = filteredData.slice(startIndex, endIndex);

  // Send the results as a JSON response
  res.json(results);
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`); // Log a message when the server starts
});