<?php
require 'PHPMailer/PHPMailerAutoload.php';
// Check if form data was submitted
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  // Get form data
  $name = $_POST['name'];
  $email = $_POST['email'];
  $message = $_POST['message'];

  // Send email
  $to = 'kjohann1908@gmail.com';
  $subject = 'New Contact Form Submission';
  $headers = 'From: '. $email;
  $body = "Name: $name\nEmail: $email\nMessage:\n$message";

  if (mail($to, $subject, $body, $headers)) {
    echo 'success';
  } else {
    echo 'error';
  }
} else {
  echo 'error';
}