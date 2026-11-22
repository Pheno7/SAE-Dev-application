//MENU RESPONSIVE
const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

menuToggle.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", isOpen);
});

//CARROUSEL
const slides = document.querySelectorAll(".slide");
const dotsContainer = document.getElementById("dots");
const carousel = document.getElementById("carousel");
let current = 0;
let timer;

slides.forEach((_, i) => {
  const dot = document.createElement("button");
  dot.className = "dot" + (i === 0 ? " active" : "");
  dot.setAttribute("aria-label", "Aller à l'actualité " + (i + 1));
  dot.addEventListener("click", () => {
    goTo(i);
    restartAuto();
  });
  dotsContainer.appendChild(dot);
});
const dots = document.querySelectorAll(".dot");

function goTo(index) {
  slides[current].classList.remove("active");
  dots[current].classList.remove("active");
  current = (index + slides.length) % slides.length;
  slides[current].classList.add("active");
  dots[current].classList.add("active");
}

document.getElementById("nextBtn").addEventListener("click", () => { // BUG B4 : plante ici s'il n'y a pas de carrousel
  goTo(current + 1);
  restartAuto();
});
document.getElementById("prevBtn").addEventListener("click", () => {
  goTo(current - 1);
  restartAuto();
});

function startAuto() {
  timer = setInterval(() => goTo(current + 1), 5000);
}
function restartAuto() {
  clearInterval(timer);
  startAuto();
}


carousel.addEventListener("mouseenter", () => clearInterval(timer));
carousel.addEventListener("mouseleave", startAuto);
startAuto();

//FORMULAIRE DE CONTACT
const form = document.getElementById("contactForm");
const formMsg = document.getElementById("formMsg");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  let valid = true;

  form.querySelectorAll("input, textarea").forEach((field) => {
    const empty = field.value.trim() === "";
    const badEmail =
      field.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value);
    const hasError = empty || badEmail;
    field.classList.toggle("error", hasError);
    if (hasError) valid = false;
  });

  if (valid) {
    formMsg.textContent = "Merci, votre message a bien été envoyé (simulation).";
    formMsg.className = "form-msg ok";
    form.reset();
  } else {
    formMsg.textContent = "Merci de remplir correctement tous les champs.";
    formMsg.className = "form-msg ko";
  }
});

//BOUTON RETOUR EN HAUT
const toTop = document.getElementById("toTop");

window.addEventListener("scroll", () => {
  toTop.hidden = window.scrollY < 600;
});
toTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

//BANDEAU COOKIES
const banner = document.getElementById("cookieBanner");

try {
  if (!localStorage.getItem("cookiesAccepted")) banner.hidden = false;
} catch (e) {
  banner.hidden = false;
}

document.getElementById("cookieAccept").addEventListener("click", () => {
  banner.hidden = true;
  try {
    localStorage.setItem("cookiesAccepted", "yes");
  } catch (e) {}
});
