interface AtualizavelPorTurno {
    novoTurno() : void;
}

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

interface Arma {
    // métodos que 'Personagem' vai chamar sem saber qual arma está sendo utilizada
  atacar(alvo : Personagem) : void; 
  podeUsar() : boolean; 
  novoTurno() : void; 
}

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

interface Efeito extends AtualizavelPorTurno {
    aplicar(alvo : Personagem) : void; 
    estaAtivo() : boolean;
}

class Veneno implements Efeito {
    constructor(
        private danoPorTurno : number, 
        private duracaoRestante : number,
    ) {}

    aplicar(alvo : Personagem) : void {}
    estaAtivo(): boolean {}
    novoTurno(): void {}
}

class Regeneracao implements Efeito {
    constructor(
        private curaPorTurno : number, 
        private duracaoRestante : number,
    ) {}

    aplicar(alvo : Personagem) : void {}
    estaAtivo(): boolean {}
    novoTurno(): void {}
}

class Inventario { 
    private itens : Item[] = [];


    adicionarItem(item : Item) : void {

    }

    removerItem(item : Item) : void {

    }

    listarItens() : Item[] {

    }
}

class Item {
    constructor(
        public nome : string,
        public valor : number, 
    ) {}
}

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