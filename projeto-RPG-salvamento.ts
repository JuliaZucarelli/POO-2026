// para rodar, usar deno --allow-read --allow-write jogo.ts
import {
  existsSync,
  readFileSync,
  writeFileSync
} from "node:fs";

import {
  createInterface
} from "node:readline/promises";

import {
  stdin as input,
  stdout as output
} from "node:process";

// interface AtualizavelPorTurno - qualquer objeto que seja desse tipo precisa possuir essas características 
// o jogo não precisa saber qual é o tipo específico de cada objeto, ele só precisa saber que o objeto possui 'novoTurno()'
interface AtualizavelPorTurno {
    novoTurno(): void;
}

// classe Jogo 
// registrar entidades e disparar a passagem de turno 
class Jogo {
    private personagens: Personagem[] = [];
    private objetos: AtualizavelPorTurno[] = [];

    adicionarPersonagem(personagem: Personagem) {
        this.personagens.push(personagem);
        this.registrarAtualizavel(personagem);
    }

    registrarAtualizavel(objeto: AtualizavelPorTurno) {
        this.objetos.push(objeto);
    }

    passarTurno(): void {
        // polimorfismo - não precisa saber se é um Personagem, Veneno ou Habilidade
        for (const objeto of this.objetos) {
            objeto.novoTurno();
        }
    }
}

// classe Personagem que garante que a classe siga a interface AtualizavelPorTurno 
// controlar vida, XP, nível, inventário, arma, mana e ações do personagem 
class Personagem implements AtualizavelPorTurno { 
    private inventario: Inventario; // composição 
    private efeitosAtivos: Efeito[] = []; // composição 
    private habilidades: Habilidade[] = [];
    private arma: Arma | null = null; 

    constructor(
        public nome: string, 
        private vida: number,  
        private xp: number, 
        private vidaMaxima: number, 
        private nivel: number, 
        private mana: number = 50,
        private manaMaxima: number = 50
    ) {
        this.inventario = new Inventario(); // composição 
    }

    adicionarItensInventario(item: Item) {
        this.inventario.adicionarItem(item);
    }

    listarInventario() {
        this.inventario.listarItens();
    }

    atacarPersonagem(alvo: Personagem) {
        // verifica se tem arma
        if (!this.arma) return; 

        // ganha XP por atacar 
        const atacouComSucesso = this.arma.atacar(alvo);
        if (atacouComSucesso) {
            this.ganharXP(10);
        }
    }

    receberDano(quantidade: number) {
        const vidaAntes = this.vida;
        this.vida -= quantidade; 

        // impede vida negativa 
        if (this.vida < 0) {
            this.vida = 0;
        }

        // dano real 
        const danoReal = vidaAntes - this.vida;

        console.log(`${this.nome} recebeu ${danoReal} de dano.`);

        // verifica se está vivo 
        if (!this.estaVivo()) {
            console.log(`${this.nome} foi derrotado.`);
        }
    }

    curar(quantidade: number) {
        const vidaAntes = this.vida;
        this.vida += quantidade;

        // impede vida acima do máximo 
        if (this.vida > this.vidaMaxima) {
            this.vida = this.vidaMaxima;
        }

        // cura real 
        const curaReal = this.vida - vidaAntes;

        console.log(`${this.nome} recebeu ${curaReal} de vida. Vida atual: ${this.vida}/${this.vidaMaxima}`);        
    }

    estaVivo() {
        return this.vida > 0;
    }

    aplicarEfeito(efeito: Efeito) {
        // guardar o efeito na lista
        this.efeitosAtivos.push(efeito); 

        // aplicar efeito
        efeito.aplicar(this);
    }
    
    ganharXP(quantidade: number) {
        this.xp += quantidade;

        console.log(`${this.nome} ganhou ${quantidade} XP. XP atual: ${this.xp}`);
        
        if (this.xp >= 100) {
            this.subirDeNivel();
        }
    }

    subirDeNivel() {
        this.nivel++;
        this.xp = 0;
        this.vidaMaxima += 20; 
        this.vida = this.vidaMaxima;

        console.log(`${this.nome} subiu para o nível ${this.nivel}`);
    }

    equiparArma(arma: Arma) {
        this.arma = arma; 
    }

