export default class Operador {
  constructor({ nome, matricula, turno }) {
    this.nome = nome;
    this.matricula = matricula;
    this.turno = turno;
  }

  validar() {
    const erros = [];

    if (typeof this.nome !== 'string' || this.nome.trim().length < 3) {
      erros.push('O nome deve possuir pelo menos 3 caracteres.');
    }

    if (typeof this.matricula !== 'string' || !this.matricula.trim()) {
      erros.push('A matrícula não pode ficar vazia.');
    }

    if (typeof this.turno !== 'string' || !this.turno.trim()) {
      erros.push('O turno não pode ficar vazio.');
    }

    return erros;
  }
}
