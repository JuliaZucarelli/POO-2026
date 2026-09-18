
// interface AtualizavávelPorTurno - qualquer objeto que seja desse tipo precisa possuir as essas caracterísitas 
// o jogo não precisa saber qual é o tipo específico de cada objeto, ele só precisa saber que o objeto possuir 'novoTurno()'
interface AtualizavelPorTurno {
    novoTurno() : void;
}

// classe Jogo 
// registrar entidades e disparar a passagem de turno 
class Jogo {
    private personagens : Personagem[] = [];
    private objetos : AtualizavelPorTurno[] = [];

    adicionarPersonagem(personagem: Personagem) {

    }

    registrarAtualizavel(objeto : AtualizavelPorTurno) {

    }

    passarTurno() : void {

    }
}

// classe Personagem que garante que a classe siga a interface AtualizavelPorTurno 
// controlar vida, XP, nível, inventário, arma e ações do personagem 
class Personagem implements AtualizavelPorTurno { 
    private inventario : Inventario; // composição - criado pelo próprio personagem 
    private arma : Arma | null = null; 

    constructor (
        public nome : string, 
        private vida : number,  
        private xp : number, 
        private vidaMaxima : number, 
        private nivel : number, 

    ) {
        this.inventario = new Inventario(); // composição 
    }

    atacarPersonagem(alvo : Personagem) {
        // verifica se tem arma
        if (!this.arma) return 

        // ataca o alvo - aqui não calcula o dano que o personagem vai tomar
        this.arma.atacar(alvo)

        // ganha XP por atacar 
        this.ganharXP(10)
    }

    receberDano(quantidade : number) {
        const vidaAntes = this.vida
        this.vida -= quantidade 

        // impede vida negativa 
        if (this.vida < 0) {
            this.vida = 0
        }

        // dano real 
        const danoReal = vidaAntes - this.vida

        console.log(`${this.nome} recebeu ${danoReal} de dano.`)

        // verifica se está vivo 
        if (!this.estaVivo()) {
            console.log(`${this.nome} foi derrotado.`)
        }
    }

    curar(quantidade : number) {
        const vidaAntes = this.vida
        this.vida += quantidade

        // impede vida negativa 
        if (this.vida > this.vidaMaxima) {
            this.vida = this.vidaMaxima
        }

        // cura real 
        const curaReal = this.vida - vidaAntes

        console.log(`${this.nome} recebeu ${curaReal} de vida.`)        
    }

    estaVivo() {
        return this.vida > 0
    }
    
    ganharXP(quantidade : number) {
        this.xp += quantidade

        console.log (`${this.nome} ganhou ${quantidade} XP.` + `XP atual: ${this.xp}`)
        
        if (this.xp >= 100) {
            this.subirDeNivel()
        }
    }

    subirDeNivel() {
        this.nivel++
        this.xp = 0
        this.vidaMaxima += 20 
        this.vida = this.vidaMaxima

        console.log (`${this.nome} subiu para o núvel ${this.nivel}`)
    }

    equiparArma(arma : Arma) {
        this.arma = arma; 
    }

    adicionarItensInventario(item : Item) {
        this.inventario.adicionarItem(item)
    }

    novoTurno(): void {
        this.arma?.novoTurno();
    }
}

// interface Arma - qualquer objeto que seja desse tipo precisa possuir as essas caracterísitas 
interface Arma {
    // métodos que 'Personagem' vai chamar sem saber qual arma está sendo utilizada
  atacar(alvo : Personagem) : void; 
  podeUsar() : boolean; 
  novoTurno() : void; 
}

// classe Espada que garante que siga a interface Arma
// executar ataque de dano físico com cooldown 
class Espada implements Arma {
    private cooldown : Cooldown; 

    constructor(
        private dano : number,
        duracaoCooldown : number, 
    ) {
        this.cooldown = new Cooldown(duracaoCooldown);
    }

    atacar(alvo : Personagem) : void {
        // verifica se pode atacar 
        if (!this.podeUsar()) return 

        // aplica o dano - chama o método de 'Personagem' que representa 'receberDano()'
        alvo.receberDano(this.dano)

        // inicia o cooldown - chama o método de 'Cooldown' que representar 'iniciar()'
        this.cooldown.iniciar();
    }

    podeUsar() : boolean {
        // verifica se cooldown está disponível 
        if(this.cooldown.estaDisponivel()){
            return true 
        } else {
            return false
        }
    }

    novoTurno(): void {
        this.cooldown.passarTurno();
    }
}

// classe Arco que garante que siga a interface Arma
// executar ataque e contralar sua recarga conforme a regra definida - olhar enunciado 
class Arco implements Arma {
    private cooldown : Cooldown;

    constructor(
        private dano : number,
        private flechaAtual : number,
        private flechaMaxima : number = 20, 
        duracaoCooldown : number, 
    ) {
        this.cooldown = new Cooldown(duracaoCooldown);
    }

    atacar(alvo : Personagem) : void {
        // verifica se pode usar a arma
        if (!this.podeUsar()) return 

        // desconta o número de flechas 
        this.flechaAtual = this.flechaAtual - 1

        // aplica o dano - chama o método de 'Personagem' que representa 'receberDano()'
        alvo.receberDano(this.dano);

        // inicia o cooldown - chama o método de 'Cooldown' que representar 'iniciar()'
        this.cooldown.iniciar();
    }

