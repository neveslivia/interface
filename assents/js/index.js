// Carregar e listar dados da API (GET)
fetch('http://localhost:8080/api/alunos', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
})
.then(response => response.json())
.then(data => {
  addlinha(data);
})
.catch(error => {
  console.log(error);
});

// Adicionar linhas na tabela
function addlinha(dadosAPI) {
  const tabela = document.getElementById('tabelaCorpo');
  tabela.innerHTML = ''; // limpa antes de adicionar

  dadosAPI.forEach(element => {
    const linha = document.createElement('tr');
    linha.innerHTML = `
      <td class="px-4 py-2">${element.id}</td>
      <td class="px-4 py-2">${element.nome}</td>
      <td class="px-4 py-2">${element.email}</td>
      <td class="px-4 py-2 space-x-2">
        <button class="bg-yellow-500 text-white px-2 py-1 rounded" onclick="prepararEdicao(${element.id}, '${element.nome}', '${element.email}')">Editar</button>
        <button class="bg-red-500 text-white px-2 py-1 rounded" onclick="removerAluno(${element.id})">Remover</button>
      </td>
    `;
    tabela.appendChild(linha);
  });
}

// Cadastrar novo aluno
function cadastrar() {
  event.preventDefault();
  const nome = document.getElementById('nome').value.trim();
  const email = document.getElementById('email').value.trim();

  if (nome && email) {
    fetch('http://localhost:8080/api/alunos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, email })
    })
    .then(response => response.json())
    .then(data => {
      Swal.fire('Sucesso!', 'Cadastro feito com sucesso', 'success');
      listar(); 
      document.getElementById('formCadastro').reset();
    })
    .catch(error => {
      console.error("Erro ao enviar dados:", error);
    });
  } else {
    Swal.fire('Erro!', 'Falta dados para cadastrar', 'error');
  }
}

// Atualizar aluno
function editarAluno(id) {
  const nome = document.getElementById('nome').value.trim();
  const email = document.getElementById('email').value.trim();

  if (nome && email) {
    fetch(`http://localhost:8080/api/alunos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, email })
    })
    .then(response => {
      if (response.ok) {
        Swal.fire('Atualizado!', 'Aluno editado com sucesso', 'success');
        listar();
        document.getElementById('formCadastro').reset();
        modoEdicaoId = null;
      } else {
        Swal.fire('Erro!', 'Falha ao atualizar aluno', 'error');
      }
    })
    .catch(error => {
      console.error("Erro ao atualizar:", error);
    });
  }
}

// Alterar comportamento do botão "Adicionar"
document.getElementById('formCadastro').addEventListener('submit', function (event) {
  event.preventDefault();
  if (modoEdicaoId !== null) {
    editarAluno(modoEdicaoId);
  } else {
    cadastrar();
  }
});

// Remover aluno
function removerAluno(id) {
  Swal.fire({
    icon: 'question',
    title: 'Você tem certeza?',
    showCancelButton: true,
    confirmButtonText: 'Sim',
    cancelButtonText: 'Não'
  }).then((result) => {
    if (result.isConfirmed) {
      fetch(`http://localhost:8080/api/alunos/${id}`, {
        method: 'DELETE'
      })
      .then(response => {
        if (response.ok) {
          Swal.fire('Removido!', 'Aluno excluído com sucesso!', 'success');
          listar();
        } else {
          Swal.fire('Erro!', 'Falha ao excluir aluno.', 'error');
        }
      })
      .catch(error => {
        Swal.fire('Erro!', 'Erro de conexão com o servidor.', 'error');
      });
    } else {
      Swal.fire('Cancelado', '', 'info');
    }
  });
}

// Atualizar lista
function listar() {
  fetch('http://localhost:8080/api/alunos', {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  })
  .then(response => response.json())
  .then(data => {
    addlinha(data);
  })
  .catch(error => {
    console.error("Erro ao buscar alunos:", error);
  });
}
