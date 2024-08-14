<?php

// Database credentials
// Database credentials
$servername = "localhost"; // Replace with your database server name or IP address
$username = "root"; // Replace with your database username
$password = ""; // Replace with your database password
$dbname = "u586818238_tutdocs_data"; // Replace with your database name

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
} else {
   // echo "Connected successfully"; // You can remove this line after testing
}

// It's advisable to close the database connection when you're done using it
// $conn->close();

?>
