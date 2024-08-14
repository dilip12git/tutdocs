<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Content-Type: application/json');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');


    // Database credentials
    $servername = "localhost"; // Replace with your database server name or IP address
    $username = "root"; // Replace with your database username
    $password = ""; // Replace with your database password
    $dbname = "u586818238_tutdocs_data"; // Replace with your database name

 try {
    $pdo = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    // Set PDO attributes (optional)
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    // Handle connection errors
    echo "Connection failed: " . $e->getMessage();
    exit();
}

$searchQuery = $_GET['query'];

$query = "
    SELECT user_id, name, study_at, username, profile_picture
    FROM users 
    WHERE
    users.name LIKE '%$searchQuery%'
    OR users.study_at LIKE '%$searchQuery%'
    OR users.user_id LIKE '%$searchQuery%'
   
";


// Execute the query and fetch results
// $pdo is your PDO database connection
$stmt = $pdo->query($query);
$results = $stmt->fetchAll(PDO::FETCH_ASSOC);
$response = array(
    "data" => $results // Place your query results under a "data" key in the response
);

// Return results as JSON with pretty print
header('Content-Type: application/json');
echo json_encode($response, JSON_PRETTY_PRINT);

?>