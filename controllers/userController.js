const db = require('../database/models');
const bcrypt = require('bcryptjs');

const userController = {
  getUsers: async (req, res) => {
    try {
      let users = await db.User.findAll({
        include: {
          model: db.Address,
          as: 'address',
          required: true
        }
      });
      res.send(users);
    } catch (error) {
      console.log(`Error: ${error}`)
    }
  },

  getById: async (req, res) => {
    try {
      const { id } = req.params;
      let user = await db.User.findOne({
        include: {
          model: db.Address,
          as: 'address',
          required: true
        }, where: { id } });
        
      if (user) {
        res.json(user);
      } else {
        res.status(404);
        res.json('Usuário não encontrado');
      }
    } catch (error) {
      console.log(`Error: ${error}`)
    }
  },

  createUser: async (req, res) => {
    const { firstName, lastName, cpf, whatsapp, instagram, facebook, profile, email, password, cep, city, uf } = req.body;
    let encryptedPassword = bcrypt.hashSync(password, 10);
    try {

      const user = await db.User.create({
        firstName,
        lastName,
        cpf,
        whatsapp,
        instagram,
        facebook,
        profile,
        email,
        password: encryptedPassword
      });

      const address = await db.Address.create({
        cep,
        city,
        uf
      });

      await address.setUser(user);
      await user.setAddress(address);
      res.status(201);
      res.json(user);
    } catch (error) {
      res.status(500);
      console.log(error);
      res.json('Não foi possível criar o usuário');
    }
  },

  alterUser: async (req, res) => {
    try {
      const { id } = req.params;
      const user = await db.User.findOne({ where: { id } });
      if (user) {
        const { firstName, lastName, cpf, whatsapp, instagram, facebook, profile, email, cep, city, uf } = req.body;
        await db.User.update(
          { firstName, lastName, cpf, whatsapp, instagram, facebook, profile, email, cep, city, uf },
          { where: { id } }
        );
        res.json({ status: '200', message: 'Usuário atualizado com sucesso' });
      } else {
        res.json({ status: '404', message: 'Usuário não encontrado' });
      }
    } catch (error) {
      res.status(500);
      res.json('Não foi possível atualizar o usuário');
    }
  },

  deleteUser: async (req, res) => {
    const { id } = req.params;

    //Excluir da tabela 'Users'
    try {
      const user = await db.User.findOne({ where: { id } });
      if (user) {
        await db.User.destroy({ where: { id } });
        res.json({ status: '200', message: 'Usuário deletado com sucesso!' });
      } else {
        res.status(404);
        res.json('Usuário não encontrado!');
      }
    } catch (error) {
      res.status(500);
      res.json('Não foi possível deletar o usuário!');
    }

    // Excluir da tabela 'Address'
    try {
      const address = await db.Address.findOne({ where: { id } });
      if (address) {
        await db.Address.destroy({ where: { id } });
        res.json({ status: '200', message: 'Dados de endereço foram deletados com sucesso!' });
      } else {
        res.status(404);
        res.json('Dados de endereço não encontrados!');
      }
    } catch (error) {
      res.status(500);
      res.json('Não foi possível deletar os dados de seu endereço cadastrados!');
    }
  }
};

module.exports = userController;