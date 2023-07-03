import { baseUrl } from "/src/scripts/index.js";

function handleModal() {
  const postForm = document.querySelector('.form_modal_post');
  const postButton = document.querySelector('#publicar_button');
  
  if (postForm && postButton) {
    postButton.addEventListener('click', async (event) => {
      event.preventDefault();
  
      const post = {};
      const inputs = postForm.querySelectorAll('.add__input');
      inputs.forEach(input => {
        post[input.name] = input.value;
      });
      console.log(post);
  
      try {
        await createPost(post);
        const posts = await getPosts();
      } catch (error) {
        alert(error.message);
      }
      const modal = document.querySelector('.modal');
      modal.close();
    });
  }
}

handleModal();


async function createPost(requestBody) {
  try {
    const token = localStorage.getItem('@petInfo:token');
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(requestBody),
    };

    const response = await fetch(`${baseUrl}/posts/create`, options);
    const data = await response.json();

    if (response.ok) {
      alert('Post criado com sucesso');
      return data;
    } else {
      throw new Error(data.message || 'Erro na criação do post');
    }
  } catch (error) {
    console.error(error);
    throw new Error('Erro na requisição');
  }
}

async function getPosts() {
  try {
    const token = localStorage.getItem('@petInfo:token');
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
    };

    const response = await fetch(`${baseUrl}/posts`, options);
    const data = await response.json();

    if (response.ok) {
      return data;
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    console.error(error);
    throw new Error('Erro na requisição');
  }
}

async function renderCards() {
  const postList = document.querySelector('.post_list');

  try {
    const posts = await getPosts();
    postList.innerHTML = '';

    posts.forEach(post => {
      const card = document.createElement('li');
      card.classList.add('post_card');

      const userInfoDiv = document.createElement('div');
      userInfoDiv.classList.add('user_info');

      const image = document.createElement('img');
      image.src = post.user.avatar;
      image.classList.add('post_image');
      userInfoDiv.appendChild(image);

      const user = document.createElement('p');
      user.textContent = post.user.username;
      user.classList.add('post_user');
      userInfoDiv.appendChild(user);

      const data = document.createElement('p');
      data.textContent = post.created_at;
      data.classList.add('post_data');
      userInfoDiv.appendChild(data);

      const editDeleteDiv = document.createElement('div');
      editDeleteDiv.classList.add('edit_delete');

      const editarButton = document.createElement('button');
      editarButton.textContent = 'Editar';
      editarButton.setAttribute("id", 'edit_button');
      editDeleteDiv.appendChild(editarButton);

      const deletarButton = document.createElement('button');
      deletarButton.textContent = 'Deletar';
      deletarButton.classList.add('delete_button');
      editDeleteDiv.appendChild(deletarButton);

      const titleContentDiv = document.createElement('div');
      titleContentDiv.classList.add('title_content');

      const title = document.createElement('h4');
      title.textContent = post.title;
      title.classList.add('post_title');
      titleContentDiv.appendChild(title);

      const content = document.createElement('p');
      content.textContent = post.content;
      content.classList.add('post_content');
      titleContentDiv.appendChild(content);

      const buttonDiv = document.createElement('div');
      buttonDiv.classList.add('access_button_div');

      const button = document.createElement('button');
      button.textContent = 'Acessar publicação';
      button.classList.add('access_button');
      button.addEventListener('click', () => {
        displayViewModal(post);
      });
      buttonDiv.appendChild(button);

      card.appendChild(userInfoDiv);
      card.appendChild(editDeleteDiv);
      card.appendChild(titleContentDiv);
      card.appendChild(buttonDiv);
      postList.appendChild(card);
    });
  } catch (error) {
    console.error(error);
    alert('Erro ao renderizar os cards');
  }
}



renderCards();
