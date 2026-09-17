# Encapsulamento, Composição, `const` e `filter`

## 1. Encapsulamento

**O que é:** um dos pilares da Programação Orientada a Objetos. Consiste em **esconder os detalhes internos** de um objeto e expor apenas o que é necessário através de uma interface controlada (métodos públicos). A ideia é proteger o estado interno do objeto contra alterações indevidas ou inconsistentes vindas de fora da classe.

**Como isso aparece no código:**

```typescript
class Personagem {
  private vida: number
  private nivel: number
  private experiencia: number
  ...
}
```

O atributo `vida` é `private`. Isso significa que **fora da classe `Personagem`**, ninguém pode fazer:

```typescript
guerreiro.vida = -9999 // ERRO de compilação em TypeScript
```

O TypeScript vai impedir isso na hora da compilação. A única forma de alterar a vida do personagem é através dos métodos que a própria classe expõe, como:

```typescript
guerreiro.receberDano(10)
guerreiro.curar(20)
```

E esses métodos contêm **regras de negócio** que garantem consistência:

```typescript
receberDano(dano: number) {
  this.vida -= dano
  if (this.vida < 0) {
    this.vida = 0 // nunca deixa a vida ficar negativa
  }
  ...
}
```

Se `vida` fosse pública, qualquer código externo poderia colocá-la em um estado inválido (como -50), quebrando a lógica do jogo. Encapsular evita isso: **você só pode mudar o estado interno através de "portas" controladas** (os métodos).

**Níveis de acesso em TypeScript:**
- `public` (padrão): acessível de qualquer lugar.
- `private`: acessível **somente dentro da própria classe**.
- `protected`: acessível dentro da classe e de subclasses (herança).

No código, `nome` é `public` (pode ser lido/alterado livremente), mas `vidaMaxima`, `vida`, `nivel`, `experiencia`, `arma` e `inventario` são `private` — só o próprio objeto `Personagem` pode mexer diretamente neles.

**Por que isso importa na prática:** imagine que amanhã você decida que a vida máxima não pode passar de 500. Se `vida` for pública, você precisaria caçar em todo o código onde ela é alterada para adicionar essa regra. Sendo privada e alterada só por métodos internos, você muda a regra em **um único lugar** (dentro da classe) e tudo que depende dela já respeita a nova regra automaticamente.

---

## 2. Composição

**O que é:** uma forma de relacionar duas classes onde uma classe **contém uma instância de outra** como parte de si mesma — uma relação do tipo "**tem um**" (has-a), em vez de "**é um**" (is-a, que é herança).

**Como aparece no código:**

```typescript
class Personagem {
  private inventario: Inventario // composição
  
  constructor(...) {
    ...
    this.inventario = new Inventario()
  }
  
  adicionarItem(item: Item) {
    this.inventario.adicionar(item)
  }

  mostrarInventario() {
    this.inventario.listar()
  }
}
```

Um `Personagem` **tem um** `Inventario`. Não é que `Personagem` seja um tipo de `Inventario`, nem que ele herde comportamentos dele — ele simplesmente **possui** um objeto `Inventario` como parte da sua estrutura interna, e delega tarefas relacionadas a itens para esse objeto.

**Composição vs. Herança** (a outra forma clássica de relacionar classes):

- **Herança** seria algo como `class Guerreiro extends Personagem` — "Guerreiro **é um** Personagem".
- **Composição** é `Personagem` **tendo um** `Inventario`, uma `Arma` etc.

**Por que usar composição aqui em vez de, por exemplo, colocar a lista de itens direto dentro de `Personagem`?**

1. **Responsabilidade única**: a lógica de gerenciar itens (adicionar, remover, listar) fica isolada dentro de `Inventario`. Se amanhã você quiser adicionar um limite de peso, ordenação, ou categorias de itens, você mexe só na classe `Inventario`, sem tocar em `Personagem`.
2. **Reutilização**: se no futuro você criar uma classe `Baú` ou `Loja`, ambas também poderiam ter um `Inventario`, reaproveitando a mesma lógica.
3. **Encapsulamento em camadas**: `Personagem` não sabe (nem precisa saber) como o `Inventario` armazena os itens internamente (se é um array, um Map, etc.) — ele só chama `adicionar()` e `listar()`. Isso é chamado de "composição favorece a flexibilidade sobre herança rígida".

**Outro exemplo de composição no mesmo código:**

```typescript
private arma: Arma = new Arma('faca', 5)
```

`Personagem` também **tem uma** `Arma`. A arma existe de forma independente (poderia até ser compartilhada entre personagens, como acontece com `espada` sendo passada para `barbaro`), mas o personagem "usa" a arma através de composição.

**Regra prática para identificar composição:** pergunte "X tem um Y?" ou "X é composto por Y?". Se a resposta fizer sentido (Personagem tem um Inventario, Carro tem um Motor, Pedido tem uma lista de Produtos), é composição.

---

## 3. `const`

