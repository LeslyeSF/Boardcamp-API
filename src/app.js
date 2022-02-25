import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const server = express();

server.use(cors());
server.use(express.json());

server.get('/teste', (req, res) => {
  res.send('oi');
});

server.listen(process.env.PORT, () => {
  console.log(`Running app in ${process.env.PORT}`);
});
