export type UserType = {
  id?: string;
  numeroCns: string;
  cpf?: string | null;
  nome: string;
  dataNascimento: string;
  sexo: string;
  municipioNascimento: string;
  municipioNascimentoCodigo: string;
  nomeMae?: string | null;
  nomePai?: string | null;
}
