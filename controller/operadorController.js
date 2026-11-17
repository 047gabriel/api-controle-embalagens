import Operador from '../model/Operador.js';
import { validarId } from '../model/validarId.js';
import {
  atualizarOperador,
  buscarOperadorPorId,
  criarOperador,
  excluirOperador,
  listarOperadores
} from '../repository/operadorRepository.js';

const camposPermitidos = ['nome', 'matricula', 'turno'];

function corpoValido(body) {
  return body !== null && typeof body === 'object' && !Array.isArray(body);
}

function erroInterno(res, erro) {
  console.error(erro);
  return res.status(500).json({ mensagem: 'Erro interno ao acessar os dados dos operadores.' });
}

export async function cadastrarOperador(req, res) {
  try {
    if (!corpoValido(req.body) || Object.keys(req.body).some((campo) => !camposPermitidos.includes(campo))) {
      return res.status(400).json({ mensagem: 'Envie somente nome, matricula e turno.' });
    }

    const operador = new Operador(req.body);
    const erros = operador.validar();
    if (erros.length) return res.status(400).json({ mensagem: 'Dados inválidos.', erros });

    const criado = await criarOperador(operador);
    return res.status(201).json({ mensagem: 'Operador cadastrado com sucesso.', operador: criado });
  } catch (erro) {
    return erroInterno(res, erro);
  }
}

export async function listarTodosOperadores(req, res) {
  try {
    const operadores = await listarOperadores();
    return res.status(200).json({ operadores });
  } catch (erro) {
    return erroInterno(res, erro);
  }
}

export async function buscarOperador(req, res) {
  try {
    if (!validarId(req.params.id)) return res.status(400).json({ mensagem: 'O ID deve ser um inteiro positivo.' });

    const operador = await buscarOperadorPorId(Number(req.params.id));
    if (!operador) return res.status(404).json({ mensagem: 'Operador não encontrado.' });
    return res.status(200).json({ operador });
  } catch (erro) {
    return erroInterno(res, erro);
  }
}

export async function atualizarOperadorParcialmente(req, res) {
  try {
    if (!validarId(req.params.id)) return res.status(400).json({ mensagem: 'O ID deve ser um inteiro positivo.' });
    if (!corpoValido(req.body)
      || Object.keys(req.body).length === 0
      || Object.keys(req.body).some((campo) => !camposPermitidos.includes(campo))) {
      return res.status(400).json({ mensagem: 'Envie ao menos um campo válido: nome, matricula ou turno.' });
    }

    const id = Number(req.params.id);
    const existente = await buscarOperadorPorId(id);
    if (!existente) return res.status(404).json({ mensagem: 'Operador não encontrado.' });

    const erros = new Operador({ ...existente, ...req.body }).validar();
    if (erros.length) return res.status(400).json({ mensagem: 'Dados inválidos.', erros });

    await atualizarOperador(id, req.body);
    const atualizado = await buscarOperadorPorId(id);
    return res.status(200).json({ mensagem: 'Operador atualizado com sucesso.', operador: atualizado });
  } catch (erro) {
    return erroInterno(res, erro);
  }
}

export async function excluirOperadorPorId(req, res) {
  try {
    if (!validarId(req.params.id)) return res.status(400).json({ mensagem: 'O ID deve ser um inteiro positivo.' });

    const id = Number(req.params.id);
    const existente = await buscarOperadorPorId(id);
    if (!existente) return res.status(404).json({ mensagem: 'Operador não encontrado.' });

    await excluirOperador(id);
    return res.status(200).json({ mensagem: 'Operador excluído com sucesso.' });
  } catch (erro) {
    return erroInterno(res, erro);
  }
}