**O que é:** uma palavra-chave do JavaScript/TypeScript para declarar variáveis cujo **valor não pode ser reatribuído** após a declaração inicial.

**Exemplo simples:**

```typescript
const dano = this.arma.atacar()
dano = 20 // ERRO: não pode reatribuir uma variável const
```

Isso é diferente de `let`, que permite reatribuição:

```typescript
let vida = 100
vida = 90 // OK
```

**⚠️ Ponto importante: `const` não torna o objeto imutável, apenas impede a reatribuição da variável.**

Isso é sutil e muito importante de entender. Veja este trecho do código:

```typescript
remover(item: Item) {
  this.itens = this.itens.filter(i => i !== item)
}
```

Aqui `this.itens` **não é `const`** (é uma propriedade normal `private itens: Item[] = []`), por isso pode ser reatribuída a uma nova lista.

Mas olha este outro exemplo:

```typescript
const vidaAntes = this.vida
```

`vidaAntes` é uma constante — ela guarda um "instantâneo" do valor de `this.vida` **naquele momento**. Mesmo que `this.vida` mude logo em seguida (`this.vida -= dano`), a variável `vidaAntes` continua com o valor antigo, porque números são copiados por valor.

**E se for um objeto?**

```typescript
const espada = new Arma('Espada', 10)
```

Aqui `espada` é uma constante que aponta para um objeto `Arma`. Você **não pode** fazer `espada = new Arma('Machado', 20)` (reatribuir a variável), mas você **pode** fazer `espada.dano = 999` (alterar uma propriedade do objeto), porque isso não é reatribuição da variável — é mutação do objeto que ela referencia. `const` trava o "ponteiro", não o conteúdo apontado.

**Por que usar `const` como padrão?** Boas práticas modernas de JavaScript/TypeScript recomendam usar `const` sempre que possível, e só usar `let` quando você realmente sabe que vai reatribuir a variável. Isso deixa o código mais previsível e evita bugs de reatribuição acidental. Repare que no código, praticamente todo lugar que não precisa mudar usa `const` (`dano`, `vidaAntes`, `danoReal`, `espada`, `guerreiro`, `barbaro`).

---

## 4. `filter`

**O que é:** um método de arrays em JavaScript/TypeScript que **cria um novo array** contendo apenas os elementos que satisfazem uma condição (uma função que retorna `true` ou `false` para cada elemento).

**Como aparece no código:**

```typescript
remover(item: Item) {
  this.itens = this.itens.filter(i => i !== item)
}
```

Vamos destrinchar isso:

- `this.itens` é o array original de itens.
- `.filter(callback)` percorre **cada elemento** do array e chama a função `callback` passando o elemento (`i`).
- Se o `callback` retornar `true`, o elemento **é mantido** no novo array.
- Se retornar `false`, o elemento **é descartado**.
- No final, `filter` retorna um **array novo** — ele **não modifica** o array original.

Nesse caso específico, a condição é `i !== item`, ou seja: "mantenha no array todo item que **não seja** (referência diferente) o item que eu quero remover". Assim, o item passado como parâmetro é excluído do resultado, e todos os outros permanecem.

**Exemplo passo a passo:**

```typescript
const pocao = new Item('poção', 100)
const espadaItem = new Item('espada velha', 50)

inventario.adicionar(pocao)
inventario.adicionar(espadaItem)

// this.itens agora é: [pocao, espadaItem]

inventario.remover(pocao)

// this.itens.filter(i => i !== pocao)
// para pocao:      pocao !== pocao       → false → removido
// para espadaItem: espadaItem !== pocao  → true  → mantido

// resultado: [espadaItem]
```

**Por que `i !== item` compara por referência, e o que isso implica?**

Em JavaScript, quando você compara dois objetos com `!==` (ou `===`), a comparação verifica se são **exatamente o mesmo objeto na memória**, não se têm os mesmos valores. Por isso:

```typescript
const pocao1 = new Item('poção', 100)
const pocao2 = new Item('poção', 100)

pocao1 === pocao2 // false! São objetos diferentes, mesmo com os mesmos dados
```

Isso significa que, no método `remover`, se você tentar remover um item "parecido" mas que foi criado como uma instância diferente, ele **não vai ser removido**, porque a comparação de referência vai falhar para todos os itens (nenhum é "exatamente" o objeto que você passou, a menos que seja literalmente o mesmo).

**Outros métodos parecidos com `filter` (para contexto):**
- `map`: transforma cada elemento e retorna um novo array com os resultados (ex: pegar só os nomes dos itens).
- `find`: retorna o **primeiro** elemento que satisfaz a condição (ou `undefined`), não um array.
- `forEach`: executa uma ação para cada elemento, mas não retorna nada (usado no `listar()` com `for...of`, que tem efeito parecido).

**Analogia simples:** pense em `filter` como uma peneira. Você passa uma lista de grãos (o array), e para cada grão você pergunta "esse passa pela peneira?" (o callback). No final, você fica só com os grãos que passaram — os outros ficam retidos e descartados. O array original continua intacto; você recebe uma peneirada nova.
