<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$response = array(); // Initialize the response array

// Database credentials
$servername = "localhost"; // Replace with your database server name or IP address
$db_username = "root"; // Replace with your database username
$db_password = ""; // Replace with your database password
$dbname = "u586818238_tutdocs_data"; // Replace with your database name

try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $db_username, $db_password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Check if 'username' exists in the POST request body
    $request_body = file_get_contents('php://input');
    $data = json_decode($request_body, true);

    if (isset($data['username'], $data['password'])) {
        $username = $data['username'];
        $password = $data['password'];

        // Check if the username exists
        $check_stmt = $conn->prepare("SELECT * FROM users WHERE username = :username");
        $check_stmt->bindParam(':username', $username);
        $check_stmt->execute();

        if ($check_stmt->rowCount() > 0) {
            // Username exists, proceed with password verification
            $stmt = $conn->prepare("SELECT * FROM users WHERE username = :username AND password = :password");
            $stmt->bindParam(':username', $username);
            $stmt->bindParam(':password', $password);
            $stmt->execute();

            // Check if the query returned any rows
            if ($stmt->rowCount() > 0) {
                $response['status'] = 'success';
                $response['message'] = 'Successfully Logged in!';
                // You can include additional data in the response if needed
            } else {
                $response['status'] = 'error';
                $response['message'] = 'Invalid password!';
            }
        } else {
            $response['status'] = 'error';
            $response['message'] = 'Username not found';
        }
    } else {
        $response['status'] = 'error';
        $response['message'] = 'Username or password not received';
    }
} catch (PDOException $e) {
    $response['status'] = 'error';
    $response['message'] = 'Connection failed: ' . $e->getMessage();
}

// Set response header to JSON format
header('Content-Type: application/json');

// Output the JSON response
echo json_encode($response);
?>
