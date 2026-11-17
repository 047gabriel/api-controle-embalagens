import Maquina from '../model/Maquina.js';
import { validarId } from '../model/validarId.js';
import {
  atualizarMaquina,
  buscarMaquinaPorId,
  criarMaquina,
  excluirMaquina,
  listarMaquinas
} from '../repository/maquinaRepository.js';

const camposPermitidos = ['nome', 'patrimonio', 'status'];

function corpoValido(body) {
  return body !== null && typeof body === 'object' && !Array.isArray(body);
}

function erroInterno(res, erro) {
  console.error(erro);
  return res.status(500).json({ mensagem: 'Erro interno ao acessar os dados das máquinas.' });
}

export async function cadastrarMaquina(req, res) {
  try {
    if (!corpoValido(req.body) || Object.keys(req.body).some((campo) => !camposPermitidos.includes(campo))) {
      return res.status(400).json({ mensagem: 'Envie somente nome, patrimonio e status.' });
    }

    const maquina = new Maquina(req.body);
    const erros = maquina.validar();
    if (erros.length) return res.status(400).json({ mensagem: 'Dados inválidos.', erros });

    const criada = await criarMaquina(maquina);
    return res.status(201).json({ mensagem: 'Máquina cadastrada com sucesso.', maquina: criada });
  } catch (erro) {
    return erroInterno(res, erro);
  }
}

export async function listarTodasMaquinas(req, res) {
  try {
    const maquinas = await listarMaquinas();
    return res.status(200).json({ maquinas });
  } catch (erro) {
    return erroInterno(res, erro);
  }
}

export async function buscarMaquina(req, res) {
  try {
    if (!validarId(req.params.id)) return res.status(400).json({ mensagem: 'O ID deve ser um inteiro positivo.' });

    const maquina = await buscarMaquinaPorId(Number(req.params.id));
    if (!maquina) return res.status(404).json({ mensagem: 'Máquina não encontrada.' });
    return res.status(200).json({ maquina });
  } catch (erro) {
    return erroInterno(res, erro);
  }
}

export async function atualizarMaquinaParcialmente(req, res) {
  try {
    if (!validarId(req.params.id)) return res.status(400).json({ mensagem: 'O ID deve ser um inteiro positivo.' });
    if (!corpoValido(req.body)
      || Object.keys(req.body).length === 0
      || Object.keys(req.body).some((campo) => !camposPermitidos.includes(campo))) {
      return res.status(400).json({ mensagem: 'Envie ao menos um campo válido: nome, patrimonio ou status.' });
    }

    const id = Number(req.params.id);
    const existente = await buscarMaquinaPorId(id);
    if (!existente) return res.status(404).json({ mensagem: 'Máquina não encontrada.' });

    const erros = new Maquina({ ...existente, ...req.body }).validar();
    if (erros.length) return res.status(400).json({ mensagem: 'Dados inválidos.', erros });

    await atualizarMaquina(id, req.body);
    const atualizada = await buscarMaquinaPorId(id);
    return res.status(200).json({ mensagem: 'Máquina atualizada com sucesso.', maquina: atualizada });
  } catch (erro) {
    return erroInterno(res, erro);
  }
}

export async function excluirMaquinaPorId(req, res) {
  try {
    if (!validarId(req.params.id)) return res.status(400).json({ mensagem: 'O ID deve ser um inteiro positivo.' });

    const id = Number(req.params.id);
    const existente = await buscarMaquinaPorId(id);
    if (!existente) return res.status(404).json({ mensagem: 'Máquina não encontrada.' });

    await excluirMaquina(id);
    return res.status(200).json({ mensagem: 'Máquina excluída com sucesso.' });
  } catch (erro) {
    return erroInterno(res, erro);
  }
}
