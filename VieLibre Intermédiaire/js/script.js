//MENU RESPONSIVE
const boutonMenu = document.getElementById("boutonMenu");
const menuPrincipal = document.getElementById("menuPrincipal");

boutonMenu.addEventListener("click", () => {
  const estOuvert = menuPrincipal.classList.toggle("ouvert");
  boutonMenu.setAttribute("aria-expanded", estOuvert);
});

//CARROUSEL
const diapositives = document.querySelectorAll(".diapositive");
const conteneurPoints = document.getElementById("points");
const carrousel = document.getElementById("carrousel");
let actuel = 0;
let minuteur;

diapositives.forEach((_, i) => {
  const point = document.createElement("button");
  point.className = "point" + (i === 0 ? " active" : "");
  point.setAttribute("aria-label", "Aller à l'actualité " + (i + 1));
  point.addEventListener("click", () => {
    allerA(i);
    relancerAuto();
  });
  conteneurPoints.appendChild(point);
});
const points = document.querySelectorAll(".point");

function allerA(index) {
  diapositives[actuel].classList.remove("active");
  points[actuel].classList.remove("active");
  actuel = (index + diapositives.length) % diapositives.length;
  diapositives[actuel].classList.add("active");
  points[actuel].classList.add("active");
}

document.getElementById("boutonSuivant").addEventListener("click", () => { // BUG B4 : plante ici s'il n'y a pas de carrousel
  allerA(actuel + 1);
  relancerAuto();
});
document.getElementById("boutonPrecedent").addEventListener("click", () => {
  allerA(actuel - 1);
  relancerAuto();
});

function demarrerAuto() {
  minuteur = setInterval(() => allerA(actuel + 1), 5000);
}
function relancerAuto() {
  clearInterval(minuteur);
  demarrerAuto();
}


carrousel.addEventListener("mouseenter", () => clearInterval(minuteur));
carrousel.addEventListener("mouseleave", demarrerAuto);
demarrerAuto();

//FORMULAIRE DE CONTACT
const formulaire = document.getElementById("formContact");
const messageFormulaire = document.getElementById("messageFormulaire");

formulaire.addEventListener("submit", (evenement) => {
  evenement.preventDefault();
  let valide = true;

  formulaire.querySelectorAll("input, textarea").forEach((champ) => {
    const vide = champ.value.trim() === "";
    const emailInvalide =
      champ.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(champ.value);
    const enErreur = vide || emailInvalide;
    champ.classList.toggle("erreur", enErreur);
    if (enErreur) valide = false;
  });

  if (valide) {
    messageFormulaire.textContent = "Merci, votre message a bien été envoyé (simulation).";
    messageFormulaire.className = "message-formulaire ok";
    formulaire.reset();
  } else {
    messageFormulaire.textContent = "Merci de remplir correctement tous les champs.";
    messageFormulaire.className = "message-formulaire ko";
  }
});

//BOUTON RETOUR EN HAUT
const retourHaut = document.getElementById("retourHaut");

window.addEventListener("scroll", () => {
  retourHaut.hidden = window.scrollY < 600;
});
retourHaut.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

//BANDEAU COOKIES
const bandeau = document.getElementById("bandeauCookies");

try {
  if (!localStorage.getItem("cookiesAcceptes")) bandeau.hidden = false;
} catch (erreur) {
  bandeau.hidden = false;
}

document.getElementById("accepterCookies").addEventListener("click", () => {
  bandeau.hidden = true;
  try {
    localStorage.setItem("cookiesAcceptes", "oui");
  } catch (erreur) {}
});

// bugs relevés lors du controle de la v1 :

// BUG : aucune fonction ne vérifie que ses éléments existent.
// Sur une page sans carrousel, getElementById renvoie null et la ligne
// document.getElementById("boutonSuivant").addEventListener(...) plante :
// tout ce qui est écrit après (formulaire, retour en haut, cookies) ne s'exécute pas.
// BUG : seulement une classe (bordure rouge), aucun message sous le champ
// BUG : les informations sont recopiées telles qu'elles sont dans les données, sans règle d'affichage commune.
// BUG : quand on clique sur une flèche pendant le survol, relancerAuto() relance un minuteur.
// En quittant le carrousel, demarrerAuto() en lance un deuxième sans arrêter le premier
// La variable minuteur ne garde que le dernier : l'ancien tourne
// toujours et on ne peut plus l'arrêter. À chaque fois, le défilement va plus vite.
//BUG : aucun style de focus. Pire : on l'enlève sur le menu, les boutons
// et les champs parce que le contour « faisait moche ». Au clavier, on ne voit
//plus où on est. 
// BUG : pas de règle pour la page en cours 
// BUG : l'erreur n'est indiquée que par la couleur de la bordure
// BUG : le menu fermé a une hauteur de 0, mais ses liens existent toujours.
//Avec Tab, on passe dessus sans les voir (on ne sait plus où est le focus).
//BUG: rien n'indique la page ou la rubrique en cours
//BUG: pas de message sous les champs, seulement une bordure rouge + un message général
//BUG : défilement automatique toutes les 5 s, pas de bouton pause 
