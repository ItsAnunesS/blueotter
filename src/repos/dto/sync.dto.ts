import { ApiProperty } from '@nestjs/swagger';

export class SyncDto {
  @ApiProperty({
    type: String,
    example: 'Successfully synced 10 repositories for user User',
    description: 'Sync message',
  })
  message: string;

  @ApiProperty({
    type: Number,
    example: 10,
    description: 'Number of repositories synced',
  })
  count: number;
}
