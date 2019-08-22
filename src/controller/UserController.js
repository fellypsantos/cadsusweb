const mongoose = require("mongoose");
const User = mongoose.model("User");
const notifier = require("node-notifier");
const colors = require("colors");
const jsbarcode = require("jsbarcode");
const { createCanvas } = require("canvas");

const formattedCns = cns => {
  let formatted = "";
  let lastBlock = 0;

  for (let i = 0; i < 4; i++) {
    if (i == 0) {
      formatted = cns.substring(0, 3) + " ";
      lastBlock = 3;
      continue;
    }

    formatted += cns.substring(lastBlock, lastBlock + 4) + " ";
    lastBlock += 4; // next 4 digits
  }

  return formatted.trim();
};

const convertToSexCode = sex => {
  return sex === "M" ? "1" : "2";
};

const generateBarCodeBase64 = (cns, sexCode, cityCode) => {
  let cardBarCode = createCanvas();
  let cardBarCodeNumber = `${cns}111${sexCode}${cityCode}0`;
  jsbarcode(cardBarCode, cardBarCodeNumber, {
    displayValue: false
  });

  return cardBarCode.toDataURL();
};

const map = {
  â: "a",
  Â: "A",
  à: "a",
  À: "A",
  á: "a",
  Á: "A",
  ã: "a",
  Ã: "A",
  ê: "e",
  Ê: "E",
  è: "e",
  È: "E",
  é: "e",
  É: "E",
  î: "i",
  Î: "I",
  ì: "i",
  Ì: "I",
  í: "i",
  Í: "I",
  õ: "o",
  Õ: "O",
  ô: "o",
  Ô: "O",
  ò: "o",
  Ò: "O",
  ó: "o",
  Ó: "O",
  ü: "u",
  Ü: "U",
  û: "u",
  Û: "U",
  ú: "u",
  Ú: "U",
  ù: "u",
  Ù: "U",
  ç: "c",
  Ç: "C"
};

const removerAcentos = s => {
  return s.replace(/[\W\[\] ]/g, function(a) {
    return map[a] || a;
  });
};

module.exports = {
  async addUser(req, res) {
    // find user by CNS
    const duplicated = await User.findOne({ numeroCns: req.body.numeroCns });

    req.body.nome = removerAcentos(req.body.nome);

    // save it if doesn't exist yet
    if (duplicated === null) {
      const response = await User.create(req.body);

      console.log(`[${response.numeroCns}] Usuário salvo offline.`);
      notify(`[${response.numeroCns}] Usuário salvo offline.`);

      notifier.notify({
        title: "CADSUS - Local Database",
        message: "Ótimo! Usuário salvo offline.",
        sound: false
      });

      return res.json(response);
    } else {
      console.log("Cadastro já existe na base offline.");
      return res.send(null);
    }
  },

  async userExists(req, res) {
    const response = await User.findOne({ numeroCns: req.params.cns });
    if (response !== null) {
      console.log(`[${req.params.cns}] Recuperado da base local.`.yellow);
      notify(`[${req.params.cns}] Recuperado da base local.`);
      res.json(response);
    } else {
      res.json(null);
    }
  },

  async generateCard(req, res) {
    const cardListParams = req.params.cns.split(",");
    let cardList = [];

    console.log("• Processando dados recebidos...".cyan);
    console.log(`• ${cardListParams.length} no total.\n`.cyan);

    for (const cns of cardListParams) {
      // process each CNS

      console.log(`Pesquisando CNS [ ${cns} ] ...`);

      let userData = await User.findOne({ numeroCns: cns }).select([
        "-createdAt",
        "-__v",
        "-_id",
        "-nomeMae",
        "-nomePai",
        "-cpf",
        "-municipioNascimento"
      ]);

      if (userData !== null) {
        console.log(" - Encontrado na base local, processando...");

        sexCode = convertToSexCode(userData.sexo);
        userData.barcode = generateBarCodeBase64(
          userData.numeroCns,
          sexCode,
          userData.municipioNascimentoCodigo
        );
        userData.numeroCns = formattedCns(userData.numeroCns);

        console.log(" - Cartão pronto para impressão.\n".green);
        notify(`Cartão pronto para impressão.`);
        cardList.push(userData);
      } else {
        console.log(` - Cartão ${cns} não disponível offline.\n`.red);
      }
    }
    res.render("cartao", { cardList });
  }
};
