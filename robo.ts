// interface que define a estrutura do personagem 
interface Personagem { 
    nome : string; 
    energia : number; 
}

// função que diminui a energia do robo 
function diminuiEnergia (alvo : Personagem, dano : number){ 
    alvo.energia -= dano; 

    // garante que a energia não fique negativa 
    if (alvo.energia < 0){
        alvo.energia = 0; 
    }

    console.log (`${alvo.nome} usou ${dano} de energia. Energia restante: ${alvo.energia}`);
}

// criação e inicialização do personagem 

const robo : Personagem = { 
    nome : "R2-D2",
    energia : 100,
}; 

console.log (`Robo criado: ${robo.nome} com ${robo.energia} de energia. \n`);

diminuiEnergia(robo, 25); 
diminuiEnergia(robo, 90);

