import { IJwtPayload } from '../modules';

export interface IMetadata {
  isPublic: string;
}

export interface ICustomRequest extends Request {
  user: IJwtPayload;
}
