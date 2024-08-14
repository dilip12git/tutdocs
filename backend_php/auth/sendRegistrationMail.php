
<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");


$registrationData = json_decode(file_get_contents("php://input"));

// Extract necessary information (e.g., email address)
$email = $registrationData->email;
$name = $registrationData->name;

$to = $email;
$subject = "Registration Confirmation";

$message = '
<html>
<head>
  <title>Registration Confirmation</title>
</head>
<body>
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0;">
    <h2 style="color: #007bff;">Registration Successful</h2>
    <p>Dear '.$name.',</p>
    <p>Thank you for registering with our website. Your registration is successful.</p>
    <p>Please keep this email for your records.</p>
    <p>If you have any questions or need further assistance, feel free to contact us.</p>
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
echo json_encode(['message' => 'Email sent successfully']);
?>
