class Feitico {
    private ultimoLancamento: number = 0 // controle do timestamp do último lançamento

    constructor(
        public nome: string,
        public custoMana: number,
        private dano: number,
        private cooldown: number = 3000
    ) {}

    // verifica se o cooldown já passou
    podeLancar(): boolean {
        const agora = Date.now()
        const tempoDesdeUltimoLancamento = agora - this.ultimoLancamento

        return tempoDesdeUltimoLancamento >= this.cooldown
    }

    // retorna quanto falta para poder lançar de novo (0 se já pode)
    tempoRestanteCooldown(): number {
        const agora = Date.now()
        const tempoDesdeUltimoLancamento = agora - this.ultimoLancamento
        const restante = this.cooldown - tempoDesdeUltimoLancamento

        return restante > 0 ? restante : 0
    }

    // se estiver em cooldown, retorna 'null'; caso contrário, atualiza o timestamp e retorna o dano
    lancar(): number | null {
        if (!this.podeLancar()) {
            console.log(
                `${this.nome} ainda está em cooldown. ` +
                `Aguarde ${(this.tempoRestanteCooldown() / 1000).toFixed(1)}s.`
            )
            return null
        }

        this.ultimoLancamento = Date.now()
        return this.dano
    }

    // retorna uma Promise que resolve quando o cooldown terminar
    // se já pode lançar, resolve imediatamente
    esperarCooldown(): Promise<void> {
        const restante = this.tempoRestanteCooldown()

        // 'Promise': é um objeto que representa "algo que vai terminar no futuro"
        // ele tem uma função 'resolve' que chama quando o trabalho termina
        // quando se tem uma 'Promise', pode usar 'await' para pausar a execução até que ela resolva
        if (restante === 0) {
            return Promise.resolve()
        }

        console.log(
            `Aguardando ${(restante / 1000).toFixed(1)}s de cooldown de ${this.nome}...`
        )

        // 'setTimeout': executa ua função depois de um tempo determinado, sem bloquear o resto do código
        return new Promise(resolve => {
            setTimeout(resolve, restante)
        })
    }
}

class Grimorio {
    private feiticos: Feitico[] = []

    // adiciona um feitiço à lista
    aprender(feitico: Feitico) {
        this.feiticos.push(feitico)
    }

    // remove um feitiço específico da lista
    esquecer(feitico: Feitico) {
        this.feiticos = this.feiticos.filter(i => i !== feitico)
    }

    // imprime todos os feitiços conhecidos
    listar() {
        console.log(`Grimório: `)

        for (const feitico of this.feiticos) {
            console.log(`- ${feitico.nome}`)
        }
    }

    // retorna (usando filter) apenas os feitiços que não estão em cooldown no momento
    feiticosDisponiveis(): Feitico[] {
        return this.feiticos.filter(feitico => feitico.podeLancar())
    }
}

class Mago {
    constructor(
        public nome: string,
        private vida: number,
        private mana: number,
        private vidaMaxima: number = vida,
        private manaMaxima: number = mana,

        private grimorio: Grimorio = new Grimorio() // composição
    ) {}

    // delega para o grimório
    aprenderFeitico(feitico: Feitico) {
        this.grimorio.aprender(feitico)
    }

    receberDano(dano: number) {
        this.vida -= dano

        if (this.vida < 0) {
            this.vida = 0
        }

        console.log(`${this.nome} recebeu ${dano} de dano.`)
    }

    // verifica mana, chama feitico.lancar() e aplica dano no alvo se tudo certo
    lancarFeitico(feitico: Feitico, alvo: Mago) {
        if (this.mana < feitico.custoMana) {
            console.log(`${this.nome} não tem mana suficiente.`)
            return
        }

        const dano = feitico.lancar()

        if (dano === null) return

        this.mana -= feitico.custoMana

        alvo.receberDano(dano)
        console.log(`${this.nome} lançou ${feitico.nome} e gastou ${feitico.custoMana} de mana.`)
    }

