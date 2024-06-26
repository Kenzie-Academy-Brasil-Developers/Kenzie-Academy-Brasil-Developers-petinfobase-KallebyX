import { baseUrl, userName, token } from "./index.js";


document.addEventListener('DOMContentLoaded', () => {
  const storedUserName = localStorage.getItem("@petInfo:userName"); // Retrieve username from localStorage

  getProfileData()
    .then((profileData) => {
      const { imageUrl } = profileData;
      const userImage = document.getElementById("user-image");
      const userNameElement = document.querySelector(".username1");
      userNameElement.textContent = storedUserName; // Use the retrieved username from localStorage
      userImage.src = imageUrl;
      addLogoutButtonListeners(); 
    })
    .catch((error) => {
      console.log(error);
    });

  const logoutButton = document.getElementById("logout-button");
  logoutButton.addEventListener("click", logout);
});

function showLogoutButton() {
  const sairImg = document.querySelector(".sair_img");
  const logoutButton = document.getElementById("logout-button");
  logoutButton.style.display = "block";
  sairImg.style.display = "block";
}

function hideLogoutButton() {
  const sairImg = document.querySelector(".sair_img");
  const logoutButton = document.getElementById("logout-button");
  logoutButton.style.display = "none";
  sairImg.style.display = "none";
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

async function getProfileData() {
  try {
    const token = localStorage.getItem("@petInfo:token");
    const response = await fetch(`${baseUrl}/users/profile`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (response.ok) {
      const profile = await response.json();
      const imageUrl = profile.avatar;
      const userName = profile.name;
      return { imageUrl, userName };
    } else {
      throw new Error("Falha ao obter dados do perfil.");
    }
  } catch (error) {
    console.log(error);
    throw new Error("Falha ao obter dados do perfil.");
  }
}