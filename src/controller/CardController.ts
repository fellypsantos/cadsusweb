import { Request, Response } from 'express';
import { getUserDataToGenerateCards } from '../service/CardService';

export const generateCards = async (request: Request, response: Response): Promise<void> => {
  const { cns } = request.params;
  const cardsData = await getUserDataToGenerateCards(cns);

  response.render('card', { cardsData });
};

export const renderSearchCard = (_: Request, response: Response): void => {
  response.render('search');
};
