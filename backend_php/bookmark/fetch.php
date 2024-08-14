<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Read the POST data sent from Angular
$postData = json_decode(file_get_contents("php://input"), true);

if (isset($postData['userId'])) {
    $user_id = $postData['userId'];
    
    $servername = "localhost"; // Replace with your database server name or IP address
    $username = "root"; // Replace with your database username
    $password = ""; // Replace with your database password
    $dbname = "u586818238_tutdocs_data"; // Replace with your database name


try {
    // Connect to the database using PDO
    $pdo = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Prepare SQL query to fetch file details from files_table based on bookmark table
    $sql = "SELECT ft.* 
            FROM files_table ft
            JOIN bookmarks b ON ft.file_key = b.file_key
            WHERE b.user_id = :user_id";
    
    // Prepare the SQL statement
    $stmt = $pdo->prepare($sql);

    // Bind parameters
    $stmt->bindParam(':user_id', $user_id);
 

    // Execute the query
    $stmt->execute();

    // Fetch all matching rows as associative arrays
    $file_details = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Return the fetched data as JSON response
    header('Content-Type: application/json');
    echo json_encode($file_details);
} catch(PDOException $e) {
    // Handle database connection or query errors
    $error = array('error' => $e->getMessage());
    echo json_encode($error);
}

} else {
    echo json_encode(array("error" => "Invalid request"));
}
?>