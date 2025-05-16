function doPost(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName('Sheet1');

  // Extract the JSON data from the form submission
  const jsonDataString = e.parameter.columnBData;

  if (!jsonDataString) {
    Logger.log('No JSON data found in the form submission.');
    return ContentService.createTextOutput(JSON.stringify({ status: 'ERROR', message: 'No JSON data found' }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeader("Access-Control-Allow-Origin", "*")
      .setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  }

  let formDataJSON;
  try {
    formDataJSON = JSON.parse(jsonDataString);
  } catch (error) {
    Logger.log('Error parsing JSON data: ' + error);
    return ContentService.createTextOutput(JSON.stringify({ status: 'ERROR', message: 'Error parsing JSON data' }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeader("Access-Control-Allow-Origin", "*")
      .setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  }

  // Extract data from the JSON object
  const name = formDataJSON.name || '';
  const role = formDataJSON.role || '';
  let email = formDataJSON.email || '';
  const phone = formDataJSON.phone || '';
  const inventoryData = formDataJSON.inventoryData || {};

  // Build the row data array
  const rowData = [new Date(), jsonDataString]; // Store the entire JSON string in column B

  // Append the row to the sheet
  sheet.appendRow(rowData);

  // Send email notification with JSON attachment
  try {
    email = email.trim(); // Trim the email address
    const emailAddress = "rushcreek@gmail.com, " + email; // Replace with your email address
    const subject = "Assessment Submission by " + name;
    const body = "The JSON data of your EmpowerStrengths assessment is attached.\n\n You can use our custom GPT to analyze your data file at:\n\n https://chatgpt.com/g/g-67ed4ab1321c8191aee10ea6935a5736-empowerstrengths-assessment ";

    // Sanitize the email address to be a valid filename
    const filename = email.replace(/[^a-zA-Z0-9]/g, "_") + ".json";
    const attachment = Utilities.newBlob(jsonDataString, "application/json", filename);

    MailApp.sendEmail({
      to: emailAddress,
      subject: subject,
      body: body,
      attachments: [attachment]
    });

    Logger.log('Email notification sent successfully with JSON attachment.');
  } catch (emailError) {
    Logger.log('Error sending email: ' + emailError);
    return ContentService.createTextOutput(JSON.stringify({ status: 'ERROR', message: 'Error sending email: ' + emailError }))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeader("Access-Control-Allow-Origin", "*")
      .setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  }

  // Return a success message with CORS headers
  const response = ContentService.createTextOutput(JSON.stringify({ status: 'SUCCESS' }))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader("Access-Control-Allow-Origin", "*") // Allow all origins
    .setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS"); // Allow these methods

  return response;
}