    novoTurno(): void {
        this.arma?.novoTurno();

        // aplicar habilidades (atualiza cooldowns)
        for (const habilidade of this.habilidades) {
            habilidade.novoTurno();
        }

        // aplicar efeitos
        for (const efeito of this.efeitosAtivos) {
            efeito.aplicar(this);
            efeito.novoTurno();
        }

        // remove da lista os efeitos que acabaram 
        this.efeitosAtivos = this.efeitosAtivos.filter(efeito => efeito.estaAtivo());
    }

    possuiMana(quantidade: number): boolean {
        return this.mana >= quantidade;
    }

    gastarMana(quantidade: number): void {
        this.mana -= quantidade; 

        // impede mana negativa
        if (this.mana < 0) {
            this.mana = 0;
        }
        console.log(`${this.nome} gastou ${quantidade} de mana. Mana restante: ${this.mana}/${this.manaMaxima}`);
    }

    recuperarMana(quantidade: number): void {
        const manaAntes = this.mana;
        this.mana += quantidade; 

        // impede mana acima da máxima 
        if (this.mana > this.manaMaxima) {
            this.mana = this.manaMaxima;
        }

        // mana real 
        const manaReal = this.mana - manaAntes;

        console.log(`${this.nome} recebeu ${manaReal} de mana. Mana atual: ${this.mana}/${this.manaMaxima}`);
    }

    aprenderHabilidade(habilidade: Habilidade): void {
        this.habilidades.push(habilidade);
    }

    usarHabilidade(habilidade: Habilidade, alvos: Personagem[]): void {
        habilidade.usar(this, alvos);
    }
}

// interface Arma 
interface Arma {
    atacar(alvo: Personagem): boolean; 
    podeUsar(): boolean; 
    novoTurno(): void; 
}

// classe Espada
class Espada implements Arma {
    private cooldown: Cooldown; 

    constructor(
        private dano: number,
        duracaoCooldown: number, 
    ) {
        this.cooldown = new Cooldown(duracaoCooldown);
    }

    atacar(alvo: Personagem): boolean {
        if (!this.podeUsar()) return false;

        alvo.receberDano(this.dano);
        this.cooldown.iniciar();
        return true;
    }

    podeUsar(): boolean {
        return this.cooldown.estaDisponivel();
    }

    novoTurno(): void {
        this.cooldown.passarTurno();
    }
}

// classe Arco
class Arco implements Arma {
    private cooldown: Cooldown;

    constructor(
        private dano: number,
        private flechaAtual: number,
        private flechaMaxima: number,
        duracaoCooldown: number, 
    ) {
        this.cooldown = new Cooldown(duracaoCooldown);
    }

    atacar(alvo: Personagem): boolean {
        if (!this.podeUsar()) return false;

        this.flechaAtual = this.flechaAtual - 1;
        alvo.receberDano(this.dano);
        this.cooldown.iniciar();
        return true;
    }

    podeUsar(): boolean {
        return this.flechaAtual >= 1 && this.cooldown.estaDisponivel();
    }

    recarregar(quantidade: number): void {
        this.flechaAtual += quantidade; 

        if (this.flechaAtual >= this.flechaMaxima) {
            this.flechaAtual = this.flechaMaxima;
        }
    }   

    novoTurno(): void {
        this.cooldown.passarTurno();
    }
}

// classe VarinhaMagica
class VarinhaMagica implements Arma {
    private cooldown: Cooldown;

    constructor(
        private dano: number, 
        private manaAtual: number, 
        private manaMaxima: number, 
        private custoMana: number, 
        duracaoCooldown: number, 
    ) {
        this.cooldown = new Cooldown(duracaoCooldown);
    }

    atacar(alvo: Personagem): boolean {
        if (!this.podeUsar()) return false;

        this.manaAtual -= this.custoMana;
        alvo.receberDano(this.dano);
        this.cooldown.iniciar();
        return true; 
    }

    podeUsar(): boolean {  
        return this.manaAtual >= this.custoMana && this.cooldown.estaDisponivel();
    }

    recuperarMana(quantidade: number): void {
        this.manaAtual += quantidade;

        if (this.manaAtual > this.manaMaxima) {
            this.manaAtual = this.manaMaxima;
        }
    }

    novoTurno(): void {
        this.cooldown.passarTurno();
    }
}

// interface Efeito
interface Efeito extends AtualizavelPorTurno {
    aplicar(alvo: Personagem): void; 
    estaAtivo(): boolean;
}

// classe Veneno
class Veneno implements Efeito {
    constructor(
        private danoPorTurno: number, 
        private duracaoRestante: number,
    ) {}

