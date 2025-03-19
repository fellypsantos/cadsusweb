import chalk from 'chalk';
import { open as openURL } from 'openurl';
import readline from 'readline';
import tty from 'tty';

import Logger from './Logger';

const showMenuOptions = (): void => {
  console.log(chalk.green('--- MENU ---'));
  console.log('1 - Abrir Pesquisa Offline');
  console.log('2 - Instalar Userscript');
  console.log('0 - Mostrar Opções Novamente');
};

const clearUserInputKey = (): void => {
  process.stdout.clearLine(0);
  process.stdout.cursorTo(0);
  process.stdout.write('');
};

export const showMenu = (): void => {
  // Create a readable stream for stdin
  const input = process.stdin;

  // Check if the input is a TTY (terminal)
  if (tty.isatty(input.fd)) {
    input.setRawMode(true); // Set raw mode for reading individual keypress events
  }

  // Create a readline interface
  readline.createInterface({
    input: input,
    output: process.stdout
  });

  showMenuOptions();

  // Handle user input
  input.on('keypress', (_, key) => {
    if (key) {

      clearUserInputKey();

      switch (key.name) {
        case '1':
          Logger(chalk.blue('Abrindo pesquisa offline...'));
          openURL('http://localhost:7125/search');
          break;

        case '2':
          Logger(chalk.blue('Instalar userscript'));
          openURL('http://localhost:7125/script.user.js');
          break;

        case '0':
          showMenuOptions();
          break;

        default:
          console.log('Opção inválida.');
      }
    }
  });

  // Start listening for keypress events
  input.resume();

  console.log(chalk.green('\n\n--- LOG ---'));
  Logger('Sistema iniciado.');
};
