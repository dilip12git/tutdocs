
<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

require_once 'db_connect.php';

function sendVerificationEmail($to, $verification_token) {
    $subject = "TutDocs - Verify your email";
    $message = '
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Verify your email address</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 600px;
                margin: 20px auto;
                padding: 20px;
                border: 1px solid #ccc;
                border-radius: 5px;
            }
            h2 {
                color: #333;
            }
            .verification-link {
                display: inline-block;
                padding: 10px 20px;
                background-color: #007bff;
                color: white;
                text-decoration: none;
                border-radius: 3px;
            }
            .verification-link:hover {
                background-color: #0056b3;
            }
            .expiration-text {
                color: dimgray;
                font-size: 11px;
                margin-top: 20px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>TutDocs</h1>
            <h2>Verify your email address</h2>
            <p>Please click the following link to verify your email:</p>
            <a class="verification-link" style="color: white" href="http://localhost/tutdocs/verify-email/?token=' . $verification_token . '">Verify email address</a>
            <p class="expiration-text">This link will expire in 5 days. If you did not make this request, please ignore this email.</p>
        </div>
    </body>
    </html>
    ';

    $headers = "From: noreply@tutdocs.com\r\n";
    $headers .= "Content-Type: text/html; charset=ISO-8859-1\r\n";

    // Send email
    if (mail($to, $subject, $message, $headers)) {
        return true; // Email sent successfully
    } else {
        return false; // Error sending email
    }
}
// Get POST data from Angular frontend
$postData = json_decode(file_get_contents("php://input"), true);

if (isset($postData['name']) && isset($postData['username']) && isset($postData['password']) && isset($postData['user_id']) && isset($postData['picture'])) {
    $name = $postData['name'];
    $username = $postData['username'];
    $password = $postData['password'];
    $user_id = $postData['user_id'];
    $picture = $postData['picture'];

    $random_string = bin2hex(random_bytes(16)); // Generate a random string (32 characters in length)
    $verification_token = hash('sha256', $user_id . $random_string);
    $expiration_date = date('Y-m-d H:i:s', strtotime('+5 days')); // Expiration date (5 days from now)

    // Check if the record exists before inserting
    $check_query = "SELECT COUNT(*) as count FROM email_verification WHERE user_id = '$user_id'";
    $result = $conn->query($check_query);
    $row = $result->fetch_assoc();

    if ($row['count'] == 0) {
        // Record doesn't exist, proceed with insertion
        $sql = "INSERT INTO email_verification (name, username, password, user_id, picture, verification_token, verified_status, token_expiration)
                VALUES ('$name', '$username', '$password', '$user_id', '$picture', '$verification_token', 'not_verified', '$expiration_date')";

        if ($conn->query($sql) === TRUE) {
            $to = $username; // User's email address

            // Call the function to send email
            $result = sendVerificationEmail($to, $verification_token);

            if ($result) {
                echo json_encode(array("message" => "success"));
            } else {
                echo json_encode(array("error" => "Error sending verification email."));
            }
        } else {
            echo json_encode(array("error" => "Error storing user data: " . $conn->error));
        }
    } else {
        // Record exists, delete and insert new data
        $delete_query = "DELETE FROM email_verification WHERE user_id = '$user_id'";
        if ($conn->query($delete_query) === TRUE) {
            $insert_query = "INSERT INTO email_verification (name, username, password, user_id, picture, verification_token, verified_status, token_expiration)
                             VALUES ('$name', '$username', '$password', '$user_id', '$picture', '$verification_token', 'not_verified', '$expiration_date')";

            if ($conn->query($insert_query) === TRUE) {
                // Call the function to send email for new record insertion
                $to=$username;
                $result = sendVerificationEmail($to, $verification_token);

                if ($result) {
                    echo json_encode(array("message" => "success"));
                } else {
                    echo json_encode(array("error" => "Error sending verification email."));
                }
            } else {
                echo json_encode(array("error" => "Error inserting new record: " . $conn->error));
            }
        } else {
            echo json_encode(array("error" => "Error deleting existing record: " . $conn->error));
        }
    }

    $conn->close();
} else {
    echo json_encode(array("error" => "Data not received."));
}
?>

