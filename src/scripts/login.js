import { baseUrl, token } from "./index.js"

async function loginRequest(loginBody) {
  try {
    const res = await fetch(`${baseUrl}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(loginBody)
    });

    const resJson = await res.json();

    if (res.ok) {
        localStorage.setItem('@petInfo:token', resJson.token);
        window.location.href = './src/pages/dashboard.html';
        return resJson;
    } else {
       throw new Error(resJson.message);
    }
  } catch (err) {
    alert(err);
  }
}

async function userAuthenticator(user) {
  try {
    const token = await loginRequest(user);

    if (token === localStorage.getItem('@petInfo:token')) {
      const profileInfos = await getProfileInfos();
      localStorage.setItem('@petInfo:userName', profileInfos.name);
    }
  } catch (err) {
    alert(err);
  }
}

async function getProfileInfos() {
  try {
    const token = localStorage.getItem('@petInfo:token');
    const res = await fetch(`${baseUrl}/users/profile`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const resJson = await res.json();

    if (res.ok) {
      return resJson;
    } else {
      throw new Error(resJson.message);
    }
  } catch (err) {
    alert(err);
  }
}

const botaoCadastro = document.querySelector('#cadastro__button');
botaoCadastro.addEventListener('click', () => {
  window.location.href = './src/pages/cadastro.html';
});

function handleLogin() {
  const inputs = document.querySelectorAll('.input');
  const button = document.querySelector('#login__button');
  let loginBody = {};

  button.addEventListener('click', async (event) => {
    event.preventDefault();

    inputs.forEach(input => {
      loginBody[input.name] = input.value;
    });
    await userAuthenticator(loginBody);
  });
}

handleLogin();