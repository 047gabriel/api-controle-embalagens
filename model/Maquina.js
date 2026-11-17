export default class Maquina {
  constructor({ nome, patrimonio, status }) {
    this.nome = nome;
    this.patrimonio = patrimonio;
    this.status = status;
  }

  validar() {
    const erros = [];

    if (typeof this.nome !== 'string' || this.nome.trim().length < 3) {
      erros.push('O nome deve possuir pelo menos 3 caracteres.');
    }

    if (typeof this.patrimonio !== 'string' || !this.patrimonio.trim()) {
      erros.push('O patrimônio não pode ficar vazio.');
    }

    if (typeof this.status !== 'string' || !this.status.trim()) {
      erros.push('O status não pode ficar vazio.');
    }

    return erros;
  }
}
