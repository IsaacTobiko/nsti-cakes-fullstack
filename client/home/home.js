// Current Year
document.getElementById("year").textContent = new Date().getFullYear();

// Hamburger Menu
const menuBtn = document.getElementById("menu-btn");
const mobileMenu = document.getElementById("mobile-menu");
menuBtn.addEventListener("click", function () {
  mobileMenu.classList.toggle("hidden");
});
