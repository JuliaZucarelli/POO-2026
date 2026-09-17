# Guia de POO em TypeScript — dúvidas e fundamentos

## 1. Por que `private inventario` e `private arma` ficam fora do `constructor`?

No código:

```ts
class Personagem {
    private inventario: Inventario;
    private arma: Arma | null = null;

    constructor(
        public nome: string,
        private vida: number,
        private xp: number,
        private vidaMaxima: number,
        private nivel: number,
    ) {
        this.inventario = new Inventario();
    }
}
```

Essas linhas são **declarações de atributos (propriedades) da classe**.

O `constructor` tem outra função: definir o que acontece **quando um objeto é criado**.

Há duas coisas diferentes acontecendo:

- `private inventario: Inventario;` declara que todo `Personagem` terá uma propriedade chamada `inventario`, do tipo `Inventario`.
- `this.inventario = new Inventario();` efetivamente cria o inventário daquele personagem.

Já:

```ts
private arma: Arma | null = null;
```

faz as duas coisas ao mesmo tempo: declara a propriedade e dá a ela um valor inicial (`null`).

### Por que não colocar tudo no constructor?

Você poderia escrever:

```ts
constructor(...) {
    this.inventario = new Inventario();
    this.arma = null;
}
```

Isso funciona. Porém, em TypeScript, propriedades podem ser inicializadas diretamente na declaração quando o valor inicial é simples ou quando a intenção fica mais clara ali.

Uma regra prática:

- **Declaração da propriedade:** "o objeto possui este dado".
- **Constructor:** "ao criar o objeto, faça estas inicializações/ações".

O `inventario` precisa de `new Inventario()`, então sua criação depende de executar código. O `arma` começa simplesmente como `null`, então pode ser inicializada diretamente.

---

## 2. Por que `interface Efeito extends AtualizavelPorTurno` usa `extends`?

Porque `Efeito` é uma **interface herdando o contrato de outra interface**:

```ts
interface AtualizavelPorTurno {
    novoTurno(): void;
}

interface Efeito extends AtualizavelPorTurno {
    aplicar(alvo: Personagem): void;
    estaAtivo(): boolean;
}
```

Isso significa:

> Todo `Efeito` precisa possuir tudo que `AtualizavelPorTurno` exige, além das coisas próprias de `Efeito`.

Portanto, um `Efeito` precisa ter:

```ts
novoTurno(): void;
aplicar(alvo: Personagem): void;
estaAtivo(): boolean;
```

### `extends` x `implements`

A diferença fundamental é:

**`extends` = herança/expansão de um contrato ou classe.**

```ts
interface Efeito extends AtualizavelPorTurno {}
```

**`implements` = uma classe promete cumprir um contrato.**

```ts
class Veneno implements Efeito {}
```

Uma interface não "implementa" outra interface. Ela pode **estender** outra interface.

Uma classe, por outro lado, pode implementar uma interface:

```ts
class Personagem implements AtualizavelPorTurno {
    novoTurno(): void {}
}
```

---

## 3. Por que `private itens: Item[] = []` fica fora do constructor?

Porque isso é uma propriedade que representa o **estado interno do inventário**:

```ts
class Inventario {
    private itens: Item[] = [];
}
```

Todo inventário começa vazio.

Aqui não precisamos receber os itens como argumento na criação:

```ts
new Inventario();
```

e depois adicionamos:

```ts
inventario.adicionarItem(item);
```

Seria possível fazer:

```ts
constructor(private itens: Item[] = []) {}
```

Mas isso comunica uma ideia diferente: o inventário poderia ser criado recebendo uma lista inicial.

Além disso, `private itens` é estado interno; quem usa `Inventario` não precisa saber como essa lista é armazenada.

Isso é parte importante de **encapsulamento**.

---

# 4. Interface x Class

## Interface

Uma interface descreve um **contrato**.

Ela diz:

> "Qualquer objeto que seja considerado desse tipo precisa possuir estas características."

Exemplo:

```ts
interface Arma {
    atacar(alvo: Personagem): void;
    podeUsar(): boolean;
    novoTurno(): void;
}
```

