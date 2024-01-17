import { Schema, model, Document, Model } from 'mongoose';

// Interface for user attributes
interface UserAttributes {
  numeroCns: string;
  cpf?: string | null;
  nome: string;
  dataNascimento: string;
  sexo: string;
  municipioNascimento: string;
  municipioNascimentoCodigo: string;
  nomeMae?: string | null;
  nomePai?: string | null;
  createdAt: Date;
}

// Interface for user document (extends mongoose Document)
export interface UserDocument extends UserAttributes, Document { }

// Interface for user model (extends mongoose Model)
interface UserModel extends Model<UserDocument> { }

// Define user schema
const UserSchema = new Schema<UserDocument, UserModel>({
  numeroCns: {
    type: String,
    required: true
  },
  cpf: {
    type: String,
    required: false
  },
  nome: {
    type: String,
    required: true
  },
  dataNascimento: {
    type: String,
    required: true
  },
  sexo: {
    type: String,
    required: true
  },
  municipioNascimento: {
    type: String,
    required: true
  },
  municipioNascimentoCodigo: {
    type: String,
    required: true,
    default: '999999'
  },
  nomeMae: {
    type: String,
    required: false
  },
  nomePai: {
    type: String,
    required: false
  },
  createdAt: {
    type: Date,
    default: new Date()
  }
});

// Create and export the User model
const UserModel = model<UserDocument, UserModel>('User', UserSchema);
export default UserModel;
