import { Injectable, NotFoundException } from '@nestjs/common';
import { Project, CreateProjectDto, UpdateProjectDto } from '@app/shared';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
  ) {}

  async create(
    ownerId: number,

    createProjectDto: CreateProjectDto,
  ): Promise<Project> {
    const { raw } = await this.projectRepository
      .createQueryBuilder('projects')
      .insert()
      .values({ ownerId, ...createProjectDto })
      .returning('*')
      .execute();

    return this.projectRepository.create(raw[0] as object);
  }

  async update(
    ownerId: number,
    id: number,
    updateProjectDto: UpdateProjectDto,
  ): Promise<Project> {
    const { raw } = await this.projectRepository
      .createQueryBuilder()
      .update(Project)
      .set(updateProjectDto)
      .where('ownerId = :ownerId', { ownerId })
      .andWhereInIds(id)
      .returning('*')
      .execute()
      .catch(() => {
        throw new NotFoundException();
      });

    return this.projectRepository.create(raw[0] as object);
  }

  async remove(ownerId: number, id: number): Promise<void> {
    await this.projectRepository
      .createQueryBuilder()
      .delete()
      .where('ownerId = :ownerId', { ownerId })
      .andWhereInIds(id)
      .execute()
      .catch(() => {
        throw new NotFoundException();
      });
  }

  async findOne(userId: number, projectId: number): Promise<Project> {
    return await this.projectRepository
      .createQueryBuilder('projects')
      .leftJoinAndSelect('projects.lists', 'list')
      .leftJoinAndSelect('list.tasks', 'task')
      .where('projects.ownerId = :userId', { userId })
      .andWhereInIds(projectId)
      .orderBy('projects.id')
      .addOrderBy('list.position')
      .addOrderBy('task.position')
      .getOneOrFail()
      .catch(() => {
        throw new NotFoundException();
      });
  }

  async findAll(userId: number): Promise<Project[]> {
    return await this.projectRepository
      .createQueryBuilder('projects')
      .where('projects.ownerId = :userId', { userId })
      .getMany();
  }
}