    // espera o cooldown do feitiço terminar automaticamente antes de lançar
    // 'async': transforma uma função em "produtora de Promise". A função sempre retorna uma 'Promise' e dentro dela você ganha a persmisão de usar a palavra-chave 'await'
    async lancarFeiticoQuandoPossivel(feitico: Feitico, alvo: Mago) {
        //'await': pause aqui quando essa 'Promise' terminar. Ela faz o motor do JavaScript pausar a execução daquela função 
        await feitico.esperarCooldown()
        this.lancarFeitico(feitico, alvo)
    }

    // soma mana, sem passar do limite
    recuperarMana(quantidade: number) {
        this.mana += quantidade

        if (this.mana > this.manaMaxima) {
            this.mana = this.manaMaxima
        }

        console.log(`${this.nome} recuperou mana.`)
        this.mostrarStatus() // <-- corrigido: faltava () na versão original
    }

    // imprime vida e mana no formato 'Vida: 80/100 | Mana: 30/50'
    mostrarStatus() {
        console.log(`Vida: ${this.vida}/${this.vidaMaxima} | Mana: ${this.mana}/${this.manaMaxima}`)
    }

    // imprime o grimório
    listarGrimorio() {
        this.grimorio.listar()
    }
}


// ===============================
// CRIAÇÃO DOS FEITIÇOS
// ===============================

const bolaDeFogo = new Feitico("Bola de Fogo", 20, 25, 3000)
const gelo = new Feitico("Toque de Gelo", 10, 10, 1000)


// ===============================
// CRIAÇÃO DOS MAGOS
// ===============================

const mago1 = new Mago("Gandalf", 100, 50)
const mago2 = new Mago("Saruman", 100, 50)


// ===============================
// APRENDENDO FEITIÇOS
// ===============================

mago1.aprenderFeitico(bolaDeFogo)
mago2.aprenderFeitico(gelo)


// ===============================
// FUNÇÃO PRINCIPAL (async, para poder usar await)
// ===============================

async function main() {
    console.log("\n===== GRIMÓRIOS =====")

    console.log("\nFeitiços de Gandalf:")
    mago1.listarGrimorio()

    console.log("\nFeitiços de Saruman:")
    mago2.listarGrimorio()


    console.log("\n===== STATUS INICIAL =====")

    mago1.mostrarStatus()
    mago2.mostrarStatus()


    console.log("\n===== PRIMEIRO ATAQUE =====")

    mago1.lancarFeitico(bolaDeFogo, mago2)


    console.log("\n===== SEGUNDO ATAQUE (deve falhar por cooldown) =====")

    mago1.lancarFeitico(bolaDeFogo, mago2)


    console.log("\n===== STATUS APÓS ATAQUE =====")

    mago1.mostrarStatus()
    mago2.mostrarStatus()


    console.log("\n===== TESTANDO FALTA DE MANA =====")

    const feiticoCaro = new Feitico("Meteoro", 100, 50)
    mago1.lancarFeitico(feiticoCaro, mago2)


    console.log("\n===== RECUPERANDO MANA =====")

    mago1.recuperarMana(30)


    console.log("\n===== ESPERANDO COOLDOWN AUTOMATICAMENTE =====")

    // ao invés de checar manualmente quanto tempo falta, deixamos o próprio
    // feitiço "avisar" quando estiver pronto de novo
    await mago1.lancarFeiticoQuandoPossivel(bolaDeFogo, mago2)


    console.log("\n===== TESTANDO feiticosDisponiveis() =====")

    // logo após lançar a bola de fogo, ela deveria estar em cooldown de novo
    // então não deveria aparecer na lista de disponíveis do grimório de mago1
    console.log("Feitiços disponíveis de Gandalf agora:")
    const grimorioDeGandalf = new Grimorio()
    grimorioDeGandalf.aprender(bolaDeFogo)
    console.log(grimorioDeGandalf.feiticosDisponiveis().map(f => f.nome))


    console.log("\n===== STATUS FINAL =====")

    mago1.mostrarStatus()
    mago2.mostrarStatus()
}

main()