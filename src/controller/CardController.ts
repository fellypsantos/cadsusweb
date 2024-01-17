import { Request, Response } from 'express';
import User from '../database/model/User';

export const generateCards = async (request: Request, response: Response): Promise<void> => {
  const { cns } = request.params;

  const cardList = [];

  console.log(`Pesquisando CNS [ ${cns} ] ...`);

  const user = await User.findOne({ numeroCns: cns }).select(['-createdAt',
    '-__v',
    '-_id',
    '-nomeMae',
    '-nomePai',
    '-cpf',
    '-municipioNascimento']);

  console.log('user', user);

  cardList.push(user);


  response.render('card', { cardList });
};
