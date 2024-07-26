import { SetMetadata } from '@nestjs/common';
import { metaData } from '../constants';

export const Public = () => SetMetadata(metaData.isPublic, true);
