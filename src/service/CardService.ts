import chalk from 'chalk';
import { findUserByCns } from './UserService';
import { generateBarCode } from './BarCodeService';

type CardUserData = {
  nome: string;
  dataNascimento: string;
  sexo: string;
  numeroCns: string;
  barcode: string;
}

export const getUserDataToGenerateCards = async (cns: string): Promise<CardUserData[]> => {
  const cardsData: CardUserData[] = [];

  for (const cnsNumber of cns.split(',')) {

    const user = await findUserByCns(cnsNumber);

    if (!user) {
      console.log(chalk.bgRed(cnsNumber), 'Nao disponível offline.');
      continue;
    }

    const { numeroCns, nome, dataNascimento, sexo, municipioNascimentoCodigo } = user;
    const barcode = await generateBarCode({ cns: cnsNumber, gender: sexo, cityCode: municipioNascimentoCodigo });

    cardsData.push({
      numeroCns: displayFormattedCns(numeroCns),
      nome,
      dataNascimento,
      sexo,
      barcode
    });
  }

  return cardsData;
};

const displayFormattedCns = (cns: string): string => {
  return cns.replace(/^(\d{3})(\d{4})(\d{4})(\d{4})/, '$1 $2 $3 $4');
};
