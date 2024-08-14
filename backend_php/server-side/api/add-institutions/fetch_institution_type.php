<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$servername = "localhost"; // Replace with your database server name
$username = "root"; // Replace with your database username
$password = ""; // Replace with your database password
$dbname = "u586818238_tutdocs_data"; // Replace with your database name

try {
    $conn = new mysqli($servername, $username, $password, $dbname);

    if ($conn->connect_error) {
        throw new Exception("Connection failed: " . $conn->connect_error);
    }

    // Prepare SQL query to fetch the last 20 institution names added with their types
    $sql = "SELECT institution_name, institution_type FROM user_institutions ORDER BY created_at DESC LIMIT 10";
    $result = $conn->query($sql);

    if ($result === false) {
        throw new Exception("Query failed: " . $conn->error);
    }

    if ($result->num_rows > 0) {
        // Fetch institutions and categorize by their types
        $universities = array();
        $highSchools = array();
        
        while ($row = $result->fetch_assoc()) {
            if ($row['institution_type'] === 'University') {
                $universities[] = $row['institution_name'];
            }
             elseif ($row['institution_type'] === 'College') {
                $universities[] = $row['institution_name'];
            }
             elseif ($row['institution_type'] === 'Institute') {
                $universities[] = $row['institution_name'];
            }
            elseif ($row['institution_type'] === 'High School') {
                $highSchools[] = $row['institution_name'];
            }
            // Add more conditions for other types if needed
        }

        // Create an associative array to hold universities and high schools
        $output = array(
            'universities' => $universities,
            'highSchools' => $highSchools
            // Add more arrays for other types if needed
        );

        // Set appropriate headers for JSON response
        header("Content-Type: application/json");

        // Return the categorized institutions as JSON
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
