import { Module } from '@nestjs/common';
import { ReposController } from './repos.controller';
import { ReposService } from './repos.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RepositoryEntity } from './entities/repository.entity';
import { GithubModule } from '../github/github.module';

@Module({
  imports: [TypeOrmModule.forFeature([RepositoryEntity]), GithubModule],
  controllers: [ReposController],
  providers: [ReposService],
})
export class ReposModule {}
