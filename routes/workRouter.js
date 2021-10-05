const { Router } = require('express');
const router = Router();
const workController = require('../controllers/workController');

//Por default as rotas já estão definidas como 'http://localhost:3000/works'
router.get('/', workController.getWorks); //Buscar todos os trabalhos
router.get('/:id', workController.getById); //Busca por um trabalho
router.post('/registration', workController.createWork); //Cria um novo trabalho
router.put('/change/:id', workController.alterWork); //Alterar dados do trabalho
router.delete('/delete/:id', workController.deleteWork); //deleta um trabalho

module.exports = router;