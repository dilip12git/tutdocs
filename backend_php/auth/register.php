<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Check if it's a POST request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $postData = json_decode(file_get_contents('php://input'), true);

    // Check if required fields are present (email, name, picture, user_id, institution_name, selectedOption, password)
    if (isset($postData['user_id'], $postData['username'], $postData['name'], $postData['institution_name'], $postData['selectedOption'], $postData['password'])) {
        // Extract data from the POST request
        $currentUserId = $postData['user_id'];
        $email = $postData['username'];
        $name = $postData['name'];
        $picture = $postData['picture'];
        $study_at = $postData['institution_name'];
        $started_on = $postData['selectedOption'];
        $user_type = $postData['user_type'];
        $userPassword = $postData['password'];

        // Database connection
        require_once 'db_connect.php'; // Your database connection

        // Check if username (email) already exists
        $stmt = $conn->prepare("SELECT * FROM users WHERE user_id = ?");
        $stmt->bind_param("s", $currentUserId);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows > 0) {
            // Username already exists, return success or handle accordingly
            $response = array("success" => true, "message" => "User already exists");
            echo json_encode($response);
        } else {
            if(!empty($picture)){
                $user_profile=$picture;
            }
            else{
                 $profile_picture = createFirstLetterImage($name, $currentUserId);
             $user_profile="http://localhost/tutdocs/auth/".$profile_picture;
            }
            
            // Prepared statement to insert data into the database
            $stmt = $conn->prepare("INSERT INTO users (user_id, name, username, profile_picture, study_at,user_type, started_on, password) VALUES (?, ?,?, ?, ?, ?, ?, ?)");
            $stmt->bind_param("ssssssss", $currentUserId, $name, $email, $user_profile, $study_at,$user_type, $started_on, $userPassword);

            // Execute the statement
            if ($stmt->execute()) {
                // Optionally, start a session if needed
                session_start();
                $_SESSION['username'] = $currentUserId; // Store username in the session (you can add more user info if needed)

                $response = array("success" => true, "message" => "Data inserted successfully");
                echo json_encode($response);
            } else {
                $response = array("success" => false, "message" => "Error inserting data");
                echo json_encode($response);
            }

            // Close the statement
            $stmt->close();
        }
    } else {
        $response = array("success" => false, "message" => "Required fields are missing");
        echo json_encode($response);
    }
} else {
    $response = array("success" => false, "message" => "Invalid request method");
    echo json_encode($response);
}

function createFirstLetterImage($name,$currentUserId) {
    $firstLetter = strtoupper(substr($name, 0, 1)); // Get the first letter of the name
    // Set the structured URL for image storage
    $directory = 'users_profile/';
    // Check if directory exists, if not, create it
    if (!file_exists($directory) && !is_dir($directory)) {
        mkdir($directory, 0755, true); // Create directory recursively with proper permissions
    }

$image = imagecreate(200, 200);

$red = rand(0, 255);
$green = rand(0, 255);
$blue = rand(0, 255);

$bgColor = imagecolorallocate($image, $red, $green, $blue); // Save the background color

$textcolor = imagecolorallocate($image, 255, 255, 255);  

imagettftext($image, 100, 0, 55, 150, $textcolor, 'font/arial.ttf', $firstLetter);  

 $imagePath = $directory . $currentUserId . '_profile_picture.png';
imagepng($image, $imagePath);
imagedestroy($image);

return $imagePath;



}
?>
