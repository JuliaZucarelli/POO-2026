# Cronograma de estudos - POO 2026

**Período:** 1 de setembro a 10 de dezembro de 2026  
**Ritmo-base:** 6 a 8 horas por semana, em quatro sessões de 90 a 120 minutos.  
**Linguagem sugerida:** TypeScript, que já está configurada neste repositório e é prevista na ementa.

## Rotina semanal

Em cada semana, mantenha a mesma cadência:

1. **Conceito (1h30):** releia a aula, faça anotações curtas com suas palavras e responda: "que problema isto resolve?".
2. **Exercícios (1h30):** resolva de 3 a 5 exercícios pequenos sem consultar soluções antes da primeira tentativa.
3. **Código (2h):** implemente ou evolua um mini-sistema no repositório.
4. **Revisão (1h):** explique o código em voz alta, registre dúvidas e refatore ao menos um ponto.

Caso tenha só 4 horas em uma semana, preserve nesta ordem: conceito, um exercício, código e revisão. A consistência vale mais que compensar tudo em uma maratona.

## Plano por semana

| Semana | Datas | Foco da ementa | Prática e marco concreto |
|---|---|---|---|
| 1 | 01-06 set | Introdução a POO; classes, atributos e métodos | Refaça e amplie `aula01.ts`: `Personagem` com ações como atacar, curar e exibir status. Desenhe no papel quais dados e comportamentos pertencem à classe. |
| 2 | 07-13 set | Construtores e sobrecarga | Crie personagens de tipos diferentes e valide estados iniciais. Compare construtor, método comum e função externa. |
| 3 | 14-20 set | Atributos/métodos estáticos; estruturas de controle e decisão | Faça uma classe com contador/ID estático e use condicionais e laços em uma pequena simulação de turnos. |
| 4 | 21-27 set | Encapsulamento; revisão de classes e métodos | Torne dados sensíveis privados, crie métodos que preservem regras (por exemplo, vida não negativa) e escreva 10 perguntas teóricas de revisão. |
| 5 | 28 set-04 out | Reutilização de classes: herança | Modele uma hierarquia pequena, como `Personagem -> Guerreiro/Mago`. Justifique quais atributos e métodos ficam na classe-base. |
| 6 | 05-11 out | Sobreposição, polimorfismo e ligação dinâmica | Coloque instâncias diferentes em uma mesma lista e execute a mesma ação em todas. Explique por que o comportamento muda. |
| 7 | 12-18 out | Classes abstratas, interfaces e pacotes | Transforme a abstração apropriada em classe abstrata e crie uma interface de comportamento, como `Atacavel` ou `Usavel`. Separe os arquivos por responsabilidade. |
| 8 | 19-25 out | Arrays e matrizes | Implemente inventário, equipe ou mapa simples. Pratique percorrer, buscar, incluir e remover elementos. |
| 9 | 26 out-01 nov | Strings e arquivos | Faça relatórios legíveis com strings e salve/carregue um estado simples do sistema em arquivo. |
| 10 | 02-08 nov | Coleções de objetos | Substitua onde fizer sentido arrays por `Map` ou `Set`; discuta a escolha e seus efeitos no código. |
| 11 | 09-15 nov | Tratamento de exceções | Crie erros para ações inválidas e trate-os de maneira compreensível. Faça uma lista dos cenários de falha do mini-sistema. |
| 12 | 16-22 nov | Integração e estudo de caso | Feche uma versão pequena, executável e organizada do mini-sistema. Faça uma revisão teórica geral dos 12 tópicos da ementa. |
| 13 | 23-29 nov | Projeto final: planejamento e MVP | Quando o enunciado do projeto estiver definido: escreva requisitos, casos de uso, diagrama simples de classes e entregue uma versão mínima funcional. |
| 14 | 30 nov-06 dez | Projeto final: acabamento; revisão para prova | Complete as funcionalidades prioritárias, trate erros e prepare README. Faça um simulado teórico cronometrado e revise apenas os erros. |
| 15 | 07-10 dez | Entrega e consolidação | Reserve estes quatro dias para correções, apresentação/entrega e uma última revisão leve. Evite adicionar funcionalidades novas. |

## Checklist de domínio para a prova teórica

Ao fim de cada semana, tente responder sem abrir material:

- Qual é a diferença entre classe, objeto, atributo e método?
- Quando usar encapsulamento, herança, composição, interface ou classe abstrata?
- O que construtores, sobrecarga e sobreposição fazem - e em que diferem?
- Como polimorfismo e ligação dinâmica aparecem num exemplo concreto?
- Como coleções, arquivos e exceções mudam a robustez de uma aplicação?

Se não conseguir explicar um item em dois minutos e criar um exemplo mínimo, ele volta para a revisão da semana seguinte.

## Estratégia para o projeto final

Use o projeto como estudo, não como uma tarefa separada. A partir da semana 5, cada conceito deve entrar primeiro no mini-sistema; depois, só o que fizer sentido migra para o projeto final. Sua experiência em jogos pode tornar os exemplos mais intuitivos - personagens, inventário, habilidades ou uma ferramenta de organização de assets são domínios excelentes - mas o tema definitivo deve obedecer ao enunciado da disciplina.

Quando você trouxer o enunciado, este cronograma pode ser convertido em backlog: requisitos, classes, entregas semanais e checklist de avaliação.

## Observação sobre avaliação

A ementa disponível, datada de 2022, informa duas provas escritas (80%) e exercícios (20%). Este plano prioriza a informação atual que você passou - prova teórica e projeto final - e mantém exercícios semanais para sustentar ambos. Confirme no Classroom o peso e as datas oficiais assim que forem publicados.
