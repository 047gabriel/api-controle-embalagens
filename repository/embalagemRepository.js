import conexao from '../database/conexao.js';

const colunasPermitidas = new Set(['descricao', 'material', 'capacidade']);

export async function criarEmbalagem(embalagem) {
  const [resultado] = await conexao.execute(
    'INSERT INTO embalagem (descricao, material, capacidade) VALUES (?, ?, ?)',
    [embalagem.descricao, embalagem.material, embalagem.capacidade]
  );
  return buscarEmbalagemPorId(resultado.insertId);
}

export async function listarEmbalagens() {
  const [linhas] = await conexao.execute(
    'SELECT id_embalagem, descricao, material, capacidade FROM embalagem ORDER BY id_embalagem'
  );
  return linhas;
}

export async function buscarEmbalagemPorId(id) {
  const [linhas] = await conexao.execute(
    'SELECT id_embalagem, descricao, material, capacidade FROM embalagem WHERE id_embalagem = ?',
    [id]
  );
  return linhas[0] || null;
}

export async function atualizarEmbalagem(id, dados) {
  const campos = Object.keys(dados).filter((campo) => colunasPermitidas.has(campo));
  if (campos.length === 0) return;

  const clausula = campos.map((campo) => `${campo} = ?`).join(', ');
  await conexao.execute(
    `UPDATE embalagem SET ${clausula} WHERE id_embalagem = ?`,
    [...campos.map((campo) => dados[campo]), id]
  );
}

export async function excluirEmbalagem(id) {
  await conexao.execute('DELETE FROM embalagem WHERE id_embalagem = ?', [id]);
}
