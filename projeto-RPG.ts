
// interface AtualizavávelPorTurno - qualquer objeto que seja desse tipo precisa possuir as essas caracterísitas 
interface AtualizavelPorTurno {
    novoTurno() : void;
}

// classe Jogo 
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

    }

    receberDano(quantidade : number) {

    }

    estaVivo() : boolean {

    }
    
    ganharXP(quantidade : number) {

    }

    subirDeNivel() {

    }

    equiparArma(arma : Arma) {

    }

    adicionarItensInventario(item : Item) {

    }

    novoTurno(): void {
        
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
class Espada implements Arma {
    private cooldown : Cooldown; 

    constructor(
        private dano : number,
        duracaoCooldown : number, 
    ) {
        this.cooldown = new Cooldown(duracaoCooldown);
    }

    atacar(alvo : Personagem) : void {}
    podeUsar() : boolean {}
    novoTurno(): void {}
}

// classe Arco que garante que siga a interface Arma
class Arco implements Arma {
    private cooldown : Cooldown;

    constructor(
        private dano : number,
        duracaoCooldown : number, 
    ) {
        this.cooldown = new Cooldown(duracaoCooldown);
    }

    atacar(alvo : Personagem) : void {}
    podeUsar() : boolean {}
    recarregar(quantidade : number) : void {}
    novoTurno(): void {}
}

// classe VarinhaMagica que garante que siga a interface Arma
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

    atacar(alvo : Personagem) : void {}
    podeUsar(): boolean {}
    recuperarMana(quantidade : number) : void {}
    novoTurno(): void {}
}

// interface Efeito que herda a interface AtualizavelPorTurno - qualquer objeto que seja desse tipo precisa possuir as essas caracterísitas
interface Efeito extends AtualizavelPorTurno {
    aplicar(alvo : Personagem) : void; 
    estaAtivo() : boolean;
}

// interface Veneno que herda a interface AtualizavelPorTurno - qualquer objeto que seja desse tipo precisa possuir as essas caracterísitas
class Veneno implements Efeito {
    constructor(
        private danoPorTurno : number, 
        private duracaoRestante : number,
    ) {}

    aplicar(alvo : Personagem) : void {}
    estaAtivo(): boolean {}
    novoTurno(): void {}
}

// classe Regeneracao que garante que siga a interface Efeito 
class Regeneracao implements Efeito {
    constructor(
        private curaPorTurno : number, 
        private duracaoRestante : number,
    ) {}

    aplicar(alvo : Personagem) : void {}
    estaAtivo(): boolean {}
    novoTurno(): void {}
}

// classe Inventario 
class Inventario { 
    // todo inventário começa vazio 
    private itens : Item[] = [];

    adicionarItem(item : Item) : void {

    }

    removerItem(item : Item) : void {

    }

    listarItens() : Item[] {

    }
}

// classe Item 
class Item {
    constructor(
        public nome : string,
        public valor : number, 
    ) {}
}

/// classe Cooldown
class Cooldown {
    private turnosRestantes : number = 0; 

    constructor(
        private duracao : number,
    ) {}

    iniciar() : void {

    }

    estaDisponivel() : boolean { 

    }

    passarTurno() : void { 

    }
}