    podeUsar() : boolean {
        // arco pode ser utilizado se tiver flecha e cooldown disponível
        if (this.flechaAtual >= 0 && this.cooldown.estaDisponivel()) {
            return true 
        } else {
            return false
        }
    }

    recarregar(quantidade : number) : void {
        this.flechaAtual += quantidade 

        // verifica se não ultrapassou o número máximo de flechas 
        if (this.flechaAtual >= this.flechaMaxima) {
            this.flechaAtual = this.flechaMaxima
        }
    }   

    novoTurno(): void {
        this.cooldown.passarTurno();
    }
}

// classe VarinhaMagica que garante que siga a interface Arma
// executar ataque relacionado a mana e cooldown 
class VarinhaMagica implements Arma {
    private cooldown : Cooldown;

    constructor(
        private dano : number, 
        private manaAtual : number, 
        private manaMaxima : number, 
        private custoMana : number, 
        duracaoCooldown : number, 
    ) {
        this.cooldown = new Cooldown(duracaoCooldown);
    }

    atacar(alvo : Personagem) : void {
        // verifica se pode usar a arma 
        if (!this.podeUsar()) return 

        // descontar mana
        this.manaAtual = this.manaAtual - this.custoMana

        // aplicar o dano - chama o método de 'Personagem' que representa 'receberDano()'
        alvo.receberDano(this.dano)

        // iniciar o cooldown - chama o método de 'Cooldown' que representar 'iniciar()'
        this.cooldown.iniciar()
    }

    podeUsar(): boolean {  
        // varinha pode ser usada quando tiver mana suficiente e cooldown estiver disponível 
        if (this.manaAtual >= this.custoMana && this.cooldown.estaDisponivel()) {
            return true 
        } else {
            return false 
        }
    }

    recuperarMana(quantidade : number) : void {
        this.manaAtual += quantidade

        // verifica se não ultrapassou o número máximo de mana
        if (this.manaAtual > this.manaMaxima) {
            this.manaAtual = this.manaMaxima
        }
    }

    novoTurno(): void {
        this.cooldown.passarTurno()
    }
}

// interface Efeito que herda a interface AtualizavelPorTurno - qualquer objeto que seja desse tipo precisa possuir as essas caracterísitas
interface Efeito extends AtualizavelPorTurno {
    aplicar(alvo : Personagem) : void; 
    estaAtivo() : boolean;
}

// classe Veneno garante que siga a interface Efeito 
// representar um efeito que causa dano durante uma quantidade de turnos 
class Veneno implements Efeito {
    constructor(
        private danoPorTurno : number, 
        private duracaoRestante : number,
    ) {}

    aplicar(alvo : Personagem) : void {
        // verifica se está ativo 
        if (!this.estaAtivo()) return 

        // aplica o dano - chama o método de 'Personagem' que representa 'receberDano()'
        alvo.receberDano(this.danoPorTurno);
    }

    estaAtivo(): boolean {
        // veneno pode ser utilizado se a duração estiver acabado 
        if (this.duracaoRestante == 0) {
            return false
        } else {
            return true
        }
    }

    novoTurno(): void {
        // verifica se duração restante é maior que zero 
        if (this.duracaoRestante > 0) {
            this.duracaoRestante -= 1;
    }
}

// classe Regeneracao que garante que siga a interface Efeito 
// representar um efeito que cura durante uma quantidade de turnos 
class Regeneracao implements Efeito {
    constructor(
        private curaPorTurno : number, 
        private duracaoRestante : number,
    ) {}

    aplicar(alvo : Personagem) : void {
        // verifica se está ativo 
        if (!this.estaAtivo()) return 

        // aplica o dano - chama o método 'Personagem' que representa 'receberDano()'
        alvo.curar(this.curaPorTurno);
    }

    estaAtivo(): boolean {
        // regeneração só pode ser utilizada se a duração estiver acabado 
        if (this.duracaoRestante == 0) {
            return false 
        } else {
            return true
        }
    }

    novoTurno(): void {
        // verifica se duração restante é maior que zero 
        if (this.duracaoRestante > 0) {
            this.duracaoRestante -= 1; 
        }
    }
}

// classe Inventario 
// armazenar, adicionar, remover e listar itens 
class Inventario { 
    // todo inventário começa vazio 
    private itens : Item[] = [];

    adicionarItem(item : Item) : void {
        this.itens.push(item)
    }

    removerItem(item : Item) : void {
        this.itens = this.itens.filter(i => i !== item)
    }

    listarItens() {
        console.log(`Inventário: `)

        for (const item of this.itens) {
            console.log(`- ${item.nome}`)
        }
    }
}

// classe Item 
// representar um item com um nome e valor 
class Item {
    constructor(
        public nome : string,
        public valor : number, 
    ) {}
}

/// classe Cooldown
// controlar quantos turnos faltam para uma ação ficar disponível 
class Cooldown {
    private turnosRestantes : number = 0; 

    constructor(
        private duracao : number,
    ) {}

    // iniciar o cooldown 
    iniciar() : void {
        // inicia o cooldown 
        this.turnosRestantes = this.duracao
        console.log(`Cooldown iniciado. Bloqueado por ${this.duracao} turnos.`)
    }

    // verifica se já está disponível agora para o uso 
    estaDisponivel() : boolean { 
        return this.turnosRestantes === 0;
    }

    passarTurno() : void { 
        if (this.turnosRestantes > 0) {
            this.turnosRestantes -= 1; 
        }
    }
}