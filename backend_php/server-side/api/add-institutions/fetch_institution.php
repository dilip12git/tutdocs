<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

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

    // Prepare SQL query to fetch all columns from user_institutions and count of files
    $sql = "SELECT ui.*, 
                   (SELECT COUNT(*) FROM files_table ft WHERE ft.institute_name = ui.institution_name) AS file_count
            FROM user_institutions ui
            ORDER BY file_count DESC
            LIMIT 20";

    $result = $conn->query($sql);

    if ($result === false) {
        throw new Exception("Query failed: " . $conn->error);
    }

    if ($result->num_rows > 0) {
        // Fetch result as an associative array
        $output = array();
        while($row = $result->fetch_assoc()) {
            $output[] = $row;
        }

        // Set appropriate headers for JSON response
        header("Content-Type: application/json");

        // Return the result as JSON
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
