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

    if (isset($data['username'])) {
        $username = $data['username'];

        // Check if the username exists in the database
        $stmt = $conn->prepare("SELECT * FROM users WHERE username = :username");
        $stmt->bindParam(':username', $username);
        $stmt->execute();
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user) {
            // Fetch user's name
            $userName = $user['name']; // Assuming 'name' is the column in the 'users' table

            // Generate a random token and token expiration
            $resetToken = bin2hex(random_bytes(32));
            $tokenExpiration = date('Y-m-d H:i:s', strtotime('+1 hour'));

            // Update reset_token and token_expiration for the provided username/email
            $updateStmt = $conn->prepare("UPDATE users SET reset_token = ?, token_expiration = ? WHERE username = ?");
            $updateStmt->bindParam(1, $resetToken);
            $updateStmt->bindParam(2, $tokenExpiration);
            $updateStmt->bindParam(3, $username);
            $updateStmt->execute();

            // Construct the reset link
            $resetLink = "http://localhost/tutdocs/auth/create-new-password?token=$resetToken"; // Replace with your frontend reset link URL

            // Construct the email message with HTML content including user's name
            $subject = "Reset Password"; // Email subject
            $message = "<html>
            <head>
                <title>Password Reset Link</title>
            </head>
            <body>
                <h2>Hello $userName,</h2>
                <p>Click on the following link to reset your password:</p>
                <p><a href='$resetLink'>Reset Password</a></p>
                <p>If you did not request a password reset, you can ignore this email.</p>
                <p>Thank you!</p>
            </body>
            </html>";

            $to = $user['username']; // Assuming email is stored in the 'email' column of the 'users' table
            $from = "noreply@tutdocs.com";
            $headers = "MIME-Version: 1.0\r\n" .
                "Content-type: text/html; charset=UTF-8\r\n" .
                "From: Tutdocs <$from>\r\n" .
                "X-Mailer: PHP/" . phpversion();

            // Send the email
            if (mail($to, $subject, $message, $headers)) {
                // Email sent successfully
                $response['success'] = true;
                $response['message'] = "Reset password link sent successfully";
            } else {
                // Failed to send email
                $response['success'] = false;
                $response['message'] = "Failed to send reset password link";
            }
        } else {
            // User not found
            $response['success'] = false;
            $response['message'] = "Username not found";
        }
    } else {
        // Username not received
        $response['success'] = false;
        $response['message'] = "Username not received";
    }
} catch (PDOException $e) {
    // Connection or database error
    $response['success'] = false;
    $response['message'] = 'Connection failed: ' . $e->getMessage();
}

// Set response header to JSON format
header('Content-Type: application/json');

// Output the JSON response
echo json_encode($response);
?>
