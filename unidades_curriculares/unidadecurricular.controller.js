const express = require('express');
const res = require('express/lib/response');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const ucService = require('./unidadecurricular.service');

// routes
router.post('/registarUC', registarUCSchema, register);
router.get('/', getAll);
router.get('/:id', getById);
router.put('/:id', updateSchema, update);
router.delete('/:id', _delete);

module.exports = router;


function registarUCSchema(req, res, next) {
    const schema = Joi.object({
        nome: Joi.string().required(),
        abreviacao: Joi.string().required(),
        ano: Joi.string().required(),
        curso: Joi.string().required()
    });
    validateRequest(req, next, schema);
}

function register(req, res, next) {
    ucService.create(req.body)
        .then(() => res.json({ message: 'Registration successful' }))
        .catch(next);
}

function getAll(req, res, next) {
    ucService.getAll()
        .then(ucs => res.json(ucs))
        .catch(next);
}

function getById(req, res, next) {
    ucService.getById(req.params.id)
        .then(uc => res.json(uc))
        .catch(next);
}


function updateSchema(req, res, next) {
    const schema = Joi.object({
        nome: Joi.string().empty(''),
        abreviacao: Joi.string().empty(''),
        ano: Joi.string().empty(''),
        curso: Joi.string().empty('')
    });
    validateRequest(req, next, schema);
}

function update(req, res, next) {
    ucService.update(req.params.id, req.body)
        .then(uc => res.json(uc))
        .catch(next);
}

function _delete(req, res, next) {
    ucService.delete(req.params.id)
        .then(() => res.json({ message: 'UC deleted successfully' }))
        .catch(next);
}