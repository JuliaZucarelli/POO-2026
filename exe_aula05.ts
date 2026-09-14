class Arma {
  private ultimoAtaque: number = 0 // timestamp (ms) do último ataque, 0 = nunca atacou 

  constructor(
    public nome: string,
    public dano: number,
    public cooldown : number = 1000 // tempo de espera em ms entre ataques
  ) {}

  podeAtacar () : boolean {
    const agora = Date.now()
    const tempoDesdeUltimoAtaque = agora - this.ultimoAtaque

    return tempoDesdeUltimoAtaque >= this.cooldown
  }

  tempoRestanteCooldown() : number {
    const agora = Date.now()
    const tempoDesdeUltimoAtaque = agora - this.ultimoAtaque
    const restante = this.cooldown - tempoDesdeUltimoAtaque

    return restante > 0 ? restante : 0
  }

  atacar(): number | null {
    if (!this.podeAtacar()) {
      console.log (`${this.nome} ainda está em cooldown.` + `Aguarde ${(this.tempoRestanteCooldown()/1000).toFixed(1)}s.`)
      return null
    }

    this.ultimoAtaque = Date.now()
    return this.dano
  }
}

class Item {
  constructor(
    public nome: string,
    public valor: number
  ) {}
}

class Inventario {
  private itens: Item[] = []

  adicionar(item: Item) {
    this.itens.push(item)
  }

  // cria uma nova lista filtrando fora o item passado, comparando por referência 
  // 'i !== item' que significa que só remove se for exatamente o mesmo ojeto em m
  // memória - dois itens iguais, mas criados separadamente seriam tratados como diferentes
  remover(item: Item) {
    this.itens = this.itens.filter(i => i !== item)
  }

  listar() {
    console.log('Inventário: ')

    for (const item of this.itens) {
      console.log(`- ${item.nome}`)
    }
  }
}

class Personagem {
  private vida: number
  private nivel: number
  private experiencia: number

  private inventario: Inventario // composição

  constructor(
    public nome: string,
    private vidaMaxima: number,
    private arma: Arma = new Arma('faca', 5) // private: só é acessível dentro da classe
  ) {
    this.vida = vidaMaxima
    this.nivel = 1
    this.experiencia = 0
    this.inventario = new Inventario()
  }

  atacar(inimigo: Personagem) {
    // verifica te tem arma 
    if (!this.arma) {
      return
    }

    // pega o dano da arma e chama 'receberDano' no inimigo
    const dano = this.arma.atacar()
    inimigo.receberDano(dano)
    // ganha 10 pontos de experiência por atacar 
    this.ganharExperiencia(10)
  }

  receberDano(dano: number) {
    const vidaAntes = this.vida
    this.vida -= dano

    // impede vida negativa
    if (this.vida < 0) {
      this.vida = 0
    }
    const danoReal = vidaAntes - this.vida

    console.log(`${this.nome} recebeu ${danoReal} de dano.`)
    this.mostrarVida()

    if (!this.estaVivo()) {
      console.log(`${this.nome} foi derrotado`)
    }
  }

  estaVivo() {
    return this.vida > 0
  }

  curar(quantidade: number) {
    this.vida += quantidade

    // não deixa a vida passar do limite de 'vidaMaxima'
    if (this.vida > this.vidaMaxima) {
      this.vida = this.vidaMaxima
    }

    console.log(`${this.nome} recuperou vida.`)
    this.mostrarVida()
  }

  mostrarVida() {
    console.log(`Vida: ${this.vida}/${this.vidaMaxima}`)
  }


  ganharExperiencia(quantidade: number) {
    this.experiencia += quantidade

    console.log(
      `${this.nome} ganhou ${quantidade} XP.` +
      `XP: ${this.experiencia}`
    )

    if (this.experiencia >= 100) {
      this.subirDeNivel()
    }
  }

  subirDeNivel() {
    this.nivel++
    this.experiencia = 0
    this.vidaMaxima += 20
    this.vida = this.vidaMaxima

    console.log(`${this.nome} subiu para o nível ${this.nivel}`)
  }

  adicionarItem(item: Item) {
    this.inventario.adicionar(item)
  }

  mostrarInventario() {
    this.inventario.listar()
  }
}

const espada = new Arma('Espada', 10, 2000) // 2 segundos de cooldown
const guerreiro = new Personagem('Thor', 100)
const barbaro = new Personagem('Conan', 200, espada)

barbaro.atacar(guerreiro) // ataca normalmente, define ultimoAtaque = agora
barbaro.atacar(guerreiro) // bloqueado: "Espada ainda está em cooldown. Aguarde 2.0s."

setTimeout(() => {
  barbaro.atacar(guerreiro) // depois de 2s, ataca normalmente de novo
}, 2000)