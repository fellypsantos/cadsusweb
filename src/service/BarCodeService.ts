import bwipjs from 'bwip-js';

type GenerateBarCodeParams = {
  cns: string;
  cpf: string;
  gender: string;
  cityCode: string;
}

export const generateBarCode = async ({ cns, cpf, gender, cityCode }: GenerateBarCodeParams): Promise<string> => {

  const sanitizedCPF = cpf.replaceAll(/[.-]/g, '');
  const genderCode = gender === 'M' ? '1' : '2';
  const cardBarCodeNumberCNS = `${cns}111${genderCode}${cityCode}0`;
  const cardBarCodeNumberCPF = `0${sanitizedCPF}`;

  const barcodeNumber = cpf !== '' ? cardBarCodeNumberCPF : cardBarCodeNumberCNS;

  const cardBarCode = await bwipjs.toBuffer({
    bcid: 'code128',
    text: barcodeNumber
  });

  return 'data:image/png;base64,' + cardBarCode.toString('base64');
};
