//toggle
const togglepassword = document.getElementById("toggle-password");
const passwordInput = document.getElementById("password");

togglepassword.addEventListener("click", function () {
  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    togglepassword.classList.replace("fa-eye-slash", "fa-eye");
  } else {
    passwordInput.type = "password";
    togglepassword.classList.replace("fa-eye", "fa-eye-slash");
  }
});
