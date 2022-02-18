const config = require("config.json");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("_helpers/db");
const { param } = require("./users.controller");
const nodemailer = require("nodemailer");

module.exports = {
  authenticate,
  getAll,
  getById,
  create,
  update,
  delete: _delete,
  sendValidationEmail

};

async function authenticate({ username, password }) {
  let user = await db.User.scope("withHash").findOne({
    where: { username: username },
  });

  if (!user) {
    user = await db.User.scope("withHash").findOne({
      where: { email: username },
    });
  }


  if (!user || !(await bcrypt.compare(password, user.hash)))
    throw "Username or password is incorrect";

  if(user.ativo == false){
    throw "Utilizador inativo";
  }
  // authentication successful
  const token = jwt.sign({ sub: user.id }, config.secret, { expiresIn: "7d" });
  return { ...omitHash(user.get()), token };
}

async function getAll() {
  return await db.User.findAll();
}

async function getById(id) {
  return await getUser(id);
}

async function create(params) {
  // validate
  if (await db.User.findOne({ where: { username: params.username } })) {
    throw 'Username "' + params.username + '" já existe';
  }

  if (await db.User.findOne({ where: { email: params.email } })) {
    throw 'Email "' + params.email + '" já existe';
  }

  if (params.password.length < 7) {
    throw (
      'Password "' + params.email + '" demasiado pequena (mínimo 8 digitos)'
    );
  }
  // hash password
  if (params.password) {
    params.hash = await bcrypt.hash(params.password, 10);
  }

  // save user
  await db.User.create(params);
}

async function ativarConta(id){
  const user = await getUser(id);

   // validate
   const usernameChanged = params.username && user.username !== params.username;
   if (
     usernameChanged &&
     (await db.User.findOne({ where: { username: params.username } }))
   ) {
     throw 'Username "' + params.username + '" já existe';
   }
 
   const emailChanged = params.email && user.email !== params.email;
   if (
     emailChanged &&
     (await db.User.findOne({ where: { email: params.email } }))
   ) {
     throw 'Email "' + params.username + '" já existe';
   }
 
   // hash password if it was entered
   if (params.password) {
     params.hash = await bcrypt.hash(params.password, 10);
   }

   params.ativo = true;
 
   // copy params to user and save
   Object.assign(user, params);
   await user.save();
 
   return omitHash(user.get());

}
async function update(id, params) {
  const user = await getUser(id);

  // validate
  const usernameChanged = params.username && user.username !== params.username;
  if (
    usernameChanged &&
    (await db.User.findOne({ where: { username: params.username } }))
  ) {
    throw 'Username "' + params.username + '" já existe';
  }

  const emailChanged = params.email && user.email !== params.email;
  if (
    emailChanged &&
    (await db.User.findOne({ where: { email: params.email } }))
  ) {
    throw 'Email "' + params.username + '" já existe';
  }

  // hash password if it was entered
  if (params.password) {
    params.hash = await bcrypt.hash(params.password, 10);
  }

  // copy params to user and save
  Object.assign(user, params);
  await user.save();

  return omitHash(user.get());
}

async function _delete(id) {
  const user = await getUser(id);
  await user.destroy();
}

// helper functions

async function getUser(id) {
  const user = await db.User.findByPk(id);
  if (!user) throw "User não encontrado";
  return user;
}

function omitHash(user) {
  const { hash, ...userWithoutHash } = user;
  return userWithoutHash;
}

async function sendValidationEmail(recetor) {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "noreply.deilounge@gmail.com",
      pass: "guibfd10",
    },
  });

  var mailOptions = {
    from: "noreply.deilounge@gmail.com",
    to: recetor,
    subject: "Validar conta",
    text: "Email para validar email no dei lounge",
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
 
}
