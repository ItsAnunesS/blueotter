import { Controller, Post, Param, Get } from '@nestjs/common';
import { GithubService } from './github.service';

@Controller('github')
export class GithubController {
  constructor(private readonly githubService: GithubService) {}

  @Post('/sync/:user')
  syncUserRepositories(@Param('user') user: string) {
    return this.githubService.syncUserRepositories(user);
  }

  @Get('/repos/:user')
  getUserRepositories(@Param('user') user: string) {
    return this.githubService.getUserRepos(user);
  }
}
