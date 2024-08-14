<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Content-Type: application/json');
header('Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With');

// Check if it's a POST request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Check if required fields are present
    if (isset($_POST['user_id'])) {
        // Extract data from the POST request
        $currentUserId = $_POST['user_id'];
        $name = $_POST['name'];  // Add this line to extract 'name'
        $email = $_POST['username'];  // Add this line to extract 'username'
        $study_at = $_POST['institution_name'];  // Add this line to extract 'study_at'
        $user_type = $_POST['user_type'];  // Add this line to extract 'user_type'
        $started_on = $_POST['started_on'];  // Add this line to extract 'started_on'
        $picture = $_POST['picture']; 
            $address = $_POST['address']; 
                $branch = $_POST['branch']; 
                    $studying_year = $_POST['studying_year'];
                    $contact_no = $_POST['contact_no']; 

        // Database connection
        require_once 'db_connect.php';
if(!empty($_FILES['file'])){
$directory = "users_profile/";

// Open the directory
$dir = opendir($directory);

// Iterate over files in the directory
while (($file = readdir($dir)) !== false) {
    // Check if the file is a regular file (not a directory)
    if (is_file($directory . $file)) {
        // Check if the file name contains the user ID
        if (strpos($file, $currentUserId) !== false) {
            // Delete the file
            unlink($directory . $file);
            // echo "File deleted successfully.";
            break;  // Stop searching after deleting the first matching file
        }
    }
}

// Close the directory
closedir($dir);

// Move the uploaded file to the "users_files" folder with the user ID as the file name
$targetDirectory = "users_profile/";
$targetFile = $targetDirectory . $currentUserId;

// Move the new file to the "users_files" folder
$newTargetFile = $targetFile . "_" . basename($_FILES['file']['name']);
move_uploaded_file($_FILES['file']['tmp_name'], $newTargetFile);

    $profile_pictutreUrl="http://localhost/tutdocs/auth/".$newTargetFile;
}

if(!empty($profile_pictutreUrl)){
    $profile=$profile_pictutreUrl;
}
else{
    $profile=$picture;
}
// Prepared statement to update data in the database

$stmt = $conn->prepare("UPDATE users SET 
                        name = ?,
                        username = ?,
                        profile_picture = ?,
                        study_at = ?,
                        user_type = ?,
                        started_on = ?,
                        address = ?,
                        branch = ?,
                        studying_year = ?,
                        contact_no = ?
                        WHERE user_id = ?");
$stmt->bind_param("sssssssssss", $name, $email, $profile, $study_at, $user_type, $started_on, $address, $branch, $studying_year, $contact_no, $currentUserId);

// Execute the statement
if ($stmt->execute()) {
    $response = array("success" => true, "message" => "Data updated successfully");
    echo json_encode($response);
} else {
    $response = array("success" => false, "message" => "Error updating data");
    echo json_encode($response);
}

// Close the statement
$stmt->close();

    } else {
        $response = array("error" => false, "message" => "Data not received");
        echo json_encode($response);
    }
} else {
    $response = array("error" => false, "message" => "Invalid request method");
    echo json_encode($response);
}
?>
