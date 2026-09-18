
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
        this.personagens.push(personagem)
        this.registrarAtualizavel(personagem)
    }

    registrarAtualizavel(objeto : AtualizavelPorTurno) {
        this.objetos.push(objeto)
    }

    passarTurno() : void {
        // polimorfismo - ele não precisa saber se é um Personagem, Veneno ou Regeneracao
        for (const objeto of this.objetos) {
            objeto.novoTurno();
        }
    }
}

// classe Personagem que garante que a classe siga a interface AtualizavelPorTurno 
// controlar vida, XP, nível, inventário, arma e ações do personagem 
class Personagem implements AtualizavelPorTurno { 
    private inventario : Inventario; // composição 
    private efeitosAtivos : Efeito[] = []; // composição 
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

    adicionarItensInventario (item : Item) {
        this.inventario.adicionarItem(item)
    }

    listarInventario() {
        this.inventario.listarItens()
    }

    atacarPersonagem(alvo : Personagem) {
        // verifica se tem arma
        if (!this.arma) return 

        // ganha XP por atacar 
        const atacouComSucesso = this.arma.atacar(alvo)
        if (atacouComSucesso) {
            this.ganharXP(10)
        }
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

    aplicarEfeito(efeito : Efeito) {
        // guardar o efeito na lista
         this.efeitosAtivos.push(efeito); 

        // aplicar efeito
        efeito.aplicar(this);
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

    novoTurno(): void {
        this.arma?.novoTurno();

        // aplicar efeitos
        for (const efeito of this.efeitosAtivos) {
            efeito.aplicar(this);
            efeito.novoTurno();
        }

        // remove da lista os efeitos que acabaram 
        this.efeitosAtivos = this.efeitosAtivos.filter(efeito => efeito.estaAtivo());
    }
}

// interface Arma - qualquer objeto que seja desse tipo precisa possuir as essas caracterísitas 
interface Arma {
    // métodos que 'Personagem' vai chamar sem saber qual arma está sendo utilizada
  atacar(alvo : Personagem) : boolean; 
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

    atacar(alvo : Personagem) : boolean {
        // verifica se pode atacar
        if (!this.podeUsar()) return false

        // aplica o dano - chama o método de 'Personagem' que representa 'receberDano()'
        alvo.receberDano(this.dano)

        // inicia o cooldown - chama o método de 'Cooldown' que representar 'iniciar()'
        this.cooldown.iniciar();
        return true
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
        private flechaMaxima : number,
        duracaoCooldown : number, 
    ) {
        this.cooldown = new Cooldown(duracaoCooldown);
    }

    atacar(alvo : Personagem) : boolean {
        // verifica se pode usar a arma
        if (!this.podeUsar()) return false

        // desconta o número de flechas 
        this.flechaAtual = this.flechaAtual - 1

        // aplica o dano - chama o método de 'Personagem' que representa 'receberDano()'
        alvo.receberDano(this.dano);

        // inicia o cooldown - chama o método de 'Cooldown' que representar 'iniciar()'
        this.cooldown.iniciar()
        return true;
    }

    podeUsar() : boolean {
        // arco pode ser utilizado se tiver flecha e cooldown disponível
        if (this.flechaAtual >= 1 && this.cooldown.estaDisponivel()) {
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

    atacar(alvo : Personagem) : boolean {
        // verifica se pode usar a arma 
        if (!this.podeUsar()) return false

        // descontar mana
        this.manaAtual = this.manaAtual - this.custoMana

        // aplicar o dano - chama o método de 'Personagem' que representa 'receberDano()'
        alvo.receberDano(this.dano)

        // iniciar o cooldown - chama o método de 'Cooldown' que representar 'iniciar()'
        this.cooldown.iniciar()
        return true; 
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

// cenário de execução

// 1. criação de um Jogo
const jogo = new Jogo();

// 2. criação de personagens
const gandalf = new Personagem("Gandalf", 100, 0, 100, 1);
const aragorn = new Personagem("Aragorn", 120, 0, 120, 1);
const saruman = new Personagem("Saruman", 150, 0, 150, 1);

// 3. criação de diferentes armas
const espada = new Espada(20, 2);
const arco = new Arco(15, 2, 2, 1);
const varinha = new VarinhaMagica(30, 60, 60, 20, 2);

// 4. equipamento das armas pelos personagens
aragorn.equiparArma(espada);
gandalf.equiparArma(varinha);
saruman.equiparArma(arco);

// 5. adição dos personagens ao jogo
jogo.adicionarPersonagem(gandalf);
jogo.adicionarPersonagem(aragorn);
jogo.adicionarPersonagem(saruman);

// 6. ataques entre personagens
console.log("\nATAQUES");
console.log("Aragorn ataca Saruman");
aragorn.atacarPersonagem(saruman);

// 7. funcionamento do cooldown 
console.log("\nAragorn tenta atacar novamente");
aragorn.atacarPersonagem(saruman);
console.log("Passando 1 turno");
jogo.passarTurno();
console.log("Aragorn tenta atacar novamente");
aragorn.atacarPersonagem(saruman);

// 8. consumo e recarga de flechas
console.log("\nARCO E FLECHAS");
console.log("Saruman ataca Gandalf com o arco");
saruman.atacarPersonagem(gandalf);
console.log("Passando 1 turno");
jogo.passarTurno();
console.log("Saruman ataca Gandalf novamente");
saruman.atacarPersonagem(gandalf);
console.log("Tentativa de ataque sem flechas");
saruman.atacarPersonagem(gandalf);
console.log("Recarregando o arco");
arco.recarregar(2);
console.log("Saruman ataca após recarregar");
saruman.atacarPersonagem(gandalf);

// 9. consumo e recuperação de mana
console.log("\nMANA");
console.log("Gandalf usa a varinha");
gandalf.atacarPersonagem(saruman);
console.log("Gandalf tenta usar a varinha novamente");
gandalf.atacarPersonagem(saruman);
console.log("Recuperando 20 de mana");
varinha.recuperarMana(20);
console.log("Passando 2 turnos");
jogo.passarTurno();
jogo.passarTurno();
console.log("Gandalf usa a varinha novamente");
gandalf.atacarPersonagem(saruman);

// 10. criação e utilização do intentário 
console.log("\nINVENTÁRIO");
console.log("Adicionando itens ao inventário de Aragorn");
aragorn.adicionarItensInventario(new Item("Poção de Vida", 50));
aragorn.adicionarItensInventario(new Item("Escudo", 100));
aragorn.adicionarItensInventario(new Item("Espada Antiga", 150));
console.log("Inventário de Aragorn");
aragorn.listarInventario();

// 11. aplicação e efeitos temporários
console.log("\nEFEITOS TEMPORÁRIOS");
console.log("Saruman recebe veneno");
saruman.aplicarEfeito(new Veneno(10, 3));
console.log("Aragorn recebe regeneração");
aragorn.aplicarEfeito(new Regeneracao(10, 2));

// 12. passagem de vários turnos
console.log("\nPASSAGEM DE TURNOS");
console.log("TURNO 1");
jogo.passarTurno();
console.log("TURNO 2");
jogo.passarTurno();
console.log("TURNO 3");
jogo.passarTurno();

// 13. atualização automática dos objetos
console.log("\nATUALIZAÇÃO AUTOMÁTICA");
console.log("Os personagens registrados no jogo atualizam automaticamente suas armas e efeitos a cada passagem de turno.");
console.log("Passando mais um turno");
jogo.passarTurno();

// 14. personagem recebendo dano e sendo curado
console.log("\nDANO E CURA");
console.log("Aragorn recebe 40 de dano");
aragorn.receberDano(40);
console.log("Aragorn recebe 25 de cura");
aragorn.curar(25);

// 15. ganho de experiência e subida de nível 
console.log("\nEXPERIÊNCIA E NÍVEL");
console.log("Aragorn ganha 50 XP");
aragorn.ganharXP(50);
console.log("Aragorn ganha mais 60 XP");
aragorn.ganharXP(60);


