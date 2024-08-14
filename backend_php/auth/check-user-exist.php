<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Check if userID exists in the POST request
if (isset($_POST['user_id'],$_POST['username'])) {
    $currentUserId = $_POST['user_id'];
    $username=$_POST['username'];

  // Database credentials
$servername = "localhost"; // Replace with your database server name or IP address
$username = "root"; // Replace with your database username
$password = ""; // Replace with your database password
$dbname = "u586818238_tutdocs_data"; // Replace with your database name

    $conn = new mysqli($servername, $username, $password, $dbname);

    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
  // Prepare SQL statement with a prepared statement to prevent SQL injection
  $stmt = $conn->prepare("SELECT * FROM users WHERE user_id = ? AND username = ?");
  $stmt->bind_param("ss", $currentUserId,$username);
  $stmt->execute();
  $result = $stmt->get_result();

  // Check if the userID exists
  if ($result->num_rows > 0) {
      echo json_encode(true); // Send true indicating existence
  } else {
      echo json_encode(false); // Send false indicating non-existence
  }

  $stmt->close();
  $conn->close();

} else {
  // Handle the case where userID is not available in the POST request
  echo json_encode(false); // Send a JSON response indicating false
}
?>