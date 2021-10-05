const express = require('express');
const app = express();
require('dotenv').config();
const models = require('./database/models');
const routerUsers = require('./routes/userRouter');
const routerWorks = require('./routes/workRouter');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const connect = async () => {
  try {
    await models.sequelize.authenticate();
    console.log('Conexão estabelecida com sucesso. 🚀');
  } catch (error) {
    console.error('❌ Conexão não estabelecida com a database:', error);
  }
}

connect();

app.get('/', (req, res) => {
  res.send('Digital House')
})

app.use('/users', routerUsers);
app.use('/works', routerWorks);

app.listen(process.env.PORT, () => console.log(`Servidor rodando na porta: ${process.env.PORT}`));
