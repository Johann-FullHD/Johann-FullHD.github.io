<?php
// Check if form data was submitted
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  try {
    // Get form data
    $name = trim($_POST['name']);
    $email = trim($_POST['email']);
    $message = trim($_POST['message']);

    // Validate email address
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
      throw new Exception('Invalid email address');
    }

    // Set up the email headers
    $headers = "From: $name <$email>\r\n";
    $headers .= "Reply-To: $email\r\n";
    $headers .= "X-Mailer: PHP\r\n";

    // Send the email
    if (mail('kjohann1908@gmail.com', 'New Contact Form Submission', "Name: $name\nEmail: $email\nMessage:\n$message", $headers)) {
      echo 'Success';
    } else {
      throw new Exception('Error sending email');
    }
  } catch (Exception $e) {
    echo 'error: '. $e->getMessage();
  }
} else {
  echo 'error: Invalid request method';
}