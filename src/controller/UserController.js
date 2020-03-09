const mongoose = require("mongoose");
const User = mongoose.model("User");
const notifier = require("node-notifier");
const colors = require("colors");
const bwipjs = require("bwip-js");

let userSystemTraffic = 0;

formattedCns = cns => cns.replace(/^(\d{3})(\d{4})(\d{4})(\d{4})/, '$1 $2 $3 $4');

const convertToSexCode = sex => sex === "M" ? "1" : "2";

const generateBarCodeBase64 = async (cns, sexCode, cityCode) => {
  const cardBarCodeNumber = `${cns}111${sexCode}${cityCode}0`;
  const cardBarCode = await bwipjs.toBuffer({
    bcid:        'code128',
    text:        cardBarCodeNumber,
  });

  return 'data:image/png;base64,' + cardBarCode.toString('base64');
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

const totalUserTraffic = () => {
  userSystemTraffic++;
  console.log(
    `\nTráfego: ${userSystemTraffic} ${
      userSystemTraffic == 1 ? "usuário" : "usuários"
    }.\n`
  );
};

module.exports = {
  async addUser(req, res) {
    // find user by CNS
    const duplicated = await User.findOne({ numeroCns: req.body.numeroCns });

    req.body.nome = removerAcentos(req.body.nome);

    // save it if doesn't exist yet
    if (duplicated === null) {
      const response = await User.create(req.body);

      console.log(`[${response.nome}]`);
      console.log(`[${response.numeroCns}] Usuário salvo offline.`);
      totalUserTraffic();

      notifier.notify({
        title: "CADSUS - Local Database",
        message: "Ótimo! Usuário salvo offline.",
        sound: false
      });

      return res.json(response);
    } else {
      console.log(`[${response.nome}]`);
      console.log("Cadastro já existe na base offline.");
      return res.send(null);
    }
  },

  async userExists(req, res) {
    const response = await User.findOne({ numeroCns: req.params.cns });
    if (response !== null) {
      console.log(`[${req.params.cns}] Recuperado da base local.`.yellow);
      totalUserTraffic();
      res.json(response);
    } else {
      res.json(null);
    }
  },

  async updateUser(req, res) {
    console.log("updateUser", req.body);
    const response = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      useFindAndModify: false
    });

    return res.json(response);
  },

  async removeUser(req, res) {
    await User.findByIdAndDelete(req.params.id);
    console.log("Cartão provisório localizado, salvando definitivo...");
    res.send("Deleted.");
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
        userData.barcode = await generateBarCodeBase64(
          userData.numeroCns,
          sexCode,
          userData.municipioNascimentoCodigo
        );

        userData.numeroCns = formattedCns(userData.numeroCns);
        cardList.push(userData);
        console.log(" - Cartão pronto para impressão.\n".green);

      } else {
        console.log(` - Cartão ${cns} não disponível offline.\n`.red);
      }
    }
    res.render("cartao", { cardList });
  },

  // async tryDemo(req, res) {
    
  //   const code128 = await bwipjs.toBuffer({
  //     bcid:        'code128',       // Barcode type
  //     text:        '898004132326598',    // Text to encode
  //     scale:       3,               // 3x scaling factor
  //     height:      10,              // Bar height, in millimeters
  //     includetext: false,            // Show human-readable text
  //     textxalign:  'center',        // Always good to set this
  //   })

  //   console.log('code128', code128.toString('base64'));

  //   res.render("demo");
  // }
};
