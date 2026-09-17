# Entendendo o `implements` no TypeScript

O modificador **`implements`** é uma palavra-chave no TypeScript utilizada para garantir que uma **classe** siga estritamente o contrato definido por uma **interface** ou por outra classe. 

Ao usar o `implements`, você força o TypeScript a verificar, em tempo de compilação, se a sua classe possui todas as propriedades e métodos exigidos por aquele contrato.

---

## Para que serve?

* **Segurança de Código:** Garante que você não esqueça de implementar nenhum método ou atributo obrigatório.
* **Padronização:** Permite que diferentes classes compartilhem a mesma estrutura pública, facilitando o polimorfismo.
* **Detecção de Erros Precoce:** O TypeScript acusa um erro imediatamente se a classe divergir do formato especificado.

---

## Como Usar (Exemplo Prático)

No exemplo abaixo, criamos uma interface chamada `IPagamento` e exigimos que qualquer classe de pagamento implemente a mesma lógica:

```typescript
// 1. Definindo o contrato
interface IPagamento {
  valor: number;
  processar(): boolean;
}

// 2. Implementando o contrato na classe
class PagamentoCartao implements IPagamento {
  valor: number;

  constructor(valor: number) {
    this.valor = valor;
  }

  // Se este método não existir, o TypeScript gerará um erro de compilação
  processar(): boolean {
    console.log(`Processando pagamento de R$${this.valor} no cartão...`);
    return true;
  }
}
```

---

## Regras e Comportamentos Importantes

### 1. Implementando Múltiplas Interfaces
Uma classe no TypeScript pode implementar mais de uma interface ao mesmo tempo. Para isso, basta separar os nomes por vírgula:

```typescript
interface Autenticavel {
  login(): void;
}

interface Autorizavel {
  verificarPermissao(role: string): boolean;
}

class Usuario implements Autenticavel, Autorizavel {
  login() {
    console.log("Usuário logado.");
  }

  verificarPermissao(role: string): boolean {
    return role === "admin";
  }
}
```

### 2. O `implements` não altera os tipos dos membros da classe
Um erro comum é achar que a interface define automaticamente os tipos dentro da classe. O `implements` apenas **checa** se os tipos batem, ele não os infere implicitamente nos argumentos dos métodos:

```typescript
interface Logger {
  log(mensagem: string): void;
}

// ERRO: O parâmetro 'msg' terá implicitamente o tipo 'any' se o noImplicitAny estiver ativo.
// Você precisa tipar explicitamente na classe!
class ConsoleLogger implements Logger {
  log(msg: string) { 
    console.log(msg);
  }
}
```

### 3. Propriedades Opcionais
Se a interface possuir propriedades opcionais (com `?`), a classe não é obrigada a implementá-las.

---

## Resumo Visual: `extends` vs `implements`

| Palavra-chave | Alvo | O que faz? | Limitação |
| :--- | :--- | :--- | :--- |
| **`extends`** | Classes ou Interfaces | Herança (copia o comportamento e estrutura de um pai) | Apenas **uma** classe mãe |
| **`implements`** | Classes | Contrato (apenas checa se a classe possui a estrutura exigida) | Pode implementar **várias** interfaces |
