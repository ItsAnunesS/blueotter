import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RepositoryEntity } from './entities/repository.entity';
import { IGithubRepository } from '../github/interfaces/github-repository.interface';
import { GithubService } from 'src/github/github.service';

@Injectable()
export class ReposService {
  constructor(
    @InjectRepository(RepositoryEntity)
    private readonly repositoryEntity: Repository<RepositoryEntity>,
    private readonly githubService: GithubService,
  ) {}

  async getByUser(username: string): Promise<RepositoryEntity[]> {
    const userId = await this.githubService.getUserId(username);
    return this.repositoryEntity.find({ where: { user_id: userId } });
  }

  async syncByUser(
    username: string,
  ): Promise<{ message: string; count: number }> {
    const repos: IGithubRepository[] =
      await this.githubService.getUserRepos(username);

    const savedRepos: RepositoryEntity[] = [];
    for (const {
      id: github_repo_id,
      name,
      description,
      html_url,
      language,
      created_at,
      owner,
    } of repos) {
      const existingRepo = await this.repositoryEntity.findOne({
        where: { github_repo_id },
      });

      if (existingRepo) {
        existingRepo.name = name;
        existingRepo.description = description ?? null;
        existingRepo.url = html_url;
        existingRepo.language = language ?? null;
        existingRepo.github_created_at = new Date(created_at);
        existingRepo.user_id = owner.id;
        existingRepo.user_login = owner.login;
        existingRepo.user_avatar_url = owner.avatar_url;

        await this.repositoryEntity.save(existingRepo);
        savedRepos.push(existingRepo);
      } else {
        const newRepo = this.repositoryEntity.create({
          github_repo_id,
          name,
          description: description ?? null,
          url: html_url,
          language: language ?? null,
          github_created_at: new Date(created_at),
          user_id: owner.id,
          user_login: owner.login,
          user_avatar_url: owner.avatar_url,
        });

        await this.repositoryEntity.save(newRepo);
        savedRepos.push(newRepo);
      }
    }

    return {
      message: `Successfully synced ${savedRepos.length} repositories for user ${username}`,
      count: savedRepos.length,
    };
  }

  async getAll(search?: string): Promise<RepositoryEntity[]> {
    return this.repositoryEntity.find({
      where: [
        { name: search },
        { description: search },
        { language: search },
        { user_login: search },
      ],
    });
  }
}