    aplicar(alvo: Personagem): void {
        if (!this.estaAtivo()) return; 
        alvo.receberDano(this.danoPorTurno);
    }

    estaAtivo(): boolean {
        return this.duracaoRestante > 0;
    }

    novoTurno(): void {
        if (this.duracaoRestante > 0) {
            this.duracaoRestante -= 1;
        }
    }
}

// classe Regeneracao
class Regeneracao implements Efeito {
    constructor(
        private curaPorTurno: number, 
        private duracaoRestante: number,
    ) {}

    aplicar(alvo: Personagem): void {
        if (!this.estaAtivo()) return; 
        alvo.curar(this.curaPorTurno);
    }

    estaAtivo(): boolean {
        return this.duracaoRestante > 0;
    }

    novoTurno(): void {
        if (this.duracaoRestante > 0) {
            this.duracaoRestante -= 1; 
        }
    }
}

// classe Inventario
class Inventario { 
    private itens: Item[] = [];

    adicionarItem(item: Item): void {
        this.itens.push(item);
    }

    removerItem(item: Item): void {
        this.itens = this.itens.filter(i => i !== item);
    }

    listarItens() {
        console.log(`Inventário: `);
        for (const item of this.itens) {
            console.log(`- ${item.nome}`);
        }
    }
}

// classe Item 
class Item {
    constructor(
        public nome: string,
        public valor: number, 
    ) {}
}

// classe Cooldown
class Cooldown {
    private turnosRestantes: number = 0; 

    constructor(
        private duracao: number,
    ) {}

    iniciar(): void {
        this.turnosRestantes = this.duracao;
        console.log(`Cooldown iniciado. Bloqueado por ${this.duracao} turnos.`);
    }

    estaDisponivel(): boolean { 
        return this.turnosRestantes === 0;
    }

    passarTurno(): void { 
        if (this.turnosRestantes > 0) {
            this.turnosRestantes -= 1; 
        }
    }
}

// interface Habilidade 
interface Habilidade extends AtualizavelPorTurno {
    getNome(): string; 
    podeUsar(usuario: Personagem): boolean; 
    usar(usuario: Personagem, alvos: Personagem[]): void; 
}

// classe bola de fogo
class BolaDeFogo implements Habilidade {
    private nome: string = "Bola de Fogo";
    private custoMana: number = 20;
    private dano: number = 40;
    private cooldown: Cooldown;

    constructor() {
        this.cooldown = new Cooldown(2);
    }

    getNome(): string {
        return this.nome;
    }

    podeUsar(usuario: Personagem): boolean {
        return usuario.possuiMana(this.custoMana) && this.cooldown.estaDisponivel();
    }

    usar(usuario: Personagem, alvos: Personagem[]): void {
        if (!this.podeUsar(usuario)) {
            console.log(`${usuario.nome} não pode usar ${this.nome} no momento (sem mana ou em cooldown).`);
            return;
        }

        if (alvos.length === 0) {
            console.log(`${usuario.nome} tentou usar ${this.nome}, mas não havia alvos.`);
            return;
        }

        usuario.gastarMana(this.custoMana);
        const alvo = alvos[0];
        console.log(`${usuario.nome} lançou ${this.nome} em ${alvo.nome}!`);
        alvo.receberDano(this.dano);
        this.cooldown.iniciar();
    }

    novoTurno(): void {
        this.cooldown.passarTurno();
    }
}

// classe cura
class Cura implements Habilidade {
    private nome: string = "Cura";
    private custoMana: number = 15;
    private quantidadeCura: number = 30;
    private cooldown: Cooldown;

    constructor() {
        this.cooldown = new Cooldown(1);
    }

    getNome(): string {
        return this.nome;
    }

    podeUsar(usuario: Personagem): boolean {
        return usuario.possuiMana(this.custoMana) && this.cooldown.estaDisponivel();
    }

    usar(usuario: Personagem, alvos: Personagem[]): void {
        if (!this.podeUsar(usuario)) {
            console.log(`${usuario.nome} não pode usar ${this.nome} no momento.`);
            return;
        }

        if (alvos.length === 0) {
            console.log(`${usuario.nome} tentou usar ${this.nome}, mas não havia alvos.`);
            return;
        }

        usuario.gastarMana(this.custoMana);
        const alvo = alvos[0];
        console.log(`${usuario.nome} usou ${this.nome} em ${alvo.nome}!`);
        alvo.curar(this.quantidadeCura);
        this.cooldown.iniciar();
    }

