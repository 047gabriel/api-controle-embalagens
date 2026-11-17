import Embalagem from '../model/Embalagem.js';
import { validarId } from '../model/validarId.js';
import {
  atualizarEmbalagem,
  buscarEmbalagemPorId,
  criarEmbalagem,
  excluirEmbalagem,
  listarEmbalagens
} from '../repository/embalagemRepository.js';

const camposPermitidos = ['descricao', 'material', 'capacidade'];

function corpoValido(body) {
  return body !== null && typeof body === 'object' && !Array.isArray(body);
}

function erroInterno(res, erro) {
  console.error(erro);
  return res.status(500).json({ mensagem: 'Erro interno ao acessar os dados das embalagens.' });
}

export async function cadastrarEmbalagem(req, res) {
  try {
    if (!corpoValido(req.body) || Object.keys(req.body).some((campo) => !camposPermitidos.includes(campo))) {
      return res.status(400).json({ mensagem: 'Envie somente descricao, material e capacidade.' });
    }

    const embalagem = new Embalagem(req.body);
    const erros = embalagem.validar();
    if (erros.length) return res.status(400).json({ mensagem: 'Dados inválidos.', erros });

    const criada = await criarEmbalagem(embalagem);
    return res.status(201).json({ mensagem: 'Embalagem cadastrada com sucesso.', embalagem: criada });
  } catch (erro) {
    return erroInterno(res, erro);
  }
}

export async function listarTodasEmbalagens(req, res) {
  try {
    const embalagens = await listarEmbalagens();
    return res.status(200).json({ embalagens });
  } catch (erro) {
    return erroInterno(res, erro);
  }
}

export async function buscarEmbalagem(req, res) {
  try {
    if (!validarId(req.params.id)) return res.status(400).json({ mensagem: 'O ID deve ser um inteiro positivo.' });

    const embalagem = await buscarEmbalagemPorId(Number(req.params.id));
    if (!embalagem) return res.status(404).json({ mensagem: 'Embalagem não encontrada.' });
    return res.status(200).json({ embalagem });
  } catch (erro) {
    return erroInterno(res, erro);
  }
}

export async function atualizarEmbalagemParcialmente(req, res) {
  try {
    if (!validarId(req.params.id)) return res.status(400).json({ mensagem: 'O ID deve ser um inteiro positivo.' });
    if (!corpoValido(req.body)
      || Object.keys(req.body).length === 0
      || Object.keys(req.body).some((campo) => !camposPermitidos.includes(campo))) {
      return res.status(400).json({ mensagem: 'Envie ao menos um campo válido: descricao, material ou capacidade.' });
    }

    const id = Number(req.params.id);
    const existente = await buscarEmbalagemPorId(id);
    if (!existente) return res.status(404).json({ mensagem: 'Embalagem não encontrada.' });

    const erros = new Embalagem({ ...existente, ...req.body }).validar();
    if (erros.length) return res.status(400).json({ mensagem: 'Dados inválidos.', erros });

    await atualizarEmbalagem(id, req.body);
    const atualizada = await buscarEmbalagemPorId(id);
    return res.status(200).json({ mensagem: 'Embalagem atualizada com sucesso.', embalagem: atualizada });
  } catch (erro) {
    return erroInterno(res, erro);
  }
}

export async function excluirEmbalagemPorId(req, res) {
  try {
    if (!validarId(req.params.id)) return res.status(400).json({ mensagem: 'O ID deve ser um inteiro positivo.' });

    const id = Number(req.params.id);
    const existente = await buscarEmbalagemPorId(id);
    if (!existente) return res.status(404).json({ mensagem: 'Embalagem não encontrada.' });

    await excluirEmbalagem(id);
    return res.status(200).json({ mensagem: 'Embalagem excluída com sucesso.' });
  } catch (erro) {
    return erroInterno(res, erro);
  }
}
