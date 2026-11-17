import { Router } from 'express';
import {
  atualizarOperadorParcialmente,
  buscarOperador,
  cadastrarOperador,
  excluirOperadorPorId,
  listarTodosOperadores
} from '../controller/operadorController.js';

const router = Router();

router.post('/', cadastrarOperador);
router.get('/', listarTodosOperadores);
router.get('/:id', buscarOperador);
router.patch('/:id', atualizarOperadorParcialmente);
router.delete('/:id', excluirOperadorPorId);

export default router;
