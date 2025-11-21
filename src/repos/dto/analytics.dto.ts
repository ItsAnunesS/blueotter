import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class SummaryDto {
  @ApiProperty({
    type: Number,
    example: 10,
    description: 'Number of repositories',
  })
  total_repos: number;

  @ApiProperty({
    type: Number,
    example: 10,
    description: 'Number of users',
  })
  @Optional()
  total_users?: number;
}

export class AnalyticsDto {
  @ApiProperty({
    type: SummaryDto,
    description: 'Summary of repositories',
  })
  summary: SummaryDto;

  @ApiProperty({
    type: Number,
    example: 10,
    description: 'Number of languages',
  })
  languages: number;

  @ApiProperty({
    type: Number,
    example: 10,
    description: 'Number of top users by repos',
  })
  @Optional()
  top_users_by_repos?: number;

  @ApiProperty({
    type: Number,
    example: 10,
    description: 'Number of top users by followers',
  })
  top_users_by_followers: number;
}
