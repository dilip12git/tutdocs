<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

$postData = json_decode(file_get_contents("php://input"));

// Check if 'user_id' is provided in the POST data
if (isset($postData->user_id)) {
    $user_id = $postData->user_id;

    $servername = "localhost"; // Replace with your database server name or IP address
    $username = "root"; // Replace with your database username
    $password = ""; // Replace with your database password
    $dbname = "u586818238_tutdocs_data"; // Replace with your database name

    $conn = new mysqli($servername, $username, $password, $dbname);

    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    // Fetch total files, view count, and download count for a specific user
    $sql = "SELECT 
                COUNT(*) AS total_files,
                SUM(like_count) AS total_likes,
                SUM(download_count) AS total_downloads,
                SUM(view_count) AS total_views
            FROM files_table 
            WHERE user_id = '$user_id'";

    $result = $conn->query($sql);

    if ($result && $result->num_rows > 0) {
        // Output data of the query
        $row = $result->fetch_assoc();
        $totalFiles = $row["total_files"];
        $totalLikes = $row["total_likes"];
        $totalDownloads = $row["total_downloads"];
          $totalViews=$row["total_views"];
        echo json_encode(["total_files" => $totalFiles, "total_likes" => $totalLikes, "total_downloads" => $totalDownloads, "total_views"=>$totalViews]);
    } else {
        echo json_encode(["total_files" => 0, "total_likes" => 0, "total_downloads" => 0,"total_views"=>0]);
    }

    $conn->close();
} else {
    echo json_encode(["error" => "user_id not provided"]);
}
?>
