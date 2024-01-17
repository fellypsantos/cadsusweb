import chalk from 'chalk';
import { format } from 'date-fns';

const Logger = (...text: string[]): void => {
  console.log(
    chalk.blueBright(format(new Date(), 'p')),
    ...text
  );
};

export default Logger;