A interface `Arma` não precisa saber como a espada, o arco ou a varinha funcionam.

Ela apenas define o que uma arma deve saber fazer.

```ts
class Espada implements Arma {
    atacar(alvo: Personagem): void {}
    podeUsar(): boolean {}
    novoTurno(): void {}
}
```

```ts
class Arco implements Arma {
    atacar(alvo: Personagem): void {}
    podeUsar(): boolean {}
    novoTurno(): void {}
}
```

### Interface é ótima quando você quer definir capacidades/contratos

Por exemplo:

```ts
interface AtualizavelPorTurno {
    novoTurno(): void;
}
```

Qualquer coisa que possa ser atualizada por turno pode implementar isso:

```ts
class Personagem implements AtualizavelPorTurno {}
class Cooldown implements AtualizavelPorTurno {}
class Veneno implements AtualizavelPorTurno {}
```

Não importa se são classes completamente diferentes. O contrato em comum é `novoTurno()`.

---

## Class

Uma classe representa uma **estrutura de objeto**, normalmente com:

- dados/estado;
- métodos;
- regras;
- comportamento;
- construtor;
- lógica de criação.

Exemplo:

```ts
class Item {
    constructor(
        public nome: string,
        public valor: number,
    ) {}
}
```

Você pode criar objetos:

```ts
const pocao = new Item("Poção", 50);
```

Uma interface, por si só, não é criada com `new`.

Isto não funciona:

```ts
const arma = new Arma(); // errado
```

porque `Arma` é apenas um contrato.

---

# 5. Diferença resumida

| Interface | Class |
|---|---|
| Define um contrato | Define uma implementação |
| Descreve o que deve existir | Define dados e comportamento |
| Não é instanciada com `new` | Pode ser instanciada com `new` |
| Usa `extends` para herdar de outra interface | Pode `extends` outra classe |
| Uma classe pode `implements` uma interface | Pode implementar várias interfaces |
| Excelente para abstrair capacidades | Excelente para representar objetos com estado e lógica |

Uma forma simples de pensar:

> **Interface = "o que deve ser capaz de fazer".**

> **Classe = "como esse objeto existe e funciona".**

---

# 6. Quando declarar dentro e fora do constructor?

Primeiro, diferencie **parâmetros** de **propriedades**.

Veja:

```ts
constructor(
    private dano: number,
    private cooldown: number,
) {}
```

O `private` transforma esses parâmetros em propriedades da classe.

É praticamente uma forma abreviada de escrever:

```ts
private dano: number;
private cooldown: number;

constructor(dano: number, cooldown: number) {
    this.dano = dano;
    this.cooldown = cooldown;
}
```

## Use parâmetros do constructor quando o objeto precisa receber aquele valor na criação

Exemplo:

```ts
class Item {
    constructor(
        public nome: string,
        public valor: number,
    ) {}
}
```

Ao criar:

```ts
const item = new Item("Poção", 50);
```

O nome e o valor fazem parte da identidade inicial do item.

---

## Use propriedades fora quando elas são estado interno ou têm inicialização própria

Exemplo:

```ts
class Inventario {
    private itens: Item[] = [];
}
```

Não faz sentido exigir uma lista de itens toda vez que alguém cria um inventário.

Outro exemplo:

```ts
class Cooldown {
    private turnosRestantes: number = 0;

    constructor(private duracao: number) {}
}
```

`duracao` é uma configuração fornecida na criação.

`turnosRestantes` começa automaticamente em zero.

---

## Regra prática

Pergunte:

**"Esse valor precisa ser informado para criar o objeto?"**

Se sim, provavelmente faz sentido estar no constructor:

```ts
constructor(private dano: number) {}
```

Se não, e o valor pode começar com um padrão:

```ts
private turnosRestantes: number = 0;
```

Se a propriedade precisa ser criada com lógica:

```ts
this.inventario = new Inventario();
```

ela pode ser declarada fora e inicializada no constructor.

---

# 7. O que é composição?

Seu comentário:

```ts
private inventario: Inventario; // composição
```

está relacionado a **composição**.

O `Personagem` possui um `Inventario`:

