//Create Password Toggle
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

//Confirm Password Toggle
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

//Password Check
const form = document.getElementById("sign-up-form");
const passwordInput2 = document.getElementById("password");
const confirmInput2 = document.getElementById("confirm-password");
const passwordError = document.getElementById("password-error");

form.addEventListener("submit", function (event) {
  if (passwordInput2.value !== confirmInput2.value) {
    event.preventDefault();
    passwordError.classList.remove("hidden");
  } else {
    passwordError.classList.add("hidden");
  }
});

//Real Time Password Check
confirmInput.addEventListener("input", function () {
  if (passwordInput.value !== confirmInput.value) {
    passwordError.classList.remove("hidden");
  } else {
    passwordError.classList.add("hidden");
  }
});

//Password Strength Checker
const passwordStrength = document.getElementById("password-strength");

passwordInput.addEventListener("input", function () {
  const value = passwordInput.value;

  passwordStrength.classList.remove("hidden");

  if (value.length === 0) {
    passwordStrength.classList.add("hidden");
  } else if (value.length < 6) {
    passwordStrength.textContent = "Weak password";
    passwordStrength.className = "text-sm text-red-500";
  } else if (value.length < 10) {
    passwordStrength.textContent = "Medium password";
    passwordStrength.className = "text-sm text-yellow-500";
  } else {
    passwordStrength.textContent = "Strong password";
    passwordStrength.className = "text-sm text-green-500";
  }
});

//Email Format Checker
const emailInput = document.getElementById("email");
const emailError = document.getElementById("email-error");

emailInput.addEventListener("input", function () {
  const value = emailInput.value;

  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (value.length === 0) {
    emailError.classList.add("hidden");
  } else if (!validEmail.test(value)) {
    emailError.classList.remove("hidden");
  } else {
    emailError.classList.add("hidden");
  }
});
