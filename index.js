const express = require("express");
const nunjucks = require("nunjucks");
const mongoose = require("mongoose");
const cors = require("cors");
const api = express();
const args = process.argv;
const argMongoDBIndex = args.indexOf('--mongodb');
const mongodbServer = (argMongoDBIndex > -1) ? args[argMongoDBIndex+1] : 'localhost';

nunjucks.configure("views", {
  autoescape: true,
  express: api,
  watch: true
});

mongoose.connect(`mongodb://${ mongodbServer }:27017/cadsus-local-api`, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// importar models aqui
require("./src/model/User");

api.set("view engine", "njk");
api.use(express.json());
api.use(cors());
api.use(require("./src/routes"));

api.listen(7125, () => {
  console.log(`
                  |                         |    
    ,---.,---.,---|,---..   .,---.. . .,---.|---.
    |    ,---||   |\`---.|   |\`---.| | ||---'|   |
    \`---'\`---^\`---'\`---'\`---'\`---'\`-'-'\`---'\`---'
\n`);
  console.log("    (~˘-˘)~    Servidor rodando.");
  console.log("    (~`-´)~    Não feche essa janela!\n");
  console.log("    Localhost  127.0.0.1:7125");
  console.log(`    MongoDB    ${mongodbServer}:27017\n\n`);
});
