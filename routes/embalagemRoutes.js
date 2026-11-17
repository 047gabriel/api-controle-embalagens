import { Router } from 'express';
import {
  atualizarEmbalagemParcialmente,
  buscarEmbalagem,
  cadastrarEmbalagem,
  excluirEmbalagemPorId,
  listarTodasEmbalagens
} from '../controller/embalagemController.js';

const router = Router();

router.post('/', cadastrarEmbalagem);
router.get('/', listarTodasEmbalagens);
router.get('/:id', buscarEmbalagem);
router.patch('/:id', atualizarEmbalagemParcialmente);
router.delete('/:id', excluirEmbalagemPorId);

export default router;
