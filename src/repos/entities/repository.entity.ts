import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('repositories')
export class RepositoryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  github_repo_id: number;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column()
  url: string;

  @Column({ type: 'varchar', nullable: true })
  language: string | null;

  @Column({ type: 'timestamp' })
  github_created_at: Date;

  @Column()
  user_id: number;

  @Column()
  user_login: string;

  @Column()
  user_avatar_url: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
