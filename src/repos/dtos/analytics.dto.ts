import { Optional } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class SummaryDto {
  @ApiProperty({
    type: Number,
    example: 100,
    description: 'Total number of repositories',
  })
  total_repos: number;

  @ApiProperty({
    type: Number,
    example: 10,
    description: 'Total number of users (only for global statistics)',
    required: false,
  })
  @Optional()
  total_users?: number;
}

export class TopUserDto {
  @ApiProperty({
    type: String,
    example: 'octocat',
    description: 'User login',
  })
  user_login: string;

  @ApiProperty({
    type: Number,
    example: 25,
    description: 'Number of repositories',
  })
  repo_count: number;
}

export class TimelineMonthDto {
  @ApiProperty({
    type: String,
    example: '2023-01',
    description: 'Month in YYYY-MM format',
  })
  month: string;

  @ApiProperty({
    type: Number,
    example: 15,
    description: 'Number of repositories created in this month',
  })
  count: number;
}

export class AnalyticsDto {
  @ApiProperty({
    type: SummaryDto,
    description: 'Summary statistics',
  })
  summary: SummaryDto;

  @ApiProperty({
    type: Object,
    example: { JavaScript: 45, TypeScript: 30, Python: 25 },
    description: 'Languages by repository count',
  })
  languages: Record<string, number>;

  @ApiProperty({
    type: [TopUserDto],
    description: 'Top users by repository count (only for global statistics)',
    required: false,
  })
  @Optional()
  top_users_by_repos?: TopUserDto[];

  @ApiProperty({
    type: [TimelineMonthDto],
    description: 'Histogram of repositories created by month',
  })
  timeline_created_monthly: TimelineMonthDto[];
}
