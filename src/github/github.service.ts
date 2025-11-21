import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { IGithubRepository } from './interfaces/github-repository.interface';

@Injectable()
export class GithubService {
  private readonly logger = new Logger(GithubService.name);

  constructor(private readonly httpService: HttpService) {}

  githubEndpoint = 'https://api.github.com/users/';

  async getUserRepos(username?: string): Promise<IGithubRepository[]> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<IGithubRepository[]>(
          `${this.githubEndpoint}${username}/repos`,
        ),
      );

      return response.data;
    } catch (error) {
      const err = error as Error;
      throw new InternalServerErrorException(
        `Error fetching user ID for ${username}: ${err.message}`,
      );
    }
  }

  async getUserId(username?: string): Promise<number> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<{ id: number }>(
          `${this.githubEndpoint}${username}`,
        ),
      );

      return response.data.id;
    } catch (error) {
      const err = error as Error;
      throw new InternalServerErrorException(
        `Error fetching user ID for ${username}: ${err.message}`,
      );
    }
  }
}
