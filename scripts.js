const Modal = {
  open() {
    // ABRIR MODAL
    // ADICIONAR A CLASSE ACTIVE MODAL
    document.querySelector('.modal-overlay').classList.add('active')
  },
  close() {
    //FECHAR O MODAL
    //REMOVER A CLASSE ACTIVE MODAL
    document.querySelector('.modal-overlay').classList.remove('active')
  }
}

//AGORA VAMOS GUARDAR AS INFORMAÇÕES
// E VAMOS GUARDAR NO navegador
// NO LOCAL STORAGE STORAGE
const Storage = {
  get() {
    //esse JSON.parse, vai transformar uma string para um objeto novamente
    //isso possibilita retornar as transações novamente
    return JSON.parse(localStorage.getItem('dev.finances:transactions')) || []
    // a cima ele esta pegando a chave do local storage e rotornando
    //ou || retornando vazio
  },
  set(transactions) {
    //deve ser transformado em string pra guardar dentro do storage
    //e pra isso vamos utilizar o JSON.stringfy
    localStorage.setItem(
      'dev.finances:transactions',
      JSON.stringify(transactions)
    )
  }
}

//EU PRECISO SOMAR AS ENTRADAS
// depois eu preciso somar as saídas e
//remover das entradas o valor das saídas
//assim euterei o total
// ESTA FUNCAO A BAIXO FAZ ATUALIZACAO DOS CARDS
const Transaction = {
  all: Storage.get(),

  //essa funcao aqui pode receber listas
  // vamos utilizar desta maneira para que os itens,
  //venham de um lugar que é tipo um banco de dados
  //mas fica salvo no navegador
  //por isso esta fazendo este push
  add(transaction) {
    Transaction.all.push(transaction)
    App.reload()
  },
  //aqui vamos remover a transação
  remove(index) {
    //esse splice vai pegar a posição do array e deletar o elemento
    Transaction.all.splice(index, 1)

    App.reload()
  },
  //somar as entradas
  incomes() {
    let income = 0
    //pegar todas as transacoes
    // para cada transacao
    Transaction.all.forEach(transaction => {
      //se ela for maior que zero
      if (transaction.amount > 0) {
        //somar a uma variavel e retornar essa variavel
        //assim conseguimos colcocar no card o total
        //da trasancoes

        income += transaction.amount
      }
    })
    return income
  },
  //somaar as saidas
  expenses() {
    let expense = 0

    Transaction.all.forEach(transaction => {
      if (transaction.amount < 0) {
        expense += transaction.amount
      }
    })
    return expense
  },
  // entradas menos as saidas
  total() {
    return Transaction.incomes() + Transaction.expenses()
  }
}

// Eu preciso pegar minhas transações do meu JAVASCRIPT
// objeto aqui no javascript e
// colocar lá no html

const DOM = {
  transactionsContainer: document.querySelector('#data-table tbody'),
  //vai ser responvel por trabalhar com o Inner

  addTransaction(transaction, index) {
    // Criando um elemento na DOM através do javscript
    const tr = document.createElement('tr')
    tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)

    //O index é a posição do array
    tr.dataset.index = index

    DOM.transactionsContainer.appendChild(tr)
  },

  innerHTMLTransaction(transaction, index) {
    // criando uma classe no css pra validar os dados e
    // colocar em verde ou vermelho as entradas e saidas
    const CSSclass = transaction.amount > 0 ? 'income' : 'expense'

    const amount = Utils.formatCurrency(transaction.amount)

    //CRIANDO UM MODELO QUE TINHA NO HTML
    //Utilizando também o CSSclass para poder validar
    const html = `

              <td class="description">${transaction.description}</td>
              
              <td class="${CSSclass}">${amount}</td>

              <td class="date">${transaction.date}</td>
              <td>
                <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remover Transação" />
              </td>
        `
    return html
  },

  // Esta função a baixo aqui vai atualizar os cards
  updateBalance() {
    ;(document.getElementById('incomeDisplay').innerHTML = Utils.formatCurrency(
      Transaction.incomes()
    )),
      (document.getElementById('expensesDisplay').innerHTML =
        //ESTAMOS UTILIZANDO O FORMAT CURENCY PARA DEIXAR BONITO
        //ASSIM COLOCANDO O SINAL, A VIRGULA, E O SIFRAO
        Utils.formatCurrency(Transaction.expenses())),
      (document.getElementById('totalDisplay').innerHTML = Utils.formatCurrency(
        Transaction.total()
      ))
  },
  //aqui limpamos, pra deixar limpo o TBODY
  clearTransactions() {
    DOM.transactionsContainer.innerHTML = ''
  }
}

