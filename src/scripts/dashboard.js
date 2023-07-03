import { baseUrl } from "/src/scripts/index.js";

document.addEventListener('DOMContentLoaded', () => {
  getProfileImage()
    .then((imageUrl) => {
      const userImage = document.getElementById("user-image");
      userImage.src = imageUrl;
    })
    .catch((error) => {
      console.log(error);
    });

  const logoutButton = document.getElementById("logout-button");
  logoutButton.addEventListener("click", logout);
});

function showLogoutButton() {
  const logoutButton = document.getElementById("logout-button");
  logoutButton.style.display = "block";
}

function hideLogoutButton() {
  const logoutButton = document.getElementById("logout-button");
  logoutButton.style.display = "none";
}

function addLogoutButtonListeners() {
  const userImage = document.getElementById("user-image");
  const logoutButton = document.getElementById("logout-button");

  userImage.addEventListener("mouseover", showLogoutButton);
  logoutButton.addEventListener("mouseleave", hideLogoutButton);
}

function logout() {
  localStorage.removeItem("@petInfo:token");
  localStorage.removeItem("@petInfo:userName");
  location.href = "../../index.html";
}

addLogoutButtonListeners();

async function getProfileImage() {
  try {
    const token = localStorage.getItem("@petInfo:token");
    const response = await fetch(`${baseUrl}/users/profile`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const profile = await response.json();

    if (response.ok) {
      const imageUrl = profile.avatar;
      return imageUrl;
    } else {
      throw new Error("Falha ao obter a imagem de perfil.");
    }
  } catch (error) {
    console.log(error);
    throw new Error("Falha ao obter a imagem de perfil.");
  }
}
