import { Router } from 'express';
import {
  atualizarMaquinaParcialmente,
  buscarMaquina,
  cadastrarMaquina,
  excluirMaquinaPorId,
  listarTodasMaquinas
} from '../controller/maquinaController.js';

const router = Router();

router.post('/', cadastrarMaquina);
router.get('/', listarTodasMaquinas);
router.get('/:id', buscarMaquina);
router.patch('/:id', atualizarMaquinaParcialmente);
router.delete('/:id', excluirMaquinaPorId);

export default router;
