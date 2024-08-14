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
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    // Set PDO error mode to exception
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Retrieve user_id from query parameter
    $user_id = $_GET['userId'];
       if($user_id){
           
       }
    // Prepare SQL statement to check user_id availability
    $stmt = $conn->prepare("SELECT COUNT(*) AS count FROM users WHERE user_id = :user_id");
    $stmt->bindParam(':user_id', $user_id);
    $stmt->execute();

    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    $count = $result['count'];

    if ($count > 0) {
        // User ID already exists, return response as JSON
        echo json_encode(array("available" => false));
    } else {
        // User ID is available, return response as JSON
        echo json_encode(array("available" => true));
    }
} catch (PDOException $e) {
    // Error handling - return error response as JSON
    echo json_encode(array("error" => "Database Error: " . $e->getMessage()));
}

// Close connection
$conn = null;
?>