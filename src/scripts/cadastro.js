import { baseUrl } from "./index.js";

function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  toast.classList.remove('hidden');

  setTimeout(() => {
    toast.classList.remove('show');
    toast.classList.add('hidden');
  }, 9000);
}

async function createUser(requestBody) {
  try {
    const res = await fetch(`${baseUrl}/users/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const resJson = await res.json();

    if (res.ok) {
      localStorage.setItem('@petInfo:token', resJson.token);
      showToast('Usuário criado com sucesso', 'Acesse sua conta', '../pages/login/login.html');
      window.location.href = "../../index.html";
      return resJson;
    } else {
      throw new Error(resJson.message);
    }
  } catch (err) {
    showToast(err.message);
  }
}

function handleNewUser() {
  const inputs = document.querySelectorAll('input');
  const cadastroButton = document.querySelector('#cadastro__button');

  cadastroButton.addEventListener('click', (event) => {
    event.preventDefault();

    const newUser = {};
    inputs.forEach(input => {
      newUser[input.name] = input.value;
    });

    createUser(newUser);
  });
}

handleNewUser();

  
function retornar() {
  document.addEventListener('DOMContentLoaded', () => {
    const retornarButton2 = document.querySelector('#voltar__button');
    const retornarButton = document.querySelector('.retornar');

    retornarButton.addEventListener('click', () => {
      window.location.href = "../../index.html";
    });

    retornarButton2.addEventListener('click', () => {
      window.location.href = "../../index.html";
    });
  });
}



retornar();

