const criarPublicacaoButton = document.querySelector('#criar-publicacao');
const closeModal = document.querySelector('.closeModal');
const cancelarButton = document.querySelector('#cancelar');
const salvarButton = document.querySelector('#publicar_button');
const postForm = document.querySelector('.form_modal_post');

function abrirModal() {
  const modal = document.querySelector('.crar_post__modal');
  modal.showModal();
}

function fecharModal() {
  const modal = document.querySelector('.crar_post__modal');
  modal.close();
}

function handleModal() {
  criarPublicacaoButton.addEventListener('click', abrirModal);
  closeModal.addEventListener('click', fecharModal);
  cancelarButton.addEventListener('click', fecharModal);
  salvarButton.addEventListener('click', async (event) => {
    event.preventDefault();

    const post = {};
    const inputs = postForm.querySelectorAll('.add__input');
    inputs.forEach(input => {
      post[input.name] = input.value;
    });

    try {
      await createPost(post);
      fecharModal();
      renderCards();
    } catch (error) {
      alert(error.message);
    }
  });
}

handleModal();



function abrirEditModal() {
  const botaoAbrirModalEdit = document.getElementById('edit_button');
  const editModal = document.querySelector('.edit_post__modal');
  botaoAbrirModalEdit.addEventListener('click', () => {
    editModal.showModal();
  });
}
