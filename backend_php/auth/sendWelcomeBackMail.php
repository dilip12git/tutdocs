<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Retrieve login data from the POST request
$loginData = json_decode(file_get_contents("php://input"));

// Extract necessary information (e.g., email address)
$email = $loginData->email;

$to = $email;
$subject = "Welcome Back";

$message = '
<html>
<head>
  <style>
    .tutdocs_mail_container {
      font-family: Arial, sans-serif;
      max-width: 600px;
         margin:0;     
       background:white;
       border-radius:10px;
       padding:15px 12px;
       border:1px solid #ccc;
       
       
    }



    p {
      margin-bottom: 15px;
    }
    a{
        background:#3092FA;
        color:white !important;
        text-decoration:none;
        border-radius:4px;
        padding:8px 12px;
        margin-top:10px;
        cursor:pointer;
    }
  </style>
  <title>Welcome Back</title>
</head>
<body>
  <div class="tutdocs_mail_container">
    <p>Dear User,</p>
    <p>We are delighted to welcome you back to our website. Your continued presence is highly appreciated.</p>
    <p>If there is anything you need or if you have questions, please donot hesitate to contact us.</p>
     <a href="http://localhost/tutdocs/home">Explore Study Material</a>
    <p>Best regards,</p>
    <p>Tutdocs</p>
  </div>
</body>
</html>
';

// Additional headers
$headers[] = 'MIME-Version: 1.0';
$headers[] = 'Content-type: text/html; charset=utf-8';

// Additional headers
$headers[] = 'From: Tutdocs <noreply@tutdocs.com>'; // Replace with your company's email address or a no-reply address

// Send the email
mail($to, $subject, $message, implode("\r\n", $headers));

// Respond to the Angular request
echo json_encode(['message' => 'Welcome back email sent successfully']);
?>
