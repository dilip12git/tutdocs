<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Content-Type: application/json');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');

$response = [];

$postData = json_decode(file_get_contents("php://input"), true);

if (isset($postData['userId'], $postData['fileKey'], $postData['upload_by'])) {
    $userId = $postData['userId'];
    $fileKey = $postData['fileKey'];
    $uploadBy = $postData['upload_by'];
    $file_title=$postData['file_title'];
    $profile_picture=$postData['profle_picutre'];
    $current_time=$postData['current_time'];

    $servername = "localhost";
    $username = "root";
    $password = "";
    $dbname = "u586818238_tutdocs_data";

    $conn = new mysqli($servername, $username, $password, $dbname);

    if ($conn->connect_error) {
        $response['error'] = "Connection failed: " . $conn->connect_error;
        echo json_encode($response);
        exit();
    }

    // Query to fetch follower details along with their emails (usernames)
    $followerDetailsQuery = "SELECT u.user_id, u.name, u.username FROM users u INNER JOIN user_relationships r ON u.user_id = r.follow_by WHERE r.user_id = '$userId'";
    $followerDetailsResult = $conn->query($followerDetailsQuery);
    $followerDetails = ($followerDetailsResult) ? $followerDetailsResult->fetch_all(MYSQLI_ASSOC) : [];

    // Email configuration
    $from = 'noreply@tutdocs.com';  // Replace with your email address
    $fileUrl = 'http://localhost/tutdocs/view?document=' . $fileKey;
    $url='/view?document=' . $fileKey;
    $headers = "MIME-Version: 1.0" . "\r\n";
    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";
    $headers .= "From: Tutdocs <noreply@tutdocs.com>" . "\r\n";

    // Prepare SQL query to insert notifications
   $insertNotificationQuery = "INSERT INTO notification_table (user_id, name, title, message, url, file_title, profile_picture,status, time) VALUES (?, ?, ?,?, ?, ?, ?, ?, ?)";
$insertNotificationStmt = $conn->prepare($insertNotificationQuery);

    foreach ($followerDetails as $follower) {
        // Extract follower details
        $followerId = $follower['user_id'];
        $followerName = $follower['name'];
        $followerEmail = $follower['username'];
       

        // Send email to each follower
        $to = $followerEmail;
        $subject = 'New post from ' . $uploadBy;
   $message = '
    <html>
        <head>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                    background-color:whitesmoke;
                }
                .container {
                    width: 80%;
                    margin: auto;
                    overflow: hidden;
                }
                header {
                    background: #fff;
                    color: #333;
                    padding-top: 30px;
                    min-height: 70px;
                    border-bottom: #e8491d 4px solid;
                }
                main {
                    padding: 20px 0;
                }
                footer {
                    padding: 20px 0;
                    background: #333;
                    color: #fff;
                    text-align: center;
                }
                a{
                    color: white !important;
                    cursor: pointer;
                    background: #3092FA;
                    text-decoration:none;
                    padding:8px 12px;
                    border-radius:4px;
                }
            </style>
        </head>
        <body>
            <header>
                <div class="container">
                    <h1>Post Notification</h1>
                </div>
            </header>
            <main>
                <div class="container">
                    <p>Hello '.$followerName.',</p>
                    <p>We wanted to let you know that '.$uploadBy.' has posted a new document on TutDocs.</p>
                    <p>You can view the document by following this link:</p>
                     <a href="'.$fileUrl.'">View File</a>
                     <br><br>
                    <p>Thank you for using TutDocs!</p>
                </div>
            </main>
            <footer>
                <div class="container">
                    <p>&copy; ' . date("Y") . ' TutDocs. All rights reserved.</p>
                </div>
            </footer>
        </body>
    </html>';
    if (mail($to, $subject, $message, $headers)) {
            $response['success'][] = "Email sent to: $followerName ($to)";

            // Insert notification into the database
            $title='New Post';
            $notificationMessage = "Please take a moment to review and provide any necessary feedback.";
            $status='not_viewed';
            $insertNotificationStmt->bind_param("sssssssss", $followerId, $uploadBy, $title, $notificationMessage, $url, $file_title, $profile_picture,$status, $current_time);
            $insertNotificationStmt->execute();
        } else {
            $response['error'][] = "Error sending email to: $followerName ($to)";
        }
    }

    // Close prepared statement
    $insertNotificationStmt->close();

    // Close the database connection
    $conn->close();

    echo json_encode($response);
    exit();
} else {
    $response['error'] = "Data not received";
    echo json_encode($response);
    exit();
}
?>