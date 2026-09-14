class contaBancaria {
    titular : string 
    saldo : number 
    numeroConta : string 
    historico : string[] // lista de mensagens registrando as operações feitas

    constructor (titular : string, numeroConta : string, saldoInicial : number = 0){
        this.titular = titular
        this.numeroConta = numeroConta 
        this.saldo = saldoInicial
        this.historico = []
    }

    depositar (valor : number) { 
        if (valor <= 0) {
            console.log (`Valor de depósito inválido.`)
            return
        }

        this.saldo += valor 
        this.historico.push (`Depósito de R$ ${valor} realizado`)
        console.log (`Depósito de R$ ${valor} realizado!`)
        
    }

    sacar (valor : number) : boolean {
        if (valor > this.saldo) { 
            console.log (`Saldo insuficiente.`)
            return false
        } else {
            this.saldo -= valor
            this.historico.push (`Saque de R$ ${valor} realizado!`)
            return true
        }

    }

    transferir (valor : number, destino : contaBancaria) {
        // Const: é uma forma de declarar uma variável cujo valor não pode ser retribuído depois de criada
        const conseguiuSacar = this.sacar (valor)

        if (conseguiuSacar) {
            destino.depositar (valor)
        }
    }

    consultarSaldo() : number { 
        return this.saldo
    }

    exibirHistorico () {
        // O 'const mensagem' cria uma variável nova a cada volta do laço, que recebe o item atual do array
        for (const mensagem of this.historico) {
            console.log (mensagem)
        }
    }
}

const contaJoao = new contaBancaria ('João', '001-1')
const contaMaria = new contaBancaria ('Maria', '002-2', 100)

contaJoao.depositar (200)
contaJoao.sacar (50)
contaJoao.transferir (100, contaMaria)

console.log (contaJoao.consultarSaldo())
console.log (contaMaria.consultarSaldo())

contaJoao.exibirHistorico ()