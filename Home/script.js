const btn = document.querySelector(".btn");
btn.addEventListener("mouseout", (e) => {
  e.preventDefault();
  btn.style.background = "red";
  document.querySelector("body").classList.add("copy");
});
