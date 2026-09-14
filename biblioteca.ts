class Livro { 
    titulo : string 
    autor : string 
    codigo : string 
    disponivel : boolean 

    constructor (titulo : string, autor : string, codigo : string) { 
        this.titulo = titulo 
        this.autor = autor
        this.codigo = codigo
        this.disponivel = true 
    }

    emprestar () : boolean { 
            if (this.disponivel = false) {
            console.log (`Livro indisponível.`)
            return false
        } else {
            this.disponivel = false
            console.log (`Empréstimo realizado.`)
            return true
        }
    }

    devolver () { 
       // const disponivel = this.disponivel   -> cria uma variável local, onde o 'disponível' é só uma cópia do valor de 'this.disponivel' naquele momento 
       // mudar essa variavél não afeita a propriedade 'this.disponivel' do objeto
        this.disponivel = true 
        console.log (`Devolução confirmada.`)

    }
}


class Biblioteca {
    nome : string 
    acervo : Livro[] // lista de livros cadastrados 
    emprestimosAtivo : string[] // lista de mensagens registrando cada empréstimo feito ocm sucesso 

    constructor (nome : string) {
        this.nome = nome
        this.acervo = []
        this.emprestimosAtivos = []
    }

    cadastrarLivro (livro : Livro){
        this.acervo.push (livro)
    }

    buscarLivroPorCodigo (codigo : string) : Livro | undefined { 
        return this.acervo.find ((livro) => { 
            return livro.codigo == codigo // == : comparação 
        })
    }

    realizarEmprestimo (codigo : string) {
        const livro = this.buscarLivroPorCodigo (codigo)

        if (!livro) { // aqui pode substituir por: 'if (livro == undefined)', o '!' inverte, significando se o livro for vazio/falso
            console.log (`Livro não encontrado.`)
            return
        } else {
            const conseguiuEmprestar = livro.emprestar ()

            if  (livro.emprestar ()) {
                this.emprestimosAtivo.push (`O livro ${livro.titulo} foi emprestado.`)
           }
        }
    }

    listarDisponiveis () {
        this.acervo.forEach ((livro) => {
            if (livro.disponivel) {
                console.log (livro.titulo)
            }
        })
    }
}

const biblioteca = new Biblioteca ('Biblioteca Central')

const livro1 = new Livro ('Dom Casmurro', 'Machado de Assis', 'L001')
const livro2 = new Livro ('1984', 'George Owell', ' L002')

biblioteca.cadastrarLivro (livro1)
biblioteca.cadastrarLivro (livro2)

biblioteca.realizarEmprestimo ('LOO1')
biblioteca.realizarEmprestimo ( 'L002')
biblioteca.realizarEmprestimo ('L003')

biblioteca.listarDisponiveis ()

