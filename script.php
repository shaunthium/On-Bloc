<?php
  $url = ""; // Insert URL to Azure model here in production

  $cmd = $_POST["cmd"];
  if ($cmd == "prob") {
    $data = $_POST["data"];

    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $data);  //Post Fields
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

    $headers = array(
      'Content-Type: application/json',
      'Authorization: ' // Insert Authorization Key here in production
    );
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

    $server_output = curl_exec($ch);

    curl_close($ch);
  } else {
    $file = fopen("demo.csv", "r");

    $server_output = array();
    for ($i=0; $i<5; $i++) {
      $row = fgetcsv($file);
      $elem = array();
      $elem[] = $row[0];
      $elem[] = $row[1];
      $server_output[] = $elem;
    }

    fclose($file);
  }

  echo json_encode($server_output);
 ?>
