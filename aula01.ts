// Interface que define a estrutura de um personagem
interface Personagem {
  nome: string;
  pontosVida: number;
}

// Função que diminui os pontos de vida do personagem
function ataque(alvo: Personagem, dano: number): void {
  alvo.pontosVida -= dano;

  // Garante que os pontos de vida não fiquem negativos
  if (alvo.pontosVida < 0) {
    alvo.pontosVida = 0;
  }

  console.log(
    `${alvo.nome} recebeu ${dano} de dano! PV restante: ${alvo.pontosVida}`
  );
}

// Criação e inicialização do personagem
const heroi: Personagem = {
  nome: "Aragorn",
  pontosVida: 100,
};

console.log(`Personagem criado: ${heroi.nome} com ${heroi.pontosVida} PV.\n`);

// Simulando ataques
ataque(heroi, 30);
ataque(heroi, 80);