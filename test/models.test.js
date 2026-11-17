import test from 'node:test';
import assert from 'node:assert/strict';
import Embalagem from '../model/Embalagem.js';
import Maquina from '../model/Maquina.js';
import Operador from '../model/Operador.js';
import { validarId } from '../model/validarId.js';

test('Embalagem valida descrição, material e capacidade', () => {
  assert.deepEqual(new Embalagem({
    descricao: 'Caixa grande',
    material: 'Papelão',
    capacidade: 12.5
  }).validar(), []);

  assert.equal(new Embalagem({
    descricao: 'Ab',
    material: 'Papelão',
    capacidade: 12
  }).validar().length, 1);
  assert.ok(new Embalagem({
    descricao: 'Caixa grande',
    material: ' ',
    capacidade: 12
  }).validar().some((erro) => erro.includes('material')));
  assert.ok(new Embalagem({
    descricao: 'Caixa grande',
    material: 'Papelão',
    capacidade: 0
  }).validar().some((erro) => erro.includes('capacidade')));
  assert.ok(new Embalagem({
    descricao: 'Caixa grande',
    material: 'Papelão',
    capacidade: '12'
  }).validar().some((erro) => erro.includes('capacidade')));
});

test('Máquina e Operador validam seus campos obrigatórios', () => {
  assert.deepEqual(new Maquina({
    nome: 'Esteira',
    patrimonio: 'M-10',
    status: 'ativa'
  }).validar(), []);
  assert.ok(new Maquina({ nome: 'AB', patrimonio: '', status: '' }).validar().length > 0);

  assert.deepEqual(new Operador({
    nome: 'João Silva',
    matricula: 'OP-1',
    turno: 'noite'
  }).validar(), []);
  assert.ok(new Operador({ nome: 'AB', matricula: '', turno: '' }).validar().length > 0);
});

test('ID aceita apenas inteiros positivos com representação decimal simples', () => {
  assert.equal(validarId('1'), true);
  assert.equal(validarId('0'), false);
  assert.equal(validarId('-1'), false);
  assert.equal(validarId('1.5'), false);
  assert.equal(validarId('1e2'), false);
  assert.equal(validarId('9007199254740992'), false);
});

