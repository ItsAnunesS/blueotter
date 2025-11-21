import { Module } from '@nestjs/common';
import { ReposController } from './repos.controller';
import { ReposService } from './repos.service';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RepositoryEntity } from './entities/repository.entity';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([RepositoryEntity])],
  controllers: [ReposController],
  providers: [ReposService],
})
export class ReposModule {}
