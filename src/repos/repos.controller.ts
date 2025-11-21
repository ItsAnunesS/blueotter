import { Controller, Post, Param, Get, Query } from '@nestjs/common';
import { ReposService } from './repos.service';
import { ApiQuery } from '@nestjs/swagger';

@Controller('repos')
export class ReposController {
  constructor(private readonly reposService: ReposService) {}

  @Post('/sync/:user')
  syncUserRepositories(@Param('user') user: string) {
    return this.reposService.syncByUser(user);
  }

  @Get('/:user')
  getUserRepositories(@Param('user') user: string) {
    return this.reposService.getByUser(user);
  }

  @Get('/')
  @ApiQuery({ name: 'search', required: false })
  getAllRepositories(@Query('search') search?: string) {
    return this.reposService.getAll(search);
  }
}