    novoTurno(): void {
        this.cooldown.passarTurno();
    }
}

// classe golpe poderoso
class GolpePoderoso implements Habilidade {
    private nome: string = "Golpe Poderoso";
    private dano: number = 60;
    private cooldown: Cooldown;

    constructor() {
        this.cooldown = new Cooldown(3);
    }

    getNome(): string {
        return this.nome;
    }

    podeUsar(usuario: Personagem): boolean {
        return this.cooldown.estaDisponivel();
    }

    usar(usuario: Personagem, alvos: Personagem[]): void {
        if (!this.podeUsar(usuario)) {
            console.log(`${usuario.nome} não pode usar ${this.nome} no momento.`);
            return;
        }

        if (alvos.length === 0) {
            console.log(`${usuario.nome} tentou usar ${this.nome}, mas não havia alvos.`);
            return;
        }

        const alvo = alvos[0];
        console.log(`${usuario.nome} executou ${this.nome} em ${alvo.nome}!`);
        alvo.receberDano(this.dano);
        this.cooldown.iniciar();
    }

    novoTurno(): void {
        this.cooldown.passarTurno();
    }
}

// classe explosão 
class Explosao implements Habilidade {
    private nome: string = "Explosão";
    private custoMana: number = 25;
    private dano: number = 20;
    private cooldown: Cooldown;

    constructor() {
        this.cooldown = new Cooldown(3);
    }

    getNome(): string {
        return this.nome;
    }

    podeUsar(usuario: Personagem): boolean {
        return usuario.possuiMana(this.custoMana) && this.cooldown.estaDisponivel();
    }

    usar(usuario: Personagem, alvos: Personagem[]): void {
        if (!this.podeUsar(usuario)) {
            console.log(`${usuario.nome} não pode usar ${this.nome} no momento.`);
            return;
        }

        usuario.gastarMana(this.custoMana);
        console.log(`${usuario.nome} provocou uma ${this.nome} atingindo todos os alvos!`);

        for (const alvo of alvos) {
            alvo.receberDano(this.dano);
        }

        this.cooldown.iniciar();
    }

    novoTurno(): void {
        this.cooldown.passarTurno();
    }
}

// class drenagem de vida
class DrenagemDeVida implements Habilidade {
    private nome: string = "Drenagem de Vida";
    private custoMana: number = 15;
    private valorDreno: number = 25;
    private cooldown: Cooldown;

    constructor() {
        this.cooldown = new Cooldown(2);
    }

    getNome(): string {
        return this.nome;
    }

    podeUsar(usuario: Personagem): boolean {
        return usuario.possuiMana(this.custoMana) && this.cooldown.estaDisponivel();
    }

    usar(usuario: Personagem, alvos: Personagem[]): void {
        if (!this.podeUsar(usuario)) {
            console.log(`${usuario.nome} não pode usar ${this.nome} no momento.`);
            return;
        }

        if (alvos.length === 0) return;

        usuario.gastarMana(this.custoMana);
        const alvo = alvos[0];
        console.log(`${usuario.nome} usou ${this.nome} em ${alvo.nome}!`);
        alvo.receberDano(this.valorDreno);
        usuario.curar(this.valorDreno);
        this.cooldown.iniciar();
    }

    novoTurno(): void {
        this.cooldown.passarTurno();
    }
}

// interface dados do personagem 
interface PersonagemData {
    nome : string;
    vida : number; 
    vidaMaxima : number; 
    dano : number;
    xp : number;
    nivel : number; 
    mana : number;
    manaMaxima : number;
}

// interfade de dados do jogo
interface JogoData {
    personagens : PersonagemData[];
}


// interface salvamento 
interface JogoRepository {
    // salva e retorna o id criado
    salvar(jogo : Jogo) : number;

    // retorna as partidas
    listar() : Jogo[];

    // carrega uma partida específica
    carregar(id : number) : Jogo;

    // continua verificando se existe arquivo
    existe() : boolean;
}

// classe json 
class JsonJogoReposiory implements JogoRepository {
    constructor (
        private readonly arquivo : string
    ) {}

    existe() : boolean {
        return existsSync(this.arquivo)
    }

