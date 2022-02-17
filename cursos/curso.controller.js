const express = require('express');
const res = require('express/lib/response');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const cursoService = require('./curso.service');

// routes
router.post('/registarCurso', registarCursoSchema, register);
router.get('/', getAll);
router.get('/:id', getById);
router.put('/:id', updateSchema, update);
router.delete('/:id', _delete);
router.get('/abreviacao/:abreviacao', getByAbreviacao);

module.exports = router;


function registarCursoSchema(req, res, next) {
    const schema = Joi.object({
        nome: Joi.string().required(),
        abreviacao: Joi.string().required()
    });
    validateRequest(req, next, schema);
}

function register(req, res, next) {
    cursoService.create(req.body)
        .then(() => res.json({ message: 'Registration successful' }))
        .catch(next);
}

function getAll(req, res, next) {
    cursoService.getAll()
        .then(cursos => res.json(cursos))
        .catch(next);
}

function getById(req, res, next) {
    cursoService.getById(req.params.id)
        .then(curso => res.json(curso))
        .catch(next);
}

function getByAbreviacao(req, res, next) {
    cursoService.getCursoPorAbreviacao(req.params.abreviacao)
    .then(curso => res.json(curso))
    .catch(next);
}

function updateSchema(req, res, next) {
    const schema = Joi.object({
        nome: Joi.string().empty(''),
        abreviacao: Joi.string().empty('')
    });
    validateRequest(req, next, schema);
}

function update(req, res, next) {
    cursoService.update(req.params.id, req.body)
        .then(curso => res.json(curso))
        .catch(next);
}

function _delete(req, res, next) {
    cursoService.delete(req.params.id)
        .then(() => res.json({ message: 'Curso deleted successfully' }))
        .catch(next);
}