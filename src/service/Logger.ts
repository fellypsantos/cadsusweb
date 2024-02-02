import chalk from 'chalk';
import { format } from 'date-fns';
import * as fs from 'fs';

import { getFormattedDate } from '../helper/dateHelper';
import { getAbsolutePath } from '../helper/pathHelper';

const loggerFolder = 'logger';
const logFilePath = getAbsolutePath(loggerFolder, `LOG-${getFormattedDate()}.log`);

const ensureLoggerFolderExists = (): void => {
  const loggerFolderPath = 'logger';

  if (!fs.existsSync(loggerFolderPath)) {
    fs.mkdirSync(loggerFolderPath);
  }
};

/**
 * Remove special hex codes that colorize the string.
 * @param text The text to be logged
 * @returns Sanitized text without special hex codes from chalk lib.
 */
const removeANSIEscapeCodes = (text: string): string => {
  // eslint-disable-next-line no-control-regex
  const ansiEscapeCodesRegex = /\u001b\[[0-9;]*m/g;
  return text.replace(ansiEscapeCodesRegex, '');
};

ensureLoggerFolderExists();

const Logger = (...text: string[]): void => {
  const currentHour = `[${format(new Date(), 'p')}]`;

  console.log(chalk.blueBright(currentHour), ...text);

  const sanitizedMessage = removeANSIEscapeCodes(text.join(' '));
  const logFileMessage = `${currentHour} ${sanitizedMessage}`;

  // Log to file without chalk styling
  fs.appendFile(logFilePath, `${logFileMessage}\n`, (err) => {
    if (err) {
      console.error('Error writing to log file:', err);
    }
  });
};

export default Logger;