```ts
class Personagem {
    private inventario: Inventario;

    constructor(...) {
        this.inventario = new Inventario();
    }
}
```

A ideia é:

> Um personagem **tem um** inventário.

Isso é diferente de herança:

> Um personagem **é um** tipo específico de alguma coisa.

A composição é muito comum em POO porque permite montar objetos a partir de outros objetos.

Seu personagem pode ter:

- um inventário;
- uma arma;
- efeitos;
- habilidades;
- etc.

---

# 8. O que é polimorfismo?

Polimorfismo significa, de maneira prática:

> **Uma mesma interface pode representar objetos diferentes, e cada objeto pode responder à mesma operação de uma maneira própria.**

No seu código:

```ts
interface Arma {
    atacar(alvo: Personagem): void;
    podeUsar(): boolean;
    novoTurno(): void;
}
```

Existem várias implementações:

```ts
class Espada implements Arma {}
class Arco implements Arma {}
class VarinhaMagica implements Arma {}
```

O `Personagem` pode trabalhar com:

```ts
private arma: Arma | null = null;
```

Ele não precisa saber se recebeu uma espada, arco ou varinha.

Imagine:

```ts
personagem.equiparArma(new Espada(...));
```

ou:

```ts
personagem.equiparArma(new Arco(...));
```

ou:

```ts
personagem.equiparArma(new VarinhaMagica(...));
```

O atributo continua sendo:

```ts
Arma
```

Esse é o ponto importante.

O personagem pode fazer:

```ts
this.arma.atacar(alvo);
```

sem precisar escrever:

```ts
if (arma instanceof Espada) ...
if (arma instanceof Arco) ...
if (arma instanceof VarinhaMagica) ...
```

Cada classe fornece sua própria implementação.

---

# 9. Polimorfismo no seu `Jogo`

Este trecho é um ótimo exemplo:

```ts
private objetos: AtualizavelPorTurno[] = [];
```

A lista aceita qualquer objeto que implemente:

```ts
interface AtualizavelPorTurno {
    novoTurno(): void;
}
```

Por exemplo:

```ts
class Personagem implements AtualizavelPorTurno {
    novoTurno(): void {}
}
```

```ts
class Cooldown implements AtualizavelPorTurno {
    novoTurno(): void {}
}
```

```ts
class Veneno implements Efeito {
    novoTurno(): void {}
}
```

Como `Efeito extends AtualizavelPorTurno`, um `Veneno` também é um `AtualizavelPorTurno`.

Então o jogo pode trabalhar genericamente:

```ts
for (const objeto of this.objetos) {
    objeto.novoTurno();
}
```

O `Jogo` não precisa saber qual é a classe concreta.

Esse é um dos maiores benefícios do polimorfismo: **reduzir o acoplamento**.

---

# 10. Por que `AtualizavelPorTurno[]` e não `Object[]`?

Porque o tipo da lista informa exatamente o que o `Jogo` precisa saber.

```ts
private objetos: AtualizavelPorTurno[] = [];
```

significa:

> "Eu não me importo com o que esses objetos são. Só preciso saber que todos possuem `novoTurno()`."

Isso é uma aplicação de abstração e polimorfismo.

---

# 11. Como imaginar a arquitetura do seu código

Uma possível leitura conceitual:

```text
Jogo
 ├── Personagens
 │    ├── Inventario
 │    │    └── Itens
 │    └── Arma
 │         ├── Espada
 │         ├── Arco
 │         └── VarinhaMagica
 │
 └── Objetos atualizáveis por turno
      ├── Personagem
      ├── Cooldown
      ├── Veneno
      └── Regeneracao
```

As interfaces funcionam como contratos entre essas partes.

```text
AtualizavelPorTurno
        ↑
        |
   ┌────┴─────────────┐
   |        |         |
Personagem Cooldown  Efeito
                       ↑
                 ┌─────┴─────┐
                 |           |
              Veneno    Regeneracao
```

E:

```text
Arma
 ↑
 ├── Espada
 ├── Arco
 └── VarinhaMagica
```

---

# 12. Uma observação importante sobre `Arma | null`

Você escreveu:

