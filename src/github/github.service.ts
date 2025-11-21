import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { IGithubRepository } from './interfaces/github-repository.interface';

@Injectable()
export class GithubService {
  constructor(private readonly httpService: HttpService) {}

  githubEndpoint = 'https://api.github.com/users/';

  private async getGithubUserRepos(
    username: string,
  ): Promise<IGithubRepository[]> {
    const response = await firstValueFrom(
      this.httpService.get<IGithubRepository[]>(
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
