<?php
// Vérifie si un message a été envoyé
if (isset($_POST['message'])) {
    
    // Récupère le texte
    $texte = $_POST['message'];

    // Écrit le texte dans le fichier (écrase l'ancien contenu)
    // Assurez-vous que message.txt a les permissions d'écriture (chmod 777)
    file_put_contents("message.txt", $texte);
}

// Redirige l'utilisateur vers index.html pour qu'il ne reste pas sur une page blanche
header("Location: index.html");
exit();
?>