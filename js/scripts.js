// Função para abrir e fechar uma nova transação

const Modal = {
    open(){
        // Abrir modal
        // Adicionar a class active ao modal
        document
            .querySelector('.modal-overlay')
            .classList
            .add('active')

    },
    close(){
        // fechar o modal
        // remover a class active do modal
        document
            .querySelector('.modal-overlay')
            .classList
            .remove('active')
    },
}

// Função para para abrir e fechar a tela de erro
const error = {
    open(){
        document.querySelector('.error').classList.add('active')
    },

    closeError(){
        document.querySelector('.error').classList.remove('active')
    }
}

// Salvar um cache da pagina

const Storage = {
    get(){
        return JSON.parse(localStorage.getItem("dev.finances:transactions")) || []
    }, 

    set(transaction){
        localStorage.setItem("dev.finances:transactions", JSON.stringify(transaction))
    }
}

// Soma de entradas e saidas e Adicionar e Remover transações

const Transaction = {
    all: Storage.get(),

    //Adicionar uma nova transação 

    add(transaction){
        Transaction.all.push(transaction);

        App.reload()
    },

    //Remover uma transação

    remove(index){
        Transaction.all.splice(index, 1)

        App.reload()
    },

    // Soma de entradas
    incomes(){
        let income = 0;

        Transaction.all.forEach(transaction => {
            if (transaction.amount > 0){
                income += transaction.amount;
            }
        })

        return income;
    },

    // Soma de saidas
    expenses(){
        let expense = 0;

        Transaction.all.forEach(transaction => {
            if (transaction.amount < 0){
                expense += transaction.amount;
            }
        })

        return expense;
    }, 

    // Soma do total
    total(){
        return Transaction.incomes() + Transaction.expenses();
    }
}

// Traz todas as informação do HTML
const DOM = {
// Buscar e criar uma nova estrutura da tabela

    transactionsContainer: document.querySelector('#data-table tbody'),

// Adicionar Elementos ao HTML 
    addTransaction(transaction, index){
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransition(transaction, index)
        tr.dataset.index = index

        DOM.transactionsContainer.appendChild(tr)
    },

// Cria o HTML em tela
    innerHTMLTransition(transaction, index){
        const CSSclass = transaction.amount > 0 ? "income" : "expense"

        const amount = Utils.formatCurrency(transaction.amount)

        const html = `
        <td class="description">${transaction.description}</td>
        <td class="${CSSclass}">${amount}</td>
        <td class="date">${transaction.date}</td>
        <td>
            <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remover transação" style="cursor: pointer;">
        </td>
        `
        return html
    },

// Atualizar Entradas, Saidas Total
    updateBalance() {

        document.getElementById('incomeDisplay').innerHTML = Utils.formatCurrency(Transaction.incomes())

        document.getElementById('expenseDisplay').innerHTML = Utils.formatCurrency(Transaction.expenses())

        document.getElementById('totalDisplay').innerHTML = Utils.formatCurrency(Transaction.total())
    },

    clearTransactions() {
        DOM.transactionsContainer.innerHTML = ""
    }
}

// Formatar a moeda para BRL, Numero dentro do formulario

const Utils = {
    formatAmount(value) {
        value = Number(value) * 100
        return value
    },

    formatDate(date) {
        const splittedDate = date.split("-")
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    },

    formatCurrency(value) {
        const signal = Number(value) < 0 ? "-" : ""
    
        value = String(value).replace(/\D/g, "")

        value = Number(value) / 100

        value = value.toLocaleString ("pt-BR", {
            style: "currency",
            currency: "BRL"
        })

        return signal + value
    }
}

// Adiciona uma nova transação 

const Form = {
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    getValues() {
        return{ 
            description: Form.description.value,
            amount: Form.amount.value,
            date: Form.date.value,
        }
    },

    // Verficando se os campos estão preenchidos

    validateFields() {
        const {description, amount, date} = Form.getValues()
        
        if(
            description.trim() === "" || 
            amount.trim() === "" || 
            date.trim() === ""
            ) {
                throw new Error(error.open())
            }
    },

    formatValues() {
        let {description, amount, date} = Form.getValues()

        amount = Utils.formatAmount(amount)

        date = Utils.formatDate(date)

        return{
            description,
            amount,
            date
        }
    },

    clearFields() {
        Form.description.value = ""
        Form.amount.value = ""
        Form.date.value = ""
    },


    // Executa a Função

    submit(event) {
        event.preventDefault()

        try{
            Form.validateFields()

            const transaction = Form.formatValues()

            Transaction.add(transaction)

            Form.clearFields()

            Modal.close()

        } catch (error) {
            Modal.open()
        }
    }
}

// Executa e exibe a função em tela

const App = {
    init() {
        Transaction.all.forEach(DOM.addTransaction)
        
        DOM.updateBalance()

        Storage.set(Transaction.all)
    },

    reload() {
        DOM.clearTransactions()

        App.init()
    }
}

App.init()