function doGet(e) {
  // Define a simple API key for basic security
  const API_KEY = "Th1sIsAM0reC0mplexK3y!@#$"; // **Replace with your actual secret key**

  // Get the 'key' parameter from the request
  const userApiKey = e.parameter.key;

  // Check if the provided key matches the defined API key
  if (userApiKey !== API_KEY) {
    // Return an error if the key is missing or incorrect
    return ContentService.createTextOutput(JSON.stringify({ status: 'ERROR', message: 'Invalid API key' }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  // If the key is valid, return the "Hello, World!" message
  return ContentService.createTextOutput("Hello, World!");
}