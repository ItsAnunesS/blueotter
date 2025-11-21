import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { firstValueFrom } from 'rxjs';
import { GithubRepository as GithubRepoInterface } from './interfaces/github-repository.interface';
import { GithubRepository } from './entities/repository.entity';

@Injectable()
export class GithubService {
  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(GithubRepository)
    private readonly repositoryRepo: Repository<GithubRepository>,
  ) {}

  githubEndpoint = 'https://api.github.com/users/';

  async getUserRepos(username: string): Promise<GithubRepository[]> {
    const userId = await this.getGithubUserId(username);
    return this.repositoryRepo.find({ where: { user_id: userId } });
  }

  async syncUserRepositories(
    username: string,
  ): Promise<{ message: string; count: number }> {
    const repos = await this.getGithubUserRepos(username);

    const savedRepos: GithubRepository[] = [];
    for (const {
      id: github_repo_id,
      name,
      description,
      html_url,
      language,
      created_at,
      owner,
    } of repos) {
      const existingRepo = await this.repositoryRepo.findOne({
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

        await this.repositoryRepo.save(existingRepo);
        savedRepos.push(existingRepo);
      } else {
        const newRepo = this.repositoryRepo.create({
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

        await this.repositoryRepo.save(newRepo);
        savedRepos.push(newRepo);
      }
    }

    return {
      message: `Successfully synced ${savedRepos.length} repositories for user ${username}`,
      count: savedRepos.length,
    };
  }

  private async getGithubUserRepos(
    username: string,
  ): Promise<GithubRepoInterface[]> {
    const response = await firstValueFrom(
      this.httpService.get<GithubRepoInterface[]>(
        `${this.githubEndpoint}${username}/repos`,
      ),
    );

    return response.data;
  }

  private async getGithubUserId(username: string): Promise<number> {
    const response = await firstValueFrom(
      this.httpService.get<{ id: number }>(`${this.githubEndpoint}${username}`),
    );

    return response.data.id;
  }
}
