<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Retrieving POST data
$postData = json_decode(file_get_contents("php://input"), true);

if ($postData) {
    $courseName = $postData['courseName'];
    $courseCode = $postData['courseCode'];
    $userID = $postData['userID']; // Assuming 'username' is included in the form data

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

        // // Check if the username already exists
        // $checkQuery = "SELECT * FROM courses WHERE user_id = :userID";
        // $checkStmt = $conn->prepare($checkQuery);
        // $checkStmt->bindParam(':userID', $userID);
        // $checkStmt->execute();

        // if ($checkStmt->rowCount() > 0) {
        //     // If the username exists, respond with a message
        //     $response = ['message' => 'User already exists. Data not inserted.'];
        //     echo json_encode($response);
        // } else {
            // Prepare SQL statement to insert data into the database
            $sql = "INSERT INTO courses(user_id, course_name, course_code)
                    VALUES (:userID, :courseName, :courseCode)";
            $stmt = $conn->prepare($sql);

            // Bind parameters and execute the query
            $stmt->bindParam(':courseName', $courseName);
            $stmt->bindParam(':courseCode', $courseCode);
            $stmt->bindParam(':userID', $userID);

            $stmt->execute();

            // Respond with success message
            $response = ['message' => 'Data inserted successfully'];
            echo json_encode($response);
        //}
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
