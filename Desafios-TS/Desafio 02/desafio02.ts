enum Trabalho {
  Atriz,
  Padeiro
}

interface pessoa {
  nome: String, 
  idade: number, 
  profissao: Trabalho
}

const pessoa1: pessoa = {
  nome: "maria",
  idade: 29,
  profissao: Trabalho.Atriz
}

const pessoa2: pessoa = {
  nome: "roberto",
  idade: 19,
  profissao: Trabalho.Padeiro,
}

const pessoa3: pessoa = {
    nome: "laura",
    idade: 32,
    profissao: Trabalho.Atriz
};

const pessoa4: pessoa = {
    nome: "carlos",
    idade: 19,
    profissao: Trabalho.Padeiro
}

console.log(pessoa1)