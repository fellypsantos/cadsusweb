import { Request, Response } from 'express';
import { findUserByCns, handleAddUser, handleSearchUser, handleUpdateUser } from '../service/UserService';
import { generateBarCode } from '../service/BarCodeService';
import { displayFormattedCns } from '../service/CardService';

export const findUser = async (request: Request, response: Response): Promise<Response> => {
  const { cns } = request.params;
  const user = await findUserByCns(cns);
  if (!user) return response.json(null);
  return response.json(user);
};

export const addUser = async (request: Request, response: Response): Promise<Response> => {
  const result = await handleAddUser(request.body);
  return response.send(result);
};

export const updateUser = async (request: Request, response: Response): Promise<Response> => {
  const result = await handleUpdateUser(request.body);
  return response.json(result);
};

export const searchUser = async (request: Request, response: Response): Promise<Response> => {
  const { searchContent } = request.body;
  const result = await handleSearchUser(searchContent);
  return response.json(result);
};


export const generateCard = async (request: Request, response: Response): Promise<void> => {

  const cardsData = [];

  const jsonData = JSON.parse(request.body.jsonData);
  console.log('jsonData', typeof (jsonData));

  for (const cardDataItem of jsonData) {

    const { nome, dataNascimento, numeroCns, cpf, sexo, municipioNascimentoCodigo } = cardDataItem;

    const barcode = await generateBarCode({ cns: numeroCns, cpf, gender: sexo, cityCode: municipioNascimentoCodigo });
    const formattedCns = displayFormattedCns(numeroCns);

    cardsData.push({
      nome,
      cpf,
      municipioNascimentoCodigo,
      dataNascimento,
      sexo,
      numeroCns: formattedCns,
      barcode
    });
  }

  console.log('cardsData', { cardsData });

  response.render('card', { cardsData });
};
