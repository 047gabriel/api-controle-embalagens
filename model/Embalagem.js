export default class Embalagem {
  constructor({ descricao, material, capacidade }) {
    this.descricao = descricao;
    this.material = material;
    this.capacidade = capacidade;
  }

  validar() {
    const erros = [];

    if (typeof this.descricao !== 'string' || this.descricao.trim().length < 3) {
      erros.push('A descrição deve possuir pelo menos 3 caracteres.');
    }

    if (typeof this.material !== 'string' || !this.material.trim()) {
      erros.push('O material não pode ficar vazio.');
    }

    if (typeof this.capacidade !== 'number'
      || !Number.isFinite(this.capacidade)
      || this.capacidade <= 0) {
      erros.push('A capacidade deve ser um número maior que zero.');
    }

    return erros;
  }
}
