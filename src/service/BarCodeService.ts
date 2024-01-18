import bwipjs from 'bwip-js';

type GenerateBarCodeParams = {
  cns: string;
  gender: string;
  cityCode: string;
}

export const generateBarCode = async ({ cns, gender, cityCode }: GenerateBarCodeParams): Promise<string> => {
  const genderCode = gender === 'M' ? '1' : '2';
  const cardBarCodeNumber = `${cns}111${genderCode}${cityCode}0`;

  const cardBarCode = await bwipjs.toBuffer({
    bcid: 'code128',
    text: cardBarCodeNumber
  });

  return 'data:image/png;base64,' + cardBarCode.toString('base64');
};
