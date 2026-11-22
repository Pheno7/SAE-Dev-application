document.documentElement.classList.add("js");

//MENU RESPONSIVE
function initMenuMobile() {
  const bouton = document.getElementById("boutonMenu");
  const menu = document.getElementById("menuPrincipal");
  if (!bouton || !menu) return;

  function changerEtatMenu(ouvrir) {
    bouton.setAttribute("aria-expanded", String(ouvrir));
    menu.classList.toggle("ouvert", ouvrir);
  }

  bouton.addEventListener("click", () => {
    const estOuvert = bouton.getAttribute("aria-expanded") === "true";
    changerEtatMenu(!estOuvert);
  });

  document.addEventListener("keydown", (evenement) => {
    const estOuvert = bouton.getAttribute("aria-expanded") === "true";
    if (evenement.key === "Escape" && estOuvert) {
      changerEtatMenu(false);
      bouton.focus();
    }
  });
}


//FORMULAIRE DE CONTACT
const FORMAT_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// renvoie le message d'erreur du champ, ou "" si le champ est bon
function verifierChamp(champ) {
  if (champ.type === "checkbox") {
    return champ.checked ? "" : "Cochez cette case pour pouvoir envoyer votre message.";
  }
  const valeur = champ.value.trim();
  if (valeur === "") {
    return "Ce champ est requis.";
  }
  if (champ.type === "email" && !FORMAT_EMAIL.test(valeur)) {
    return "Adresse e-mail invalide. Exemple : prenom.nom@exemple.fr";
  }
  return "";
}

// le message s'écrit dans le <p id="erreur-..."> sous le champ (avant on avait juste une bordure rouge)
function afficherErreur(champ, message) {
  const zoneErreur = document.getElementById("erreur-" + champ.id);
  if (zoneErreur) zoneErreur.textContent = message;
  champ.setAttribute("aria-invalid", message === "" ? "false" : "true");
  champ.classList.toggle("champ-invalide", message !== "");
}

function initFormulaireContact() {
  const formulaire = document.getElementById("formContact");
  const messageGlobal = document.getElementById("messageFormulaire");
  if (!formulaire || !messageGlobal) return;

  const champs = formulaire.querySelectorAll("input, textarea");

  // l'erreur disparaît dès que l'utilisateur corrige le champ
  champs.forEach((champ) => {
    champ.addEventListener("input", () => {
      if (champ.getAttribute("aria-invalid") === "true") {
        afficherErreur(champ, verifierChamp(champ));
      }
    });
  });

  formulaire.addEventListener("submit", (evenement) => {
    evenement.preventDefault();

    let premierChampEnErreur = null;
    champs.forEach((champ) => {
      const erreur = verifierChamp(champ);
      afficherErreur(champ, erreur);
      if (erreur !== "" && premierChampEnErreur === null) {
        premierChampEnErreur = champ;
      }
    });

    if (premierChampEnErreur !== null) {
      messageGlobal.textContent = "Le message n'a pas été envoyé : corrigez les champs signalés.";
      messageGlobal.className = "message-formulaire erreur";
      return;
    }

    messageGlobal.textContent = "Merci, votre message est prêt à être envoyé (prototype : aucun envoi réel).";
    messageGlobal.className = "message-formulaire succes";
    formulaire.reset();
    champs.forEach((champ) => afficherErreur(champ, ""));
  });
}


// ===== ÉVÉNEMENTS PASSÉS =====
function initEvenementsPasses() {
  const aujourdHui = new Date().toISOString().slice(0, 10);

  document.querySelectorAll(".evenement[data-date]").forEach((evenement) => {
    // dates au format AAAA-MM-JJ, donc on peut les comparer comme du texte
    if (evenement.dataset.date < aujourdHui) {
      evenement.classList.add("passe");
      const mention = document.createElement("p");
      mention.className = "mention-passe";
      mention.textContent = "Événement terminé";
      evenement.prepend(mention);
    }
  });
}


// ===== RETOUR EN HAUT =====
// c'est maintenant un lien vers #haut : pas besoin de gérer le clic en JS
function initRetourEnHaut() {
  const lien = document.getElementById("retourHaut");
  if (!lien) return;

  window.addEventListener("scroll", () => {
    lien.hidden = window.scrollY < 600;
  });
}


//BANDEAU COOKIES
function lireChoixCookies() {
  try {
    return localStorage.getItem("choixCookies");
  } catch (erreur) {
    return null;
  }
}

function enregistrerChoixCookies(choix) {
  try {
    localStorage.setItem("choixCookies", choix);
  } catch (erreur) {}
}

function initBandeauCookies() {
  const bandeau = document.getElementById("bandeauCookies");
  if (!bandeau) return;

  if (lireChoixCookies() === null) {
    bandeau.hidden = false;
  }

  bandeau.querySelectorAll("button[data-choix]").forEach((bouton) => {
    bouton.addEventListener("click", () => {
      enregistrerChoixCookies(bouton.dataset.choix);
      bandeau.hidden = true;
    });
  });
}


initMenuMobile();
initFormulaireContact();
initEvenementsPasses();
initRetourEnHaut();
initBandeauCookies();
