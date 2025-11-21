import { Controller, Post, Param, Get } from '@nestjs/common';
import { ReposService } from './repos.service';

@Controller('repos')
export class ReposController {
  constructor(private readonly reposService: ReposService) {}

  @Post('/sync/:user')
  syncUserRepositories(@Param('user') user: string) {
    return this.reposService.syncUserRepositories(user);
  }

  @Get('/:user')
  getUserRepositories(@Param('user') user: string) {
    return this.reposService.getUserRepos(user);
  }
}