```ts
private arma: Arma | null = null;
```

O `|` significa **union type**.

A propriedade pode ser:

- uma `Arma`;
- ou `null`.

Isso representa muito bem o estado inicial:

```text
Personagem criado
      ↓
arma = null
      ↓
equiparArma(...)
      ↓
arma = Espada/Arco/Varinha
```

Isso também obriga o código a considerar a possibilidade de o personagem não ter arma.

---

# 13. Uma observação importante sobre `implements`

Quando você escreve:

```ts
class Espada implements Arma
```

você está dizendo:

> "Espada precisa cumprir o contrato definido por Arma."

Por isso a classe precisa possuir:

```ts
atacar(...)
podeUsar()
novoTurno()
```

Se faltar algum método obrigatório, o TypeScript acusa erro.

O `implements` não copia automaticamente o código da interface. A interface não fornece implementação.

Ela apenas define o contrato.

---

# 14. `extends` também pode aparecer em classes

Não confunda:

```ts
interface Efeito extends AtualizavelPorTurno
```

com:

```ts
class Cachorro extends Animal
```

No primeiro caso, uma interface está estendendo outra interface.

No segundo, uma classe está herdando implementação e estrutura de outra classe.

Por exemplo:

```ts
class Animal {
    comer(): void {}
}

class Cachorro extends Animal {
    latir(): void {}
}
```

`Cachorro` herda `comer()` de `Animal`.

Já:

```ts
interface Animal {
    comer(): void;
}

interface Cachorro extends Animal {
    latir(): void;
}
```

não está herdando uma implementação. Está apenas expandindo o contrato.

---

# 15. Resumo para estudar

### Constructor

Use para configurar o objeto no momento da criação.

```ts
constructor(private dano: number) {}
```

### Propriedade

Representa um dado/estado que pertence ao objeto.

```ts
private vida: number;
```

### Inicialização direta

Boa para valores padrão:

```ts
private arma: Arma | null = null;
private itens: Item[] = [];
```

### Inicialização no constructor

Boa quando é necessário executar uma criação ou lógica:

```ts
this.inventario = new Inventario();
this.cooldown = new Cooldown(duracaoCooldown);
```

### Interface

Contrato:

```ts
interface Arma {
    atacar(): void;
}
```

### `implements`

Uma classe cumpre um contrato:

```ts
class Espada implements Arma {}
```

### `extends`

Uma interface expande outra interface:

```ts
interface Efeito extends AtualizavelPorTurno {}
```

Ou uma classe herda de outra:

```ts
class Cachorro extends Animal {}
```

### Composição

Um objeto possui outro objeto:

```ts
Personagem → Inventario
```

### Polimorfismo

Objetos diferentes podem ser tratados por um mesmo contrato:

```ts
Arma
 ├── Espada
 ├── Arco
 └── VarinhaMagica
```

ou:

```ts
AtualizavelPorTurno
 ├── Personagem
 ├── Cooldown
 ├── Veneno
 └── Regeneracao
```

---

# 16. Regra mental final

Quando olhar para uma classe, faça estas perguntas:

1. **Quais dados esse objeto precisa ter?**
   → propriedades.

2. **Quais dados precisam ser fornecidos quando ele nasce?**
   → constructor.

3. **Quais valores podem começar automaticamente?**
   → inicialização da propriedade.

4. **Esse tipo representa um objeto com estado e comportamento?**
   → provavelmente `class`.

5. **Estou apenas dizendo o que algo precisa saber fazer?**
   → provavelmente `interface`.

6. **Várias classes diferentes precisam oferecer a mesma capacidade?**
   → interface + `implements`.

7. **Uma interface precisa incorporar o contrato de outra?**
   → `extends`.

8. **Quero tratar classes diferentes da mesma maneira?**
   → polimorfismo.

9. **Um objeto é formado por outros objetos?**
   → composição.

A ideia central da POO não é decorar palavras como `class`, `interface`, `extends` e `implements`. É entender **quem possui cada responsabilidade, quais objetos colaboram entre si e quais contratos permitem que eles trabalhem juntos sem ficarem excessivamente dependentes uns dos outros.**
