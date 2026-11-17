import 'dotenv/config';
import express from 'express';
import embalagemRoutes from './routes/embalagemRoutes.js';
import maquinaRoutes from './routes/maquinaRoutes.js';
import operadorRoutes from './routes/operadorRoutes.js';

const app = express();

app.use(express.json());
app.use('/embalagens', embalagemRoutes);
app.use('/maquinas', maquinaRoutes);
app.use('/operadores', operadorRoutes);

app.use((req, res) => {
  res.status(404).json({ mensagem: 'Rota não encontrada.' });
});

app.use((erro, req, res, next) => {
  console.error(erro);
  const status = erro.status === 400 ? 400 : 500;
  return res.status(status).json({
    mensagem: status === 400 ? 'Requisição JSON inválida.' : 'Erro interno do servidor.'
  });
});

const porta = Number(process.env.PORT || 3000);
app.listen(porta, () => {
  console.log(`API de controle de embalagens disponível na porta ${porta}.`);
});

export default app;
