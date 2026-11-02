// =========================================================
// MENU BURGER
// Les 3 étapes de presque tous les scripts :
//   1. SÉLECTIONNER les éléments
//   2. ÉCOUTER un événement (un clic)
//   3. MODIFIER la page (ajouter / retirer une classe CSS)
// =========================================================

// 1. SÉLECTIONNER : on écrit le sélecteur comme en CSS
const burger = document.querySelector(".burger");
const nav = document.querySelector(".nav");
const liens = document.querySelectorAll(".nav a");   // TOUS les liens du menu

// Une fonction réutilisable qui ferme le menu
function fermerMenu() {
  nav.classList.remove("ouvert");
  burger.classList.remove("ouvert");
  burger.setAttribute("aria-expanded", "false");
}

// 2. ÉCOUTER le clic sur le bouton burger
burger.addEventListener("click", () => {
  // 3. MODIFIER : toggle ajoute la classe si elle est absente,
  //    et la retire si elle est présente
  nav.classList.toggle("ouvert");
  burger.classList.toggle("ouvert");

  // On indique aux lecteurs d'écran si le menu est ouvert (true) ou fermé (false)
  const estOuvert = nav.classList.contains("ouvert");
  burger.setAttribute("aria-expanded", estOuvert);
});

// Quand on clique sur un lien du menu, on referme le menu
// forEach = « pour chaque lien de la liste »
liens.forEach((lien) => {
  lien.addEventListener("click", fermerMenu);
});

// =========================================================
// VISIONNEUSE DE LA GALERIE
// =========================================================

// 1. SÉLECTIONNER
const photos = document.querySelectorAll(".grille-galerie img");  // TOUTES les photos
const visionneuse = document.querySelector(".visionneuse");
const imageGrande = document.querySelector(".visionneuse-image");
const boutonFermer = document.querySelector(".visionneuse-fermer");

// 2. ÉCOUTER le clic sur CHAQUE photo
photos.forEach((photo) => {
  photo.addEventListener("click", () => {
    // 3. MODIFIER : on copie la photo cliquée dans la grande image
    imageGrande.src = photo.src;
    imageGrande.alt = photo.alt;
    visionneuse.classList.add("ouverte");
  });
});

// Une fonction réutilisable pour fermer
function fermerVisionneuse() {
  visionneuse.classList.remove("ouverte");
}

// Façon 1 : clic sur la croix ✕
boutonFermer.addEventListener("click", fermerVisionneuse);

// Façon 2 : clic sur le FOND sombre (mais pas sur la photo)
visionneuse.addEventListener("click", (event) => {
  if (event.target === visionneuse) {
    fermerVisionneuse();
  }
});

// Façon 3 : touche Échap du clavier
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    fermerVisionneuse();
  }
});


// =========================================================
// VÉRIFICATION DU FORMULAIRE DE CONTACT
// =========================================================

// 1. SÉLECTIONNER
const formulaire = document.querySelector(".formulaire");
const champNom = document.querySelector("#nom");
const champEmail = document.querySelector("#email");
const champMessage = document.querySelector("#message");
const messageFormulaire = document.querySelector(".formulaire-message");

// Affiche (ou efface) l'erreur d'un champ
function afficherErreur(champ, texte) {
  const zoneErreur = document.querySelector("#erreur-" + champ.id);  // ex. "#erreur-nom"
  zoneErreur.textContent = texte;

  if (texte === "") {
    champ.classList.remove("champ-invalide");   // pas d'erreur → bordure normale
  } else {
    champ.classList.add("champ-invalide");      // erreur → bordure rouge
  }
}

// Vérifie les 3 champs. Renvoie true si tout est bon, false sinon.
function verifierFormulaire() {
  let valide = true;

  // .trim() enlève les espaces au début et à la fin
  const nom = champNom.value.trim();
  const email = champEmail.value.trim();
  const message = champMessage.value.trim();

  // Le nom : au moins 2 caractères
  if (nom.length < 2) {
    afficherErreur(champNom, "Indiquez votre nom (2 lettres minimum).");
    valide = false;
  } else {
    afficherErreur(champNom, "");
  }

  // L'email : doit ressembler à quelque.chose@domaine.ext
  const modeleEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!modeleEmail.test(email)) {
    afficherErreur(champEmail, "Adresse email invalide (exemple : nom@gmail.com).");
    valide = false;
  } else {
    afficherErreur(champEmail, "");
  }

  // Le message : au moins 10 caractères
  if (message.length < 10) {
    afficherErreur(champMessage, "Votre message est trop court (10 caractères minimum).");
    valide = false;
  } else {
    afficherErreur(champMessage, "");
  }

  return valide;
}

// 2. ÉCOUTER l'envoi du formulaire
formulaire.addEventListener("submit", async (event) => {
  event.preventDefault();          // empêche la page de se recharger

  messageFormulaire.textContent = "";
  messageFormulaire.classList.remove("echec");

  if (!verifierFormulaire()) {     // si le formulaire n'est PAS valide…
    return;                        // … on s'arrête là
  }

  // Le bouton passe en « Envoi en cours… » et ne peut plus être cliqué
  const bouton = formulaire.querySelector("button");
  bouton.disabled = true;
  bouton.textContent = "Envoi en cours…";

  try {
    // 3. ENVOYER les données à Formspree, et ATTENDRE la réponse
    const reponse = await fetch("https://formspree.io/f/myeebpyv", {
      method: "POST",                         // POST = on ENVOIE des données
      body: new FormData(formulaire),         // tous les champs du formulaire
      headers: { Accept: "application/json" } // « réponds-moi en JSON, sans changer de page »
    });

    if (reponse.ok) {
      // Formspree a bien reçu le message
      messageFormulaire.textContent = "✓ Merci ! Votre message a bien été envoyé. Nous vous répondrons sous 24 h.";
      formulaire.reset();
    } else {
      // Formspree a répondu, mais avec une erreur
      messageFormulaire.textContent = "Désolé, l'envoi a échoué. Réessayez ou écrivez-nous sur WhatsApp.";
      messageFormulaire.classList.add("echec");
    }
  } catch (erreur) {
    // Pas de réponse du tout (pas de connexion Internet, par exemple)
    messageFormulaire.textContent = "Impossible d'envoyer : vérifiez votre connexion Internet.";
    messageFormulaire.classList.add("echec");
  }

  // Dans tous les cas, le bouton redevient normal
  bouton.disabled = false;
  bouton.textContent = "Envoyer";
});

