const express = require("express");
const nunjucks = require("nunjucks");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const config = require("./package.json");
const api = express();

nunjucks.configure("views", {
  autoescape: true,
  express: api,
  watch: true
});

mongoose.connect(`mongodb://${config.databaseAddress}:27017/cadsus-local-api`, {
  useNewUrlParser: true
});

// importar models aqui
require("./src/model/User");

api.set("view engine", "njk");
api.use(express.static(path.resolve(__dirname, "public")));
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
  console.log("    (~˘-˘)~  Servidor rodando.");
  console.log("    (~`-´)~  Não feche essa janela!\n");
  console.log("    (~˘-˘)~  http://localhost:7125\n\n");
});
