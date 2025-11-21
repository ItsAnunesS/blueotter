import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RepositoryEntity } from './entities/repository.entity';
import {
  IGithubRepository,
  IUserRepoCount,
} from '../github/interfaces/github-repository.interface';
import { GithubService } from '../github/github.service';
import { SyncDto } from './dtos/sync.dto';
import { AnalyticsDto } from './dtos/analytics.dto';

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

  async syncByUser(username: string): Promise<SyncDto> {
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

  async getAnalytics(user?: string, topN?: number): Promise<AnalyticsDto> {
    const limit = Math.min(Math.max(topN ?? 5, 1), 20);

    const isGlobal = !user;

    const baseQuery = this.repositoryEntity.createQueryBuilder('repo');

    if (user) {
      const userId = await this.githubService.getUserId(user);
      if (userId) {
        baseQuery.andWhere('repo.user_id = :userId', { userId });
      }
    }

    const repos = await baseQuery.getMany();

    const summary = {
      total_repos: repos.length,
      ...(isGlobal && {
        total_users: new Set(repos.map((r) => r.user_id)).size,
      }),
    };

    const languagesMap = new Map<string, number>();
    const monthlyCount = new Map<string, number>();
    repos.forEach((repo) => {
      const lang = repo.language ?? 'Unknown';
      languagesMap.set(lang, (languagesMap.get(lang) ?? 0) + 1);

      const date = new Date(repo.github_created_at);
      const month = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthlyCount.set(month, (monthlyCount.get(month) ?? 0) + 1);
    });

    const languages = Object.fromEntries(
      Array.from(languagesMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit),
    );

    const timelineCreatedMonthly = Array.from(monthlyCount.entries())
      .map(([month, count]) => ({ month, count }))
      .sort((a, b) => a.month.localeCompare(b.month));

    let topUsersByRepos: AnalyticsDto['top_users_by_repos'];
    if (isGlobal) {
      const userRepoCount = new Map<string, IUserRepoCount>();

      repos.forEach((repo) => {
        const existing = userRepoCount.get(repo.user_login);
        if (existing) {
          existing.count++;
        } else {
          userRepoCount.set(repo.user_login, {
            login: repo.user_login,
            count: 1,
          });
        }
      });

      topUsersByRepos = Array.from(userRepoCount.values())
        .sort((a, b) => b.count - a.count)
        .slice(0, limit)
        .map((u) => ({
          user_login: u.login,
          repo_count: u.count,
        }));
    }

    return {
      summary,
      languages,
      timeline_created_monthly: timelineCreatedMonthly,
      ...(isGlobal && { top_users_by_repos: topUsersByRepos }),
    };
  }
}
