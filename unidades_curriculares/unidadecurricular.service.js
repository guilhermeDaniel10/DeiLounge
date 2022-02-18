const config = require("config.json");
const bcrypt = require("bcryptjs");
const db = require("_helpers/db");
const { param } = require("./unidadecurricular.controller");

module.exports = {
  getAll,
  getById,
  create,
  update,
  delete: _delete,
};

async function getAll() {
  return await db.UnidadeCurricular.findAll();
}

async function getById(id) {
  return await getUnidadeCurricular(id);
}

async function create(params) {
  // validate
  if (await db.UnidadeCurricular.findOne({ where: { nome: params.nome } })) {
    throw 'Nome "' + params.nome + '" is already taken';
  }

  if (await db.UnidadeCurricular.findOne({ where: { abreviacao: params.abreviacao } })) {
    throw 'Abreviacao "' + params.abreviacao + '" is already taken';
  }

  const curso = await db.Curso.findOne({ where : { abreviacao : params.curso}});

  if(!curso){
    throw 'Abreviacao "' + params.curso + '" inexistente.';
  } 


  params.curso = curso.id;

  // save curso
  await db.UnidadeCurricular.create(params);
}

async function update(id, params) {
  const uc = await getUC(id);

 
  // validate
  const nomeChanged = params.nome && curso.nome !== params.nome;
  if (
    nomeChanged &&
    (await db.UnidadeCurricular.findOne({ where: { nome: params.nome } }))
  ) {
    throw 'Nome "' + params.nome + '" is already taken';
  }


  const abreviacaoChanged =
    params.abreviacao && curso.abreviacao !== params.abreviacao;
  if (
    abreviacaoChanged &&
    (await db.UnidadeCurricular.findOne({ where: { abreviacao: params.abreviacao } }))
  ) {
    throw 'Abreviacao "' + params.curso + '" is already taken';
  }

  const curso = await db.Curso.findOne({ where : { abreviacao : params.curso}});

  if(!curso){
    throw 'Abreviacao "' + params.curso + '" inexistente.';
  } 


  // copy params to curso and save
  Object.assign(uc, params);
  await uc.save();
  

  return uc.get();
}

async function _delete(id) {
  const uc = await getUC(id);
  await uc.destroy();
}

// helper functions
async function getUC(id) {
  const uc = await db.UnidadeCurricular.findByPk(id);
  if (!uc) throw "UC not found";
  return uc;
}



