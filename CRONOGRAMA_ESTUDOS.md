# Cronograma de estudos - POO 2026

**Período:** 1 de setembro a 10 de dezembro de 2026
**Ritmo-base:** 6 horas semanais de estudo autônomo, já reservadas na agenda.
**Linguagem sugerida:** TypeScript, que já está configurada neste repositório e é prevista na ementa.

## Blocos protegidos na agenda

A agenda semanal já oferece uma distribuição sustentável. Estes são os blocos que orientam este plano; eles não alteram as aulas da faculdade ou os treinos.

| Dia | Horário | Bloco | Uso no cronograma |
|---|---:|---|---|
| Terça | 14h-16h | Estudo - POO | Conceito novo e anotações; resolver 2 exercícios curtos. |
| Quinta | 14h-16h | Estudo - POO | Exercícios de modelagem e implementação sem consultar solução. |
| Sexta | 14h-16h | Estudo - POO | Evoluir o mini-sistema, revisar a semana e registrar dúvidas. |
| Segunda e quarta | 15h30-17h30 | Aula de POO | Aula fixa: usar somente para acompanhar e anotar dúvidas. |


## Plano por semana

| Semana | Datas | Foco da ementa | Prática e marco concreto |
|---|---|---|---|
| 1 | 01-06 set | Introdução a POO; classes, atributos e métodos | Refaça e amplie `aula01.ts`: `Personagem` com ações como atacar, curar e exibir status. Desenhe no papel quais dados e comportamentos pertencem à classe. |
| 2 | 07-13 set | Construtores e sobrecarga | Crie personagens de tipos diferentes e valide estados iniciais. Compare construtor, método comum e função externa. |
| 3 | 14-20 set | Atributos/métodos estáticos; estruturas de controle e decisão | Faça uma classe com contador/ID estático e use condicionais e laços em uma pequena simulação de turnos. |
| 4 | 21-27 set | Encapsulamento; revisão de classes e métodos | Torne dados sensíveis privados, crie métodos que preservem regras (por exemplo, vida não negativa) e escreva 10 perguntas teóricas de revisão. |
| 5 | 28 set-04 out | Herança; início do projeto | Forme equipe (ou confirme trabalho individual), escolha problema com regras de negócio e crie repositório, README, issues e primeiro commit. |
| 6 | 05-11 out | Sobreposição, polimorfismo e ligação dinâmica | Faça levantamento de requisitos, casos de uso e diagrama inicial de classes. Entregue um esqueleto executável no GitHub. |
| 7 | 12-18 out | Classes abstratas, interfaces e pacotes; preparação para T | Implemente o núcleo do domínio com classes e interfaces. Faça um simulado teórico e uma revisão dos erros. |
| 8 | 19-25 out | Arrays e matrizes; prova teórica (estimativa) | Priorize a prova teórica se ela ocorrer nesta janela. No projeto, conclua o MVP de uma regra de negócio ponta a ponta. |
| 9 | 26 out-01 nov | Strings e arquivos | Inclua persistência/serialização pertinente e mais uma regra de negócio. Mantenha issues e commits semanais. |
| 10 | 02-08 nov | Coleções de objetos | Use coleções adequadas no domínio e comece testes automatizados das regras centrais. |
| 11 | 09-15 nov | Tratamento de exceções | Trate falhas de domínio e entradas inválidas; aumente a cobertura dos testes mais importantes. |
| 12 | 16-22 nov | Integração e estudo de caso | Integre backend orientado a objetos e uma UI interativa. Faça uma demonstração interna e registre problemas encontrados. |
| 13 | 23-29 nov | Projeto: versão candidata | Feche funcionalidades prioritárias, corrija bugs e escreva documentação de execução, arquitetura e testes. |
| 14 | 30 nov-06 dez | Projeto: apresentação e tour de código | Ensaiem o demo e preparem um tour que evidencie classes, métodos, interfaces, regras de negócio e testes automatizados. |
| 15 | 07-10 dez | Entrega e apresentação | Reserve estes quatro dias para correções, apresentação/entrega e uma última revisão leve. Evite adicionar funcionalidades novas. |

## Checklist de domínio para a prova teórica

Ao fim de cada semana, tente responder sem abrir material:

- Qual é a diferença entre classe, objeto, atributo e método?
- Quando usar encapsulamento, herança, composição, interface ou classe abstrata?
- O que construtores, sobrecarga e sobreposição fazem - e em que diferem?
- Como polimorfismo e ligação dinâmica aparecem num exemplo concreto?
- Como coleções, arquivos e exceções mudam a robustez de uma aplicação?

Se não conseguir explicar um item em dois minutos e criar um exemplo mínimo, ele volta para a revisão da semana seguinte.

## Estratégia para avaliações e projeto final

**Nota final:** `NF = T × 0,3 + P × 0,7`. Portanto, o projeto e as atividades práticas têm prioridade semanal sem abandonar a preparação para a prova teórica do meio do semestre.

O projeto deve começar na semana 5, não em novembro. Ele precisa ser um sistema com regras de negócio e testes automatizados - não apenas uma página ou CRUD. Uma arquitetura inicial adequada é:

`Frontend com UI interativa -> API/backend em POO -> domínio com regras, classes, interfaces e testes automatizados`.

Use o projeto como estudo, não como uma tarefa separada. Cada conceito novo deve entrar primeiro em um exercício pequeno e, quando fizer sentido, no projeto. Sua experiência em jogos pode tornar os exemplos mais intuitivos - personagens, inventário, habilidades ou uma ferramenta de organização de assets são domínios excelentes - mas o tema definitivo deve obedecer ao enunciado da disciplina.

### Ritmo de atividade no GitHub

Toda semana, a equipe deve deixar uma evidência concreta no repositório: issue refinada, requisito documentado, diagrama atualizado, código, teste, correção ou documentação. Prefira commits pequenos e descritivos durante a semana a um único envio grande no domingo. Antes da apresentação, o histórico deve contar a evolução do sistema.

Quando você trouxer o enunciado, este cronograma pode ser convertido em backlog: requisitos, classes, entregas semanais e checklist de avaliação.

## Observação sobre avaliação

A ementa disponível, datada de 2022, informa duas provas escritas (80%) e exercícios (20%). Este plano foi atualizado conforme a regra atual: uma prova teórica (30%) e uma avaliação prática/projeto (70%). A data da prova ainda é estimada como meio do semestre; substitua-a pela data oficial quando ela for divulgada.