// FUNÇÃO PRA FORMATAR O BLOCO Transações
const Utils = {
  //a baixo vamos fazer o retorno de um valor formatado
  formatAmount(value) {
    //aqui a baixo estamos transformando em numero
    //caso o usuario coloque ponto ou virgula
    value = Number(value) * 100

    return value
  },

  //função para formatar  a data
  formatDate(date) {
    //o split ele vai separar( vai tirar o tracinho do meio da data)
    const splittedDate = date.split('-')
    return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
  },
  formatCurrency(value) {
    const signal = Number(value) < 0 ? '-' : ''
    //aqui a baixo ele vai procurar tudo que é caracter
    // e transformar em número

    value = String(value).replace(/\D/g, '')

    //aqui a baixo vamos pegar o valor e dividir por
    // 100 para que possa ficar quebrados os números

    value = Number(value) / 100
    //a baixo esta transformando e valor real brasileiro
    value = value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })
    //vai retornar o sinal e o valor pro amount
    return signal + value
  }
}

//Criando formulário
const Form = {
  //a baixo estamo linkando entre o javascript e o Html
  //pra pegar cada um dos inputs
  description: document.querySelector('input#description'),
  amount: document.querySelector('input#amount'),
  date: document.querySelector('input#date'),

  //aqui a baixo vamos receber os objetos com os valores
  getvalues() {
    return {
      description: Form.description.value,
      amount: Form.amount.value,
      date: Form.date.value
    }
  },

  validateFields() {
    //trim serve para fazer uma limpeza dos espaços vazios
    //então vamos fazer a limpeza e ver se o campo é vazio

    // esse if a baixo vai verificar se um dos campos esta vazio
    //caso esteja vazio ele vai entrar dentro do if
    if (description.trim() === '' || amount.trim() || date.trim() === '') {
      throw new Error('Por favor, preencha todos os campos')
    }
  },
  //estamos formatando a data
  FormatValues() {
    //aqui estamos pegando os objetos e largando dentro das variaveis
    let { description, amount, date } = Form.getvalues()
    amount = Utils.formatAmount(amount)

    date = Utils.formatDate(date)

    return {
      description: description,
      amount: amount,
      date: date
    }
  },

  //função para salvar a transação
  saveTransaction(transaction) {
    transaction.add(transaction)
  },

  clearFields() {
    Form.description.value = ''
    Form.amount.value = ''
    Form.date.value = ''
  },
  submit(event) {
    event.preventDefault()

    //o try cath pega o erro e é possível notificar uma mensagem de erro
    try {
      //1° verificar se todas as informações foram inseridas.
      //Form.validateFields()
      Form.FormatValues()
      const transaction = Form.FormatValues()
      //ativando a função de salvar a transação
      Transaction.add(transaction)
      //apagar os dados do formulário
      Form.clearFields()
      //feche o modal
      Modal.close()

      //
      //
    } catch (error) {
      alert(error.message)
    }

    //2° formatar os dados para salvar

    //salvar
    //apagar os dados do formulário
    // modal feche
    //atualizar o a aplicação
  }
}

//ESTE APP É UMA APLICAÇÃO PARA PODER UTILIZAR
//A MEMÓRIA DO NAVEGADOR, ONDE VAMOS SALVAR OS DADOS
const App = {
  init() {
    //NESTE INIT ELE VAI PEGAR TODOS OS ITENS E JOGAR EM UMA LISTA

    Transaction.all.forEach(DOM.addTransaction)
    DOM.updateBalance()
    Storage.set(Transaction.all)
  },
  //NESTE RELOAD ELE VAI LIMPAR OS ITENS DA LISTA
  reload() {
    DOM.clearTransactions()
    App.init()
  }
}

App.init()
//aqui escolhemos qual item da array vamos remover
//Transaction.remove(2)
