<?php

$name = Trim(stripslashes($_POST['name']));
$email = Trim(stripslashes($_POST['email']));
$message = Trim(stripslashes($_POST['message']));
$emailTo = "sarahbethholden@gmail.com";
$subject = "New inquiry from {$name}";

$headersfrom='';
$headersfrom .= 'MIME-Version: 1.0' . "\r\n";
$headersfrom .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";
$headersfrom .= 'From: '.$email.' '. "\r\n";

// prepare email body text
$body = "";
$body .= "<p><strong>From:</strong> {$name}</p>";
$body .= "<p><strong>Message:</strong> {$message}</p>";



// send email
$success = mail($emailTo, $subject, $body, $headersfrom);

// redirect to success page
header('Content-type: application/json');
echo json_encode($response_array);
if ($success) {
  $response_array['status'] = 'success';
}
else {
  $response_array['status'] = 'error';
}
?>
