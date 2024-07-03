import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './entities/project.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
  ) {}

  async create(
    createProjectDto: CreateProjectDto,
    userId: number,
  ): Promise<Project> {
    const { raw } = await this.projectRepository
      .createQueryBuilder('projects')
      .insert()
      .values({ ...createProjectDto, ownerId: userId })
      .returning('*')
      .execute();

    return this.projectRepository.create(raw[0] as object);
  }

  async findAll(userId: number): Promise<Project[]> {
    return await this.projectRepository
      .createQueryBuilder('projects')
      .where('projects.ownerId = :userId', { userId })
      .getMany();
  }

  async findOne(projectId: number, userId: number): Promise<Project> {
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

  async update(
    id: number,
    updateProjectDto: UpdateProjectDto,
    userId: number,
  ): Promise<Project> {
    const { raw } = await this.projectRepository
      .createQueryBuilder()
      .update(Project)
      .set(updateProjectDto)
      .where('ownerId = :userId', { userId })
      .andWhereInIds(id)
      .returning('id, title, description')
      .execute()
      .catch(() => {
        throw new NotFoundException();
      });

    return this.projectRepository.create(raw[0] as object);
  }

  async remove(id: number, userId: number): Promise<void> {
    await this.projectRepository
      .createQueryBuilder()
      .delete()
      .where('ownerId = :userId', { userId })
      .andWhereInIds(id)
      .execute()
      .catch(() => {
        throw new NotFoundException();
      });
  }
}
