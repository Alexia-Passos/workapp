const db = require('../database/models');

const workController = {
  getWorks: async (req, res) => {
    try {
      let works = await db.Work.findAll({
        include: [{
          model: db.User,
          as: 'user',
          required: true
        },
        {
          model: db.Category,
          as: 'category',
          required: true
        },
        {
          model: db.Like,
          as: 'like',
          required: true
        }]
      });
      res.send(works);
    } catch (error) {
      console.log(`Error: ${error}`)
    }
  },

  getById: async (req, res) => {
    try {
      const { id } = req.query;
      let work = await db.Work.findOne({ 
        include: [{
          model: db.User,
          as: 'user',
          required: true
        },
        {
          model: db.Category,
          as: 'category',
          required: true
        },
        {
          model: db.Like,
          as: 'like',
          required: true
        }],
        where: { id } 
      });
      if (work) {
        res.json(work);
      } else {
        res.status(404);
        res.json('Trabalho não encontrado!');
      }
    } catch (error) {
      console.log(`Error: ${error}`)
    }
  },

  createWork: async (req, res) => {
    const { workName, description, status, userId, categoryId, likeAccount, 
            photo1, photo2, photo3, photo4, photo5} = req.body;
    try {

      const work = await db.Work.create({
        workName,
        description,
        status,
        userId,
        categoryId
      });

      const like = await db.Like.create({
        likeAccount
      });

      const photo = await db.Photo.create({
        photo1,
        photo2,
        photo3,
        photo4,
        photo5
      });

      await photo.setWork(work);
      await work.setPhoto(photo);

      await like.setWork(work);
      await work.setLike(like);
      res.status(201);
      res.json(work);
    } catch (error) {
      res.status(500);
      console.log(error);
      res.json('Não foi possível criar o trabalho :/');
    }
  },

  alterWork: async (req, res) => {
    try {
      const { id } = req.query;
      const work = await db.Work.findOne({ where: { id } });
      if (work) {
        const { workName, description, status, 
          photo1, photo2, photo3, photo4, photo5 } = req.body;
        await db.Work.update(
          { workName, description, status },
          { where: { id } }
        );
        await db.Photo.update(
          { photo1, photo2, photo3, photo4, photo5 },
          { where: { id } }
        );
        res.json({ status: '200', message: 'Trabalho atualizado com sucesso!' });
      } else {
        res.json({ status: '404', message: 'Trabalho não encontrado!' });
      }
    } catch (error) {
      res.status(500);
      res.json('Não foi possível atualizar o trabalho :/');
    }
  },

  deleteWork: async (req, res) => {
    const { id } = req.query;

    // Excluir da tabela Work
    try {
      const work = await db.Work.findOne({ where: { id } });
      if (work) {
        await db.Work.destroy({ where: { id } });
        res.json({ status: '200', message: 'Trabalho deletado com sucesso!' });
      } else {
        res.status(404);
        res.json('Trabalho não encontrado!');
      }
    } catch (error) {
      res.status(500);
      res.json('Não foi possível deletar o trabalho :/');
    }

    // Excluir da tabela like
    try {
      const like = await db.Like.findOne({ where: { id } });
      if (like) {
        await db.Like.destroy({ where: { id } });
        res.json({ status: '200', message: 'Likes deletado com sucesso!' });
      } else {
        res.status(404);
        res.json('Likes não encontrado!');
      }
    } catch (error) {
      res.status(500);
      res.json('Não foi possível deletar os seus likes cadastrados :/');
    }

    // Excluir da tabela photo
    try {
      const photo = await db.Photo.findOne({ where: { id } });
      if (photo) {
        await db.Photo.destroy({ where: { id } });
        res.json({ status: '200', message: 'Fotos deletado com sucesso!' });
      } else {
        res.status(404);
        res.json('Fotos não foram encontrados!');
      }
    } catch (error) {
      res.status(500);
      res.json('Não foi possível deletar suas fotos cadastradas :/');
    }
  }
};

module.exports = workController;
