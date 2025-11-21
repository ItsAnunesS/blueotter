import { Controller, Post, Param, Get, Query } from '@nestjs/common';
import { ReposService } from './repos.service';
import { ApiOkResponse, ApiQuery } from '@nestjs/swagger';
import { AnalyticsDto } from './dto/analytics.dto';
import { RepositoryEntity } from './entities/repository.entity';
import { SyncDto } from './dto/sync.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Repositories')
@Controller('repos')
export class ReposController {
  constructor(private readonly reposService: ReposService) {}

  @Post('/sync/:user')
  @ApiOkResponse({ type: SyncDto })
  syncUserRepositories(@Param('user') user: string) {
    return this.reposService.syncByUser(user);
  }

  @Get('/:user')
  @ApiOkResponse({ type: [RepositoryEntity] })
  getUserRepositories(@Param('user') user: string) {
    return this.reposService.getByUser(user);
  }

  @Get('/')
  @ApiQuery({ name: 'search', required: false })
  @ApiOkResponse({ type: [RepositoryEntity] })
  getAllRepositories(@Query('search') search?: string) {
    return this.reposService.getAll(search);
  }

  @Get('/analytics')
  @ApiQuery({ name: 'user', required: false })
  @ApiQuery({ name: 'topN', required: false })
  @ApiOkResponse({ type: AnalyticsDto })
  getAnalytics(@Query('user') user?: string, @Query('topN') topN?: number) {
    return this.reposService.getAnalytics(user, topN);
  }
}