    salvar(jogo : Jogo) : number {
        let jogos : JogoData[] = []

        // se já existe um arquivo, carrega as partidas existentes
        if(this.existe()) {
            const json = readFileSync(this.arquivo, "utf-8")
            jogos = JSON.parse(json)
        }

        // transforma o jogo atual em dados que podem ser salvos
        const dados : JogoData = {
            personagens : jogo.listarPersonagens()
                .map(personagem => ( {
                    nome : personagem.nome, 
                    vida : personagem.getVida(),
                    vidaMaxina : personagem.getVidaMaxima(),
                    dano : personagem.getDano(),
                    xp : personagem.getXP(),
                    nivel : personagem.getNivel(),
                    mana : personagem.getMana(),
                    manaMaxima : personagem.getManaMaxima()
                }))
        }

        // adiciona o novo jogo ao array
        jogos.push(dados)

        // o índice do array será o id 
        const id = jogos.length - 1
        const json = JSON.stringify(jogos, null, 2)

        // salva de novo o array inteiro do mesmo arquivo 
        writeFileSync(this.arquivo, json, "utf-8")

        return id
    }

    listar() : Jogo[] {
        if(!this.existe()) return []

        const json = readFileSync(this.arquivo, "utf-8")

        const jogos : JogoData[] = JSON.parse(json)

        return jogos.map(dados => this.criarJogo(dados))
    }

    carregar(id : number) : Jogo {
        const jogos = this.listar()

        if(id < 0 || id >- jogos.length) {
            throw new Error("ID de partida inválido.")
        }
        
        return jogos[id]
    }

    private criarJogo(dados : JogoData) : Jogo {
        const jogo = new Jogo()

        for(const personagemData of dados.personagens) {
            const personagem = new Personagem(
                personagemData.nome, 
                personagemData.vida, 
                personagemData.xp, 
                personagemData.vidaMaxima, 
                personagemData.nivel, 
                personagemData.mana, 
                personagemData.manaMaxima
            )
            
            jogo.adicionarPersonagem(personagem)
        }

        return jogo
    }
}


// 1. criação de um Jogo
const jogo = new Jogo();

// 2. criação de personagens (com mana inicial e mana máxima)
const gandalf = new Personagem("Gandalf", 100, 0, 100, 1, 100, 100);
const aragorn = new Personagem("Aragorn", 120, 0, 120, 1, 30, 30);
const saruman = new Personagem("Saruman", 150, 0, 150, 1, 100, 100);

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

// 10. criação e utilização do inventário 
console.log("\nINVENTÁRIO");
console.log("Adicionando itens ao inventário de Aragorn");
aragorn.adicionarItensInventario(new Item("Poção de Vida", 50));
aragorn.adicionarItensInventario(new Item("Escudo", 100));
aragorn.adicionarItensInventario(new Item("Espada Antiga", 150));
console.log("Inventário de Aragorn");
aragorn.listarInventario();

// 11. aplicação de efeitos temporários
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

// 16. habilidades especiais 
console.log("\n=== HABILIDADES ESPECIAIS ===");

const bolaDeFogo = new BolaDeFogo();
const habilidadeCura = new Cura();
const golpePoderoso = new GolpePoderoso();
const explosao = new Explosao();
const drenagemVida = new DrenagemDeVida();

gandalf.aprenderHabilidade(bolaDeFogo);
gandalf.aprenderHabilidade(habilidadeCura);
gandalf.aprenderHabilidade(explosao);

aragorn.aprenderHabilidade(golpePoderoso);
saruman.aprenderHabilidade(drenagemVida);

console.log("\nGandalf usa Bola de Fogo em Saruman ");
gandalf.usarHabilidade(bolaDeFogo, [saruman]);
console.log("\nGandalf tenta usar Bola de Fogo novamente ");
gandalf.usarHabilidade(bolaDeFogo, [saruman]);
console.log("\nAragorn usa Golpe Poderoso em Saruman (sem mana)");
aragorn.usarHabilidade(golpePoderoso, [saruman]);
console.log("\nGandalf usa Cura em Aragorn");
gandalf.usarHabilidade(habilidadeCura, [aragorn]);
console.log("\nGandalf usa Explosão em Área atingindo Aragorn e Saruman");
gandalf.usarHabilidade(explosao, [aragorn, saruman]);
console.log("\nSaruman usa Drenagem de Vida em Gandalf");
saruman.usarHabilidade(drenagemVida, [gandalf]);
console.log("\nPassando 3 turnos para resetar os cooldowns");
jogo.passarTurno();
jogo.passarTurno();
jogo.passarTurno();
console.log("\nGandalf usa Bola de Fogo novamente após o cooldown recarregar");
gandalf.usarHabilidade(bolaDeFogo, [saruman]);