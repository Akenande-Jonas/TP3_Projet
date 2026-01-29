<?php
if (isset($_POST['message'])) {
    file_put_contents("message.txt", $_POST['message']);
    echo "OK"; // On répond juste "OK" au JavaScript
}
?>