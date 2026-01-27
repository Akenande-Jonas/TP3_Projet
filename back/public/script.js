function envoyerTexte() {
    // Récupère le texte de l'input
    var texteSaisi = document.getElementById("monTexte").value;
    var statusDiv = document.getElementById("status");

    // Prépare les données pour l'envoi
    var formData = new FormData();
    formData.append("message", texteSaisi);

    // Envoyer à traitement.php sans recharger la page
    fetch("traitement.php", {
        method: "POST",
        body: formData
    })
        .then(response => {
            // Quand c'est fini
            statusDiv.innerText = "Message envoyé : " + texteSaisi;
            // Vider le champ texte si vous voulez
            document.getElementById("monTexte").value = "";
        })
        .catch(error => {
            statusDiv.innerText = "Erreur d'envoi !";
            statusDiv.style.color = "red";
        });
}