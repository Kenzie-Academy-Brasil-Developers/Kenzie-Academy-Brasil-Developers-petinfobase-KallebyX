import { baseUrl } from "./index.js";

export async function createPost(requestBody) {
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
      return data;
    } else {
      throw new Error(data.message || 'Erro na criação do post');
    }
  } 
    catch (error) {
    console.error(error);
    throw new Error('Erro na requisição');
  }
}

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
      } 
      catch (error) {
        alert(error.message);
      }
      const modal = document.querySelector('.crar_post__modal');
      modal.close();
    });
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
   } 
  catch (error) {
    console.error(error);
    throw new Error('Erro na requisição');
  }
}

export async function renderCards() {
  const postList = document.querySelector('.post_list');

  try {
    const posts = await getPosts();
    postList.innerHTML = '';

    posts.forEach(post => {
      const card = document.createElement('li');
      card.classList.add('post_card');

      const buttonUserInfoDiv = document.createElement('div');
      buttonUserInfoDiv.classList.add('button_user_info');

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

      const barra = document.createElement('p');
      barra.classList.add('barra');
      barra.textContent = `|`;
      userInfoDiv.appendChild(barra);

      const data = document.createElement('p');
      const dateOptions = { month: 'long', year: 'numeric' };
      const formattedDate = new Date(post.createdAt).toLocaleDateString(undefined, dateOptions);
      data.textContent = formattedDate;
      data.classList.add('post_data');
      userInfoDiv.appendChild(data);

      buttonUserInfoDiv.appendChild(userInfoDiv);

      const editarButton = document.createElement('button');
      editarButton.textContent = 'Editar';
      editarButton.classList.add('edit_button');
      editarButton.setAttribute('id', 'edit_button');
      editarButton.addEventListener('click', () => {
        const editModal = document.getElementById('edit_post__modal');
        const titleInput = editModal.querySelector('.title_input');
        const contentInput = editModal.querySelector('.content_input');

        titleInput.value = post.title;
        contentInput.value = post.content;

        editModal.setAttribute('data-post-id', post.id);
        editModal.showModal();
      });

      const deletarButton = document.createElement('button');
      deletarButton.textContent = 'Deletar';
      deletarButton.classList.add('delete_button');
      deletarButton.addEventListener('click', () => {
        deletePost(post.id)
          .then(() => {
            renderCards();
          })
          .catch(error => {
            alert(error.message);
          });
      })

      buttonUserInfoDiv.appendChild(editarButton);
      buttonUserInfoDiv.appendChild(deletarButton);

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

      const viewButton = document.createElement('button');
      viewButton.textContent = 'Acessar publicação';
      viewButton.classList.add('access_button');
      buttonDiv.appendChild(viewButton);
      buttonDiv.appendChild(viewButton);

      viewButton.addEventListener('click', () => {
        openViewModal(post);
      });


      card.appendChild(buttonUserInfoDiv);
      card.appendChild(titleContentDiv);
      card.appendChild(buttonDiv);
      postList.appendChild(card);
    });
  } catch (error) {
    console.error(error);
    alert('Erro ao renderizar os cards');
  }
  
}

function createDeleteToast() {
  const toast = document.createElement('div');
  toast.classList.add('toast');

  const iconContainer = document.createElement('div');
  iconContainer.classList.add('toast_icon-container');

  const image = document.createElement('img');
  image.src = '../img/check.png';
  image.alt = 'Ícone de confirmação de exclusão';
  iconContainer.appendChild(image);
  image.classList.add('toast_image');

  const title = document.createElement('h1');
  title.textContent = 'Post deletado com sucesso!';
  iconContainer.appendChild(title);
  title.classList.add('toast_title');

  const message = document.createElement('p');
  message.textContent = 'O post selecionado para exclusão foi deletado. A partir de agora não aparecerá no seu feed.';
  toast.appendChild(iconContainer);
  toast.appendChild(message);
  message.classList.add('toast_message');

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 1000);
}

async function deletePost(postId) {
  return new Promise((resolve, reject) => {
    const deleteModal = document.getElementById('delete_post__modal');
    const cancelButton = document.getElementById('cancelar');
    const confirmButton = document.getElementById('excluir_button');

    deleteModal.showModal();

    cancelButton.addEventListener('click', () => {
      deleteModal.close();
      reject(new Error('Exclusão cancelada pelo usuário'));
    });

    confirmButton.addEventListener('click', async () => {
      deleteModal.close();

      try {
        const token = localStorage.getItem('@petInfo:token');
        const options = {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          }
        };

        const response = await fetch(`${baseUrl}/posts/${postId}`, options);
        const data = await response.json();

        if (response.ok) {
          createDeleteToast();
          resolve(data);
        } else {
          throw new Error(data.message || 'Erro na exclusão do post');
        }
      } catch (error) {
        console.error(error);
        reject(error);
      }
    });
  });
}



document.addEventListener('DOMContentLoaded', () => {
  const deleteModal = document.getElementById('delete_post__modal');
  const closeButton = deleteModal.querySelector('.closeModal');
  const cancelButton = deleteModal.querySelector('#cancelar');

  closeButton.addEventListener('click', () => {
    deleteModal.close();
  });

  cancelButton.addEventListener('click', () => {
    deleteModal.close();
  });
});



async function updatePost(postId, updatedData) {
  try {
    const token = localStorage.getItem('@petInfo:token');
    const options = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(updatedData),
    };

    const response = await fetch(`${baseUrl}/posts/${postId}`, options);
    const data = await response.json();

    if (response.ok) {
      alert('Post atualizado com sucesso');
      return data;
    } else {
      throw new Error(data.message || 'Erro na atualização do post');
    }
  } catch (error) {
    console.error(error);
    throw new Error('Erro na requisição');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const editModal = document.getElementById('edit_post__modal');
  const closeButton = editModal.querySelector('.closeModal');
  const cancelButton = editModal.querySelector('#cancelar');
  const saveButton = editModal.querySelector('#publicar_button');

  closeButton.addEventListener('click', () => {
    editModal.close();
  });

  cancelButton.addEventListener('click', () => {
    editModal.close();
  });

  saveButton.addEventListener('click', async () => {
    const postId = editModal.getAttribute('data-post-id');
    const titleInput = editModal.querySelector('.content_input');
    const contentInput = editModal.querySelector('.content_input');

    const updatedData = {
      title: titleInput.value,
      content: contentInput.value,
    };

    try {
      await updatePost(postId, updatedData);
      renderCards();
    } catch (error) {
      alert(error.message);
    }

    editModal.close();
  });
});

function openViewModal(post) {
  const viewModal = document.getElementById('view_post__modal');
  const closeButton = viewModal.querySelector('.closeModal');
  const perfilImg = viewModal.querySelector('.perfil_img');
  const userName = viewModal.querySelector('.username');
  const data = viewModal.querySelector('.data');
  const titulo = viewModal.querySelector('.titulo');
  const content = viewModal.querySelector('.content');


  perfilImg.src = post.user.avatar;
  userName.textContent = post.user.username;
  data.textContent = new Date(post.createdAt).toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
  titulo.textContent = post.title;
  content.textContent = post.content;

  closeButton.addEventListener('click', () => {
    viewModal.close();
  });

  if (!viewModal.hasAttribute('open')) {
    viewModal.showModal();
  }
}


handleModal();