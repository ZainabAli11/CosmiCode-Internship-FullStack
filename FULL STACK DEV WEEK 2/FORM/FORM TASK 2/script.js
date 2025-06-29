function validateForm() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const message = document.getElementById("message");

  const emailPattern = /^[^ ]+@[^ ]+\.[a-z]{2,3}$/;
  const passwordPattern = /^(?=.*\d).{8,}$/;

  if (!emailPattern.test(email)) {
    message.textContent = "❌ Invalid email!";
    message.className = "message error";
    return false;
  }

  if (!passwordPattern.test(password)) {
    message.textContent = "❌ Password must be at least 8 characters and contain a number.";
    message.className = "message error";
    return false;
  }

  message.textContent = "✅ Login successful!";
  message.className = "message success";
  return false; // prevents actual form submission
}

function togglePassword() {
  const passwordInput = document.getElementById("password");
  const toggleBtn = document.querySelector(".toggle-password");

  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    toggleBtn.textContent = "Hide";
  } else {
    passwordInput.type = "password";
    toggleBtn.textContent = "Show";
  }
}
