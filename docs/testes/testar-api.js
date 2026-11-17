import assert from 'node:assert/strict';

const baseUrl = (process.env.API_BASE_URL || 'http://localhost:3000').replace(/\/+$/, '');
const criados = {
  embalagens: [],
  maquinas: [],
  operadores: []
};

async function requisitar(caminho, metodo = 'GET', corpo) {
  const resposta = await fetch(`${baseUrl}${caminho}`, {
    method: metodo,
    headers: corpo === undefined ? {} : { 'Content-Type': 'application/json' },
    body: corpo === undefined ? undefined : JSON.stringify(corpo)
  });
  const texto = await resposta.text();
  let dados = {};
  if (texto) {
    try {
      dados = JSON.parse(texto);
    } catch {
      throw new Error(`${metodo} ${caminho} não retornou JSON válido.`);
    }
  }
  return { status: resposta.status, dados };
}

async function esperarStatus(caminho, metodo, corpo, status) {
  const resposta = await requisitar(caminho, metodo, corpo);
  assert.equal(resposta.status, status, `${metodo} ${caminho}: esperado ${status}, recebido ${resposta.status}`);
  return resposta.dados;
}

async function testarRecurso({ caminho, propriedade, chave, payloads, alteracao, campoMantido }) {
  for (const payload of payloads) {
    const dados = await esperarStatus(`/${caminho}`, 'POST', payload, 201);
    assert.ok(dados[chave], `POST /${caminho} deve retornar ${chave}.`);
    const id = dados[chave][`id_${chave}`];
    assert.ok(id);
    criados[propriedade].push(id);
  }

  const lista = await esperarStatus(`/${caminho}`, 'GET', undefined, 200);
  assert.ok(Array.isArray(lista[propriedade]), `GET /${caminho} deve retornar uma lista.`);
  for (const id of criados[propriedade]) {
    assert.ok(
      lista[propriedade].some((registro) => Number(registro[`id_${chave}`]) === Number(id)),
      `GET /${caminho} deve incluir o registro ${id}.`
    );
  }

  const ids = criados[propriedade];
  const obtido = await esperarStatus(`/${caminho}/${ids[0]}`, 'GET', undefined, 200);
  assert.equal(obtido[chave][campoMantido], payloads[0][campoMantido]);
  await esperarStatus(`/${caminho}/4294967295`, 'GET', undefined, 404);

  await esperarStatus(`/${caminho}/${ids[0]}`, 'PATCH', alteracao, 200);
  const atualizado = await esperarStatus(`/${caminho}/${ids[0]}`, 'GET', undefined, 200);
  assert.equal(atualizado[chave][Object.keys(alteracao)[0]], Object.values(alteracao)[0]);
  assert.equal(atualizado[chave][campoMantido], payloads[0][campoMantido], 'PATCH deve preservar campos não enviados.');

  const idExcluido = ids[0];
  await esperarStatus(`/${caminho}/${idExcluido}`, 'DELETE', undefined, 200);
  ids.shift();
  await esperarStatus(`/${caminho}/${idExcluido}`, 'GET', undefined, 404);
  await esperarStatus(`/${caminho}/${idExcluido}`, 'PATCH', alteracao, 404);
  await esperarStatus(`/${caminho}/${idExcluido}`, 'DELETE', undefined, 404);
}

async function executar() {
  const marcador = Date.now();
  try {
    await testarRecurso({
      caminho: 'embalagens',
      propriedade: 'embalagens',
      chave: 'embalagem',
      campoMantido: 'material',
      alteracao: { descricao: `Caixa atualizada ${marcador}` },
      payloads: [1, 2, 3].map((numero) => ({
        descricao: `Caixa teste ${marcador}-${numero}`,
        material: `Papelão ${numero}`,
        capacidade: numero * 5
      }))
    });

    await testarRecurso({
      caminho: 'maquinas',
      propriedade: 'maquinas',
      chave: 'maquina',
      campoMantido: 'patrimonio',
      alteracao: { status: 'em manutenção' },
      payloads: [1, 2, 3].map((numero) => ({
        nome: `Máquina teste ${marcador}-${numero}`,
        patrimonio: `PAT-${marcador}-${numero}`,
        status: 'ativa'
      }))
    });

    await testarRecurso({
      caminho: 'operadores',
      propriedade: 'operadores',
      chave: 'operador',
      campoMantido: 'matricula',
      alteracao: { turno: 'noite' },
      payloads: [1, 2, 3].map((numero) => ({
        nome: `Operador teste ${marcador}-${numero}`,
        matricula: `OP-${marcador}-${numero}`,
        turno: 'manhã'
      }))
    });

    await esperarStatus('/embalagens', 'POST', {
      descricao: 'AB',
      material: 'Papelão',
      capacidade: 10
    }, 400);
    await esperarStatus('/maquinas/0', 'GET', undefined, 400);
    console.log('Testes da API concluídos com sucesso para embalagens, máquinas e operadores.');
  } finally {
    for (const [caminho, propriedade] of [
      ['embalagens', 'embalagens'],
      ['maquinas', 'maquinas'],
      ['operadores', 'operadores']
    ]) {
      for (const id of criados[propriedade]) {
        await esperarStatus(`/${caminho}/${id}`, 'DELETE', undefined, 200);
      }
    }
  }
}

executar().catch((erro) => {
  console.error('Falha nos testes da API:', erro);
  process.exitCode = 1;
});

