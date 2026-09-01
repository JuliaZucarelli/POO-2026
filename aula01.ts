class Personagem {
    nome: string;
    pontos_vida: number;

    constructor(nome: string, pontos_vida: number) {
        this.nome = nome;
        this.pontos_vida = pontos_vida;
    }
}

function ataque(alvo: Personagem, dano: number): void {
    alvo.pontos_vida -= dano;

    // Garante que os pontos de vida não fiquem negativos
    if (alvo.pontos_vida < 0) {
        alvo.pontos_vida = 0;
    }

    console.log(
        `${alvo.nome} recebeu ${dano} de dano! PV restante: ${alvo.pontos_vida}`
    );
}

// Criação e inicialização do personagem
const heroi = new Personagem("Aragorn", 100);

console.log(
    `Personagem criado: ${heroi.nome} com ${heroi.pontos_vida} PV.\n`
);

// Simulando ataques
ataque(heroi, 30);
ataque(heroi, 80);