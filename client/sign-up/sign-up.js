//Create Password toggle
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

//Confirm Password toggle
const toggleConfirm = document.getElementById("toggle-confirm-password");
const confirmInput = document.getElementById("confirm-password");

toggleConfirm.addEventListener("click", function () {
  if (confirmInput.type === "password") {
    confirmInput.type = "text";
    toggleConfirm.classList.replace("fa-eye-slash", "fa-eye");
  } else {
    confirmInput.type = "password";
    toggleConfirm.classList.replace("fa-eye", "fa-eye-slash");
  }
});
