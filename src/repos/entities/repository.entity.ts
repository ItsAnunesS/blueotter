import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('repositories')
export class RepositoryEntity {
  @ApiProperty({
    type: Number,
    example: 1,
    description: 'Repository ID',
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    type: Number,
    example: 1,
    description: 'GitHub repository ID',
  })
  @Column({ unique: true })
  github_repo_id: number;

  @ApiProperty({
    type: String,
    example: 'Repository Name',
    description: 'Repository name',
  })
  @Column()
  name: string;

  @ApiProperty({
    type: String,
    example: 'Description',
    nullable: true,
    description: 'Repository description',
  })
  @Column({ type: 'text', nullable: true })
  description: string | null;

  @ApiProperty({
    type: String,
    example: 'https://github.com/user/repo',
    description: 'Repository URL',
  })
  @Column()
  url: string;

  @ApiProperty({
    type: String,
    example: 'JavaScript',
    nullable: true,
    description: 'Repository language',
  })
  @Column({ type: 'varchar', nullable: true })
  language: string | null;

  @ApiProperty({
    type: Date,
    example: '2023-01-01T00:00:00.000Z',
    description: 'Repository creation date',
  })
  @Column({ type: 'timestamp' })
  github_created_at: Date;

  @ApiProperty({
    type: Number,
    example: 1,
    description: 'User ID',
  })
  @Column()
  user_id: number;

  @ApiProperty({
    type: String,
    example: 'User',
    description: 'User login',
  })
  @Column()
  user_login: string;

  @ApiProperty({
    type: String,
    example: 'https://avatars.githubusercontent.com/u/1?v=4',
    description: 'User avatar URL',
  })
  @Column()
  user_avatar_url: string;

  @ApiProperty({
    type: Date,
    example: '2023-01-01T00:00:00.000Z',
    description: 'Repository creation date',
  })
  @CreateDateColumn()
  created_at: Date;

  @ApiProperty({
    type: Date,
    example: '2023-01-01T00:00:00.000Z',
    description: 'Repository update date',
  })
  @UpdateDateColumn()
  updated_at: Date;
}
