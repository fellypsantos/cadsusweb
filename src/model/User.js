// nome, dataNascimento, sexo, numeroCns, municipioNascimento, nomeMae, nomePai

const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
  numeroCns: {
    type: String,
    require: true
  },
  cpf: {
    type: String,
    require: false
  },
  nome: {
    type: String,
    require: true
  },
  dataNascimento: {
    type: String,
    require: true
  },
  sexo: {
    type: String,
    require: true
  },
  municipioNascimento: {
    type: String,
    require: true
  },
  municipioNascimentoCodigo: {
    type: String,
    require: true
  },
  nomeMae: {
    type: String,
    require: false
  },
  nomePai: {
    type: String,
    require: false
  },
  createdAt: {
    type: Date,
    default: new Date()
  }
});

mongoose.model("User", UserSchema);
