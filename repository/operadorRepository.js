import conexao from '../database/conexao.js';

const colunasPermitidas = new Set(['nome', 'matricula', 'turno']);

export async function criarOperador(operador) {
  const [resultado] = await conexao.execute(
    'INSERT INTO operador (nome, matricula, turno) VALUES (?, ?, ?)',
    [operador.nome, operador.matricula, operador.turno]
  );
  return buscarOperadorPorId(resultado.insertId);
}

export async function listarOperadores() {
  const [linhas] = await conexao.execute(
    'SELECT id_operador, nome, matricula, turno FROM operador ORDER BY id_operador'
  );
  return linhas;
}

export async function buscarOperadorPorId(id) {
  const [linhas] = await conexao.execute(
    'SELECT id_operador, nome, matricula, turno FROM operador WHERE id_operador = ?',
    [id]
  );
  return linhas[0] || null;
}

export async function atualizarOperador(id, dados) {
  const campos = Object.keys(dados).filter((campo) => colunasPermitidas.has(campo));
  if (campos.length === 0) return;

  const clausula = campos.map((campo) => `${campo} = ?`).join(', ');
  await conexao.execute(
    `UPDATE operador SET ${clausula} WHERE id_operador = ?`,
    [...campos.map((campo) => dados[campo]), id]
  );
}

export async function excluirOperador(id) {
  await conexao.execute('DELETE FROM operador WHERE id_operador = ?', [id]);
}
