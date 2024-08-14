<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Method: GET');
header('Content-Type: application/json');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');

// Establish database connection
// Database credentials
$servername = "localhost"; // Replace with your database server name or IP address
$username = "root"; // Replace with your database username
$password = ""; // Replace with your database password
$dbname = "u586818238_tutdocs_data"; // Replace with your database name

$conn = mysqli_connect($servername, $username, $password, $dbname);

if ($conn) {
    // Fetch the search term/query parameter 'q'
    $searchTerm = isset($_GET['q']) ? $_GET['q'] : '';

   //$searchTerm = $_GET['query']; // Assuming the search term is received via GET parameter

// Prevent SQL injection
//$searchTerm = mysqli_real_escape_string($conn, $searchTerm);

$query = "SELECT * FROM courses 
          WHERE course_name LIKE '%" . $searchTerm . "%' 
          OR course_code LIKE '%" . $searchTerm . "%'";
    
    // Execute the query
    $run = mysqli_query($conn, $query);

    if ($run) {
        // Fetch the search results as an associative array
        $searchItems = mysqli_fetch_all($run, MYSQLI_ASSOC);
        echo json_encode($searchItems, JSON_PRETTY_PRINT); // Output the results as JSON
    } else {
        $error = mysqli_error($conn);
        echo "Database error: " . $error; // Display error if query execution fails
    }
} else {
    echo "Database connection failed."; // Display if database connection fails
}
?>
