import { Transform } from 'class-transformer';
import { IsOptional, IsBoolean, Matches } from 'class-validator';

import { PaginationParams } from '../../utils/types/pagination-params.type';

export class TaskQuerySearchParams extends PaginationParams {
  @IsOptional()
  @IsBoolean()
  @Transform((value) => value.value === 'true')
  isComplete?: boolean;

  @IsOptional()
  @Matches(/^(isComplete|createdAt)_(ASC|DESC)$/, {
    message: 'orderBy parameter must be in the format [property]_[orderType]',
  })
  orderBy?: string;
}
