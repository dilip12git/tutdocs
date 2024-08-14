<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Retrieving POST data
$postData = json_decode(file_get_contents("php://input"), true);

// Add var_dump here to inspect the structure of $postData
// var_dump($postData);

if ($postData) {
    $selectedOption = $postData['selectedOption'];
    $country = $postData['country'];
    $institutionName = $postData['institutionName'];
    $websiteUrl = $postData['websiteUrl'];
    $userEmail = $postData['username']['email'];
    // Rest of your code...

    // Database connection configuration
    $servername = "localhost"; // Replace with your database server name
    $username_db = "root"; // Replace with your database username
    $password_db = ""; // Replace with your database password
    $dbname = "u586818238_tutdocs_data"; // Replace with your database name

    try {
        // Create connection
        $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username_db, $password_db);
        // Set the PDO error mode to exception
        $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        // Check if the username already exists
        $checkQuery = "SELECT * FROM user_institutions WHERE username = :username";
        $checkStmt = $conn->prepare($checkQuery);
        $checkStmt->bindParam(':username', $userEmail);
        $checkStmt->execute();

        if ($checkStmt->rowCount() > 0) {
            // If the username exists, respond with a message
            $response = ['message' => 'User already exists. Data not inserted.'];
            echo json_encode($response);
        } else {
            // Prepare SQL statement to insert data into the database
            $sql = "INSERT INTO user_institutions(username, institution_type, country, institution_name, institution_url)
                    VALUES (:username, :selectedOption, :country, :institutionName, :websiteUrl)";
            $stmt = $conn->prepare($sql);

            // Bind parameters and execute the query
            $stmt->bindParam(':selectedOption', $selectedOption);
            $stmt->bindParam(':country', $country);
            $stmt->bindParam(':institutionName', $institutionName);
            $stmt->bindParam(':websiteUrl', $websiteUrl);
            $stmt->bindParam(':username', $userEmail);

            $stmt->execute();

            // Respond with success message
            $response = ['message' => 'Data inserted successfully'];
            echo json_encode($response);
        }
    } catch (PDOException $e) {
        // Respond with error message
        $errorResponse = ['error' => 'Error inserting data: ' . $e->getMessage()];
        echo json_encode($errorResponse);
    }

    // Close the database connection
    $conn = null;
} else {
    // If no POST data received
    $errorResponse = ['error' => 'No data received'];
    echo json_encode($errorResponse);
}
?>
