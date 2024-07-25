import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

export enum AlgorithmEnum {
  MD5 = 'md5',
  SHA1 = 'sha1',
}

@Injectable()
export class CryptoService {
  compute(input: string, algorithm: AlgorithmEnum): string {
    const hash = crypto.createHash(algorithm);
    hash.update(input);
    return hash.digest('hex');
  }

  computeSHA1OfMD5(input: string): string {
    const md5Hash = this.compute(input, AlgorithmEnum.MD5);
    const sha1Hash = this.compute(md5Hash, AlgorithmEnum.SHA1);
    return sha1Hash;
  }

  verify(passwordInput: string, hashedPassword: string): boolean {
    const sha1Hash = this.computeSHA1OfMD5(passwordInput);
    return sha1Hash === hashedPassword;
  }
}
