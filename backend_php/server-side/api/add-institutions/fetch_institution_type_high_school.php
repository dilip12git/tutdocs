<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// $servername = "your_servername";
// $username = "your_username";
// $password = "your_password";
// $dbname = "your_database_name";

    // Database connection configuration
    $servername = "localhost"; // Replace with your database server name
    $username = "root"; // Replace with your database username
    $password = ""; // Replace with your database password
    $dbname = "u586818238_tutdocs_data"; // Replace with your database name

try {
    $conn = new mysqli($servername, $username, $password, $dbname);

    if ($conn->connect_error) {
        throw new Exception("Connection failed: " . $conn->connect_error);
    }

    // Prepare SQL query to fetch the last 20 institution names added
    $sql = "SELECT institution_name, country FROM user_institutions WHERE institution_type='High School' ORDER BY created_at DESC";
    $result = $conn->query($sql);

    if ($result === false) {
        throw new Exception("Query failed: " . $conn->error);
    }

    if ($result->num_rows > 0) {
        // Fetch all institution names as an associative array
        $output = array();
        while($row = $result->fetch_assoc()) {
            $output[] = $row;
        }

        // Set appropriate headers for JSON response
        header("Content-Type: application/json");

        // Return the institution names as JSON
        echo json_encode($output);
    } else {
        echo "0 results";
    }

    $conn->close();
} catch(Exception $e) {
    // Handle exceptions or errors
    echo "Error: " . $e->getMessage();
}
?>
