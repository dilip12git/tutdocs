<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Content-Type: application/json');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');

// Read the POST data sent from Angular
$postData = json_decode(file_get_contents("php://input"), true);

// Check if loggedInUserId and userIdToFollow exist in the received data
if (isset($postData['loggedInUserId'], $postData['userIdToFollow'])) {
    $loggedInUserId = $postData['loggedInUserId'];
    $userIdToFollow = $postData['userIdToFollow'];
    $current_time=$postData['current_time'];
    $response = [];

    // Database credentials
    $servername = "localhost"; // Replace with your database server name or IP address
    $username = "root"; // Replace with your database username
    $password = ""; // Replace with your database password
    $dbname = "u586818238_tutdocs_data"; // Replace with your database name

    $conn = new mysqli($servername, $username, $password, $dbname);

    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    // Fetch follower's name from the users table using the loggedInUserId
    $followerName = "";
    $follower_profile='';
    $stmt = $conn->prepare("SELECT name, profile_picture FROM users WHERE user_id = ?");
    $stmt->bind_param("s", $loggedInUserId);
    $stmt->execute();
    $stmt->bind_result($followerName,$follower_profile);
    $stmt->fetch();
    $stmt->close();

    if ($followerName && $follower_profile) {
        // Fetch recipient's email from the users table using userIdToFollow
        $recipientEmail = "";
        $recipientName = "";
        
        $stmt = $conn->prepare("SELECT username, name FROM users WHERE user_id = ?");
        $stmt->bind_param("s", $userIdToFollow);
        $stmt->execute();
        $stmt->bind_result($recipientEmail, $recipientName);
        $stmt->fetch();
        $stmt->close();

        if ($recipientEmail && $recipientName) {
            // Insert into user_relationships table
            $stmt = $conn->prepare("INSERT INTO user_relationships (follow_by, user_id) VALUES (?, ?)");
            $stmt->bind_param("ss", $loggedInUserId, $userIdToFollow);

            if ($stmt->execute()) {
                $response['success'] = "User followed successfully";

                // Sending email notification to the user being followed
                $followerUserId = $loggedInUserId; // Use the logged-in user's ID

                // Send email notification to the user about the new follower
                $title="New Follower";

                $url='/profile/'. $followerUserId;
                $notificationMessage = "Stay engaged and keep sharing valuable content";
                 $status='not_viewed';
                // Insert notification into the notification table
                $stmt = $conn->prepare("INSERT INTO notification_table (user_id,name, title, message, url,profile_picture,status,time) VALUES (?,?,?,?,?,?,?,?)");
                $stmt->bind_param("ssssssss", $userIdToFollow,$followerName, $title, $notificationMessage,$url,$follower_profile,$status,$current_time);
                $stmt->execute();

                // Send email notification to the user being followed
                sendFollowerNotificationEmail($followerName, $followerUserId, $recipientEmail, $recipientName);

                echo json_encode($response);
            } else {
                $response['error'] = "Failed to follow user: " . $conn->error;
                echo json_encode($response);
            }

            $stmt->close();
        } else {
            echo json_encode(['error' => 'Recipient email not found']);
        }
    } else {
        echo json_encode(['error' => 'Follower name not found']);
    }

    $conn->close();
} else {
    echo json_encode(['error' => 'Invalid request']);
}

function sendFollowerNotificationEmail($followerName, $followerUserId, $recipientEmail, $recipientName)
{
    // Email subject
    $subject = "You have a new follower on Tutdocs.com";

    // URL for the "Follow Back" button
    $followBackUrl = "http://localhost/tutdocs/profile/" . $followerUserId;

    // Email content with HTML and inline CSS for styling
    $emailContent = "
    <html>
    <head>
        <style>
            /* Add your CSS styles here */
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                padding: 20px;
            }
            .container {
                background-color: #fff;
                border-radius: 5px;
                padding: 20px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            h2 {
                color: #333;
            }
            .follow-back-button {
                margin-top: 20px;
            }
            .follow-back-button a {
                display: inline-block;
                padding: 10px 20px;
                background-color: #007bff;
                color: #fff;
                text-decoration: none;
                border-radius: 5px;
            }
            .follow-back-button a:hover {
                background-color: #0056b3;
            }
        </style>
    </head>
    <body>
        <div class='container'>
            <h2>Dear, $recipientName</h2>
            <p>We are delighted to inform you that you've been followed by <i><b>$followerName</b></i> on tutdocs.com. Click the button below to follow back:</p>
            <div class='follow-back-button'>
                <a href='$followBackUrl'>Follow Back</a>
            </div>
            <p>Best regards,<br>The Tutdocs Team</p>
        </div>
    </body>
    </html>
    ";

    // Set additional email headers
    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $headers .= "From: Tutdocs <noreply@tutdocs.com>" . "\r\n";

    // Send the email
    $mailSent = mail($recipientEmail, $subject, $emailContent, $headers);

    // Check if the email was sent successfully
    if ($mailSent) {
        // echo "Email notification sent successfully to $recipientEmail";
    } else {
        echo "Failed to send the email notification";
    }
}
?>
