export function displayMessage(message, type = "success") {
  const loginContainer = document.querySelector(".login-msg-container");
  const loginMessage = document.querySelector(".login-msg");

  if (!loginContainer || !loginMessage) {
    return;
  }

  loginMessage.textContent = message;

  if (type === "success") {
    loginContainer.style.backgroundColor = "rgba(103, 194, 58, 0.2)";
    loginContainer.style.borderColor = "#67c23a";
    loginMessage.style.color = "#fff";
  } else if (type === "error") {
    loginContainer.style.backgroundColor = "rgba(243, 18, 55, 0.2)";
    loginContainer.style.borderColor = "#ff0000ff";
    loginMessage.style.color = "#fefefeff";
  } else {
    loginContainer.style.backgroundColor = "rgba(254, 252, 132, 0.71)";
    loginContainer.style.borderColor = "#ffc400ff";
    loginMessage.style.color = "#ff6600ff";
  }

  loginContainer.style.display = "block";
  loginContainer.style.animation = "fadeInUp 0.4s forwards";

  setTimeout(() => {
    loginContainer.style.animation = "fadeOutDown 0.4s forwards";
    setTimeout(() => {
      loginContainer.style.display = "none";
    }, 400);
  }, 3000);
}
