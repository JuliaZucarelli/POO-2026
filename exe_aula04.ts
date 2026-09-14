// Classe: "molde" ou "receita" para criar objetos que compartilham a mesma estrutura e comportamento 
class Personagem {
  nome: string
  vida: number
  vidaMaxima: number
  ataque: number
  nivel: number

  // Constructor: funções "presas" a classe, que operam sobre os dados daquele objeto específico 
  // É uma função chamada automaticamente quando você cria um novo objeto com 'new'. Ele define os valores iniciais 
  constructor(nome: string, vidaMaxima: number, ataque: number) {
    this.nome = nome //this: para se referir ao próprio objeto 
    this.vidaMaxima = vidaMaxima
    this.vida = vidaMaxima
    this.ataque = ataque
    this.nivel = 1
  }

  // Métodos: ações que os objetos podem fazer
  receberDano(dano: number) {
    const vidaAntesDoDano = this.vida
    this.vida -= dano

    if (this.vida < 0) {
      this.vida = 0
    }

    const danoReal = vidaAntesDoDano - this.vida
    console.log(`${this.nome} perdeu ${danoReal} de vida`)
  }

  atacar(inimigo: Personagem) {
    console.log(`${this.nome} atacou ${inimigo.nome}`)
    inimigo.receberDano(this.ataque)
  }

  curar(quantidade: number) {
    const vidaAnterior = this.vida
    this.vida += quantidade

    if (this.vida > this.vidaMaxima) {
      this.vida = this.vidaMaxima
    }

    const curaReal = this.vida -vidaAnterior
    console.log(`${this.nome} recuperou ${curaReal} de vida`)
  }

  estaVivo(): boolean {
    return this.vida > 0
  }

  subirDeNivel() {
    this.nivel++
    this.vidaMaxima += 20
    this.ataque += 5
    this.vida = this.vidaMaxima

    console.log(`${this.nome} subiu para o nível ${this.nivel}`)
  }
}

const guerreiro = new Personagem('Aragorn', 100, 20)
const orc = new Personagem('Orc', 80, 15)
guerreiro.atacar(orc)
orc.atacar(guerreiro)
console.log(guerreiro.estaVivo())
guerreiro.curar(10)
guerreiro.subirDeNivel()
console.log(guerreiro)

const personagens = [guerreiro, orc]