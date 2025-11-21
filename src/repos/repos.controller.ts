import { Controller, Post, Param, Get, Query } from '@nestjs/common';
import { ReposService } from './repos.service';
import { ApiOkResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { AnalyticsDto } from './dtos/analytics.dto';
import { RepositoryEntity } from './entities/repository.entity';
import { SyncDto } from './dtos/sync.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Repositories')
@Controller('repos')
export class ReposController {
  constructor(private readonly reposService: ReposService) {}

  @Post('/sync/:user')
  @ApiParam({ name: 'user', required: true, description: 'GitHub username' })
  @ApiOkResponse({ type: SyncDto })
  syncUserRepositories(@Param('user') user: string) {
    return this.reposService.syncByUser(user);
  }

  @Get('/analytics')
  @ApiQuery({ name: 'user', required: false, description: 'GitHub username' })
  @ApiQuery({
    name: 'topN',
    required: false,
    default: 5,
    description: 'Number of top users to return',
  })
  @ApiOkResponse({ type: AnalyticsDto })
  getAnalytics(@Query('user') user?: string, @Query('topN') topN?: number) {
    return this.reposService.getAnalytics(user, topN);
  }

  @Get('/:user')
  @ApiParam({ name: 'user', required: true, description: 'GitHub username' })
  @ApiOkResponse({ type: [RepositoryEntity] })
  getUserRepositories(@Param('user') user: string) {
    return this.reposService.getByUser(user);
  }

  @Get('/')
  @ApiQuery({ name: 'search', required: false, description: 'Search query' })
  @ApiOkResponse({ type: [RepositoryEntity] })
  getAllRepositories(@Query('search') search?: string) {
    return this.reposService.getAll(search);
  }
}
