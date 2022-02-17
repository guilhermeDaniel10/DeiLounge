const config = require("config.json");
const bcrypt = require("bcryptjs");
const db = require("_helpers/db");
const { param } = require("./curso.controller");

module.exports = {
  getAll,
  getById,
  getCursoPorAbreviacao,
  create,
  update,
  delete: _delete,
};

async function getAll() {
  return await db.Curso.findAll();
}

async function getById(id) {
  return await getCurso(id);
}

async function create(params) {
  // validate
  if (await db.Curso.findOne({ where: { nome: params.nome } })) {
    throw 'Nome "' + params.username + '" is already taken';
  }

  if (await db.Curso.findOne({ where: { abreviacao: params.abreviacao } })) {
    throw 'Abreviacao "' + params.email + '" is already taken';
  }

  // save curso
  await db.Curso.create(params);
}

async function update(id, params) {
  const curso = await getCurso(id);

  // validate
  const nomeChanged = params.nome && curso.nome !== params.nome;
  if (
    nomeChanged &&
    (await db.Curso.findOne({ where: { nome: params.nome } }))
  ) {
    throw 'Nome "' + params.nome + '" is already taken';
  }


  const abreviacaoChanged =
    params.abreviacao && curso.abreviacao !== params.abreviacao;
  if (
    abreviacaoChanged &&
    (await db.Curso.findOne({ where: { abreviacao: params.abreviacao } }))
  ) {
    throw 'Abreviacao "' + params.curso + '" is already taken';
  }

  // copy params to curso and save
  Object.assign(curso, params);
  await curso.save();
  

  return curso.get();
}

async function _delete(id) {
  const curso = await getCurso(id);
  await curso.destroy();
}

// helper functions
async function getCurso(id) {
  const curso = await db.Curso.findByPk(id);
  if (!curso) throw "Curso not found";
  return curso;
}

async function getCursoPorAbreviacao(abreviacao) {
  const curso = await db.Curso.findOne({ where: { abreviacao: abreviacao } });
  if (!curso) throw "Curso not found";
  return curso;
}
