import conexao from '../database/conexao.js';

const colunasPermitidas = new Set(['nome', 'patrimonio', 'status']);

export async function criarMaquina(maquina) {
  const [resultado] = await conexao.execute(
    'INSERT INTO maquina (nome, patrimonio, status) VALUES (?, ?, ?)',
    [maquina.nome, maquina.patrimonio, maquina.status]
  );
  return buscarMaquinaPorId(resultado.insertId);
}

export async function listarMaquinas() {
  const [linhas] = await conexao.execute(
    'SELECT id_maquina, nome, patrimonio, status FROM maquina ORDER BY id_maquina'
  );
  return linhas;
}

export async function buscarMaquinaPorId(id) {
  const [linhas] = await conexao.execute(
    'SELECT id_maquina, nome, patrimonio, status FROM maquina WHERE id_maquina = ?',
    [id]
  );
  return linhas[0] || null;
}

export async function atualizarMaquina(id, dados) {
  const campos = Object.keys(dados).filter((campo) => colunasPermitidas.has(campo));
  if (campos.length === 0) return;

  const clausula = campos.map((campo) => `${campo} = ?`).join(', ');
  await conexao.execute(
    `UPDATE maquina SET ${clausula} WHERE id_maquina = ?`,
    [...campos.map((campo) => dados[campo]), id]
  );
}

export async function excluirMaquina(id) {
  await conexao.execute('DELETE FROM maquina WHERE id_maquina = ?', [id]);
}
