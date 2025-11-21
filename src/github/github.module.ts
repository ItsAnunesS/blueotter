import { Module } from '@nestjs/common';
import { GithubController } from './github.controller';
import { GithubService } from './github.service';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GithubRepository } from './entities/repository.entity';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([GithubRepository])],
  controllers: [GithubController],
  providers: [GithubService],
})
export class GithubModule {}
