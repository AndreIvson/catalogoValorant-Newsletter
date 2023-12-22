const modal = document.querySelector("#modal");
const openModal = document.querySelector(".open-button");
const closeModal = document.querySelector(".close-button");
const form = document.querySelector("#form");
const modalEditar = document.querySelector("#modalEditar");

openModal.addEventListener("click", () => {
    modal.showModal();
});

closeModal.addEventListener("click", () => {
    if (modal.open) {
        modal.close();
    }

    if (form) {
        form.reset();
    }
});

modal.addEventListener("close", () => {
    limparFormulario();
});

function limparFormulario() {
    const form = document.querySelector("#form");

    if (form) {
        form.reset();
    }
}

form.addEventListener("submit", (event) => {
    event.preventDefault();

    const nomeInput = form.querySelector("#name");
    const emailInput = form.querySelector("#email");

    const nome = nomeInput.value.trim();
    const email = emailInput.value.trim();

    const submitButton = event.submitter;

    const validarEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    if (!validarEmail(email)) {
        if (submitButton && submitButton.classList.contains('button-modal'))
            alert("Por favor, preencha comum e-mail valido");
        return;
    }

    if (nome === "" || email === "") {
        if (submitButton && submitButton.classList.contains('button-modal'))
            alert("Por favor, preencha todos os campos.");
        return;
    } else {
        modal.close();
    }

    let dadosCadastrados = JSON.parse(localStorage.getItem("dadosUsuario")) || [];
    const idInput = dadosCadastrados.length + 1;

    const formData = {
        id: idInput,
        nome,
        email
    };

    dadosCadastrados.push(formData);

    localStorage.setItem("dadosUsuario", JSON.stringify(dadosCadastrados));

    alert("Dados cadastrados com sucesso!")

    form.reset();

    atualizarTabelaAdmin();
}
);

document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM totalmente carregado!");

    const dadosJSON = localStorage.getItem("dadosUsuario");

    if (dadosJSON !== null && dadosJSON !== undefined) {
        try {
            const dadosCadastrados = JSON.parse(dadosJSON);
            console.log("Dados do usuário:", dadosCadastrados);
            atualizarTabelaAdmin();
        } catch (error) {
            console.error('Erro ao analisar dados do usuário:', error);
        }
    } else {
        console.log("Nenhum dado encontrado no localStorage");
    }
});
function atualizarTabelaAdmin() {
    const tabelaAdmin = document.getElementById('tabelaAdmin');
    const corpoTabela = tabelaAdmin.querySelector('tbody');
    const usuarios = JSON.parse(localStorage.getItem('dadosUsuario')) || [];

    corpoTabela.innerHTML = '';

    usuarios.forEach(usuario => {
        const row = corpoTabela.insertRow();
        const cellNome = row.insertCell(0);
        const cellEmail = row.insertCell(1);
        const cellAcoes = row.insertCell(2);

        cellNome.textContent = usuario.nome;
        cellEmail.textContent = usuario.email;

        const botaoEditar = document.createElement('button');
        botaoEditar.textContent = 'Editar';
        botaoEditar.classList.add('button-table');
        botaoEditar.addEventListener('click', () => showModalEditar(usuario));

        const botaoExcluir = document.createElement('button');
        botaoExcluir.textContent = 'Excluir';
        botaoExcluir.classList.add('button-table');
        botaoExcluir.addEventListener('click', () => excluirUsuario(usuario));

        cellAcoes.appendChild(botaoEditar);
        cellAcoes.appendChild(botaoExcluir);
    });
};


function showModalEditar(usuario) {
    const inputNome = document.getElementById('editNome');
    const inputEmail = document.getElementById('editEmail');
    const modalEditar = document.getElementById('modalEditar');

    if (!modalEditar || !inputNome || !inputEmail) {
        console.error('Elemento não encontrado dentro do modal de edição.');
        return;
    }

    preencherCamposEdicao(usuario);

    modalEditar.showModal();

    const btnSalvarEdicao = document.getElementById('btnSalvarEdicao');
    btnSalvarEdicao.addEventListener('click', function (event) {
        event.preventDefault();

        const novoNome = inputNome.value.trim();
        const novoEmail = inputEmail.value.trim();

        usuario.nome = novoNome;
        usuario.email = novoEmail;

        atualizarDadosLocalStorage(usuario);

        modalEditar.close();

        atualizarTabelaAdmin();
    });
}

function preencherCamposEdicao(usuario) {
    const inputNome = document.getElementById('editNome');
    const inputEmail = document.getElementById('editEmail');

    if (inputNome && inputEmail) {
        inputNome.value = usuario.nome;
        inputEmail.value = usuario.email;
    }
}

function fecharModalEditar() {
    const modalEditar = document.getElementById('modalEditar');
    if (modalEditar) {
        modalEditar.close();
    }
}

function atualizarDadosLocalStorage(novosDados) {
    const dadosCadastrados = JSON.parse(localStorage.getItem("dadosUsuario")) || [];

    if (novosDados && novosDados.id !== undefined) {
        const indiceUsuario = dadosCadastrados.findIndex(usuario => usuario.id === novosDados.id);

        if (indiceUsuario !== -1) {
            dadosCadastrados[indiceUsuario].nome = novosDados.nome;
            dadosCadastrados[indiceUsuario].email = novosDados.email;

            localStorage.setItem("dadosUsuario", JSON.stringify(dadosCadastrados));

            console.log(`Usuário com ID ${novosDados.id} atualizado com sucesso.`);
        } else {
            console.log(`Usuário com ID ${novosDados.id} não encontrado.`);
        }
    } else {
        console.error('Objeto novosDados inválido ou sem a propriedade "id".');
    }
}


const dadosCadastrados = JSON.parse(localStorage.getItem("dadosUsuario")) || [];
const idInput = dadosCadastrados.length + 1;
const usuario = {
    id: dadosCadastrados.id
}

const novosDados = {
    id: usuario.id,
    nome: form.querySelector("#editNome").value, 
    email: form.querySelector("#editEmail").value 
};

atualizarDadosLocalStorage(novosDados);

function excluirUsuario(usuario) {
    if (confirm(`Tem certeza de que deseja excluir ${usuario.nome}?`)) {

        const usuarios = JSON.parse(localStorage.getItem('dadosUsuario')) || [];
        const index = usuarios.findIndex(u => u.nome === usuario.nome && u.email === usuario.email);

        if (index !== -1) {
            usuarios.splice(index, 1);
            localStorage.setItem('dadosUsuario', JSON.stringify(usuarios));
        }

        atualizarTabelaAdmin();

        alert("Excluido com sucesso!")
    }
}