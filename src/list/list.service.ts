import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { List } from './entities/list.entity';
import { Repository } from 'typeorm';
import { ProjectService } from '../project/project.service';
import { MoveListDto } from './dto/move-list.dto';

@Injectable()
export class ListService {
  constructor(
    @InjectRepository(List)
    private listRepository: Repository<List>,
    private projectService: ProjectService,
  ) {}

  async create(userId: number, createListDto: CreateListDto): Promise<List> {
    const project = await this.projectService.findOne(
      createListDto.projectId,
      userId,
    );

    const { position } = await this.listRepository
      .createQueryBuilder('lists')
      .select('lists.position')
      .where('lists.ownerId = :userId', { userId })
      .andWhere('lists.projectId = :projectId', {
        projectId: createListDto.projectId,
      })
      .orderBy('lists.position', 'DESC')
      .getOneOrFail()
      .catch((err) => {
        return { position: 0 };
      });

    const { raw } = await this.listRepository
      .createQueryBuilder('lists')
      .insert()
      .values({
        ...createListDto,
        project,
        position: position + 1,
        ownerId: userId,
      })
      .returning('*')
      .execute();

    return this.listRepository.create(raw[0] as Object);
  }

  async findAll(userId: number): Promise<List[]> {
    return await this.listRepository
      .createQueryBuilder('lists')
      .where('lists.ownerId = :userId', { userId })
      .orderBy('lists.position')
      .getMany();
  }

  async findOne(listId: number, userId: number): Promise<List> {
    return await this.listRepository
      .createQueryBuilder('lists')
      .where('lists.ownerId = :userId', { userId })
      .andWhereInIds(listId)
      .getOneOrFail()
      .catch((err) => {
        throw new NotFoundException();
      });
  }

  async update(
    listId: number,
    userId: number,
    updateListDto: UpdateListDto,
  ): Promise<List> {
    const queryResult = await this.listRepository
      .createQueryBuilder()
      .update(List)
      .set(updateListDto)
      .where('ownerId = :userId', { userId })
      .andWhereInIds(listId)
      .returning('*')
      .execute()
      .catch((err) => {
        throw new NotFoundException();
      });

    return this.listRepository.create(queryResult.raw[0] as Object);
  }

  async remove(listId: number, userId: number): Promise<void> {
    await this.listRepository
      .createQueryBuilder()
      .delete()
      .where('ownerId = :userId', { userId })
      .andWhereInIds(listId)
      .execute()
      .catch((err) => {
        throw new NotFoundException();
      });
  }

  async moveTo(
    userId: number,
    listId: number,
    moveListDto: MoveListDto,
  ): Promise<void> {
    // get target list's initial projectId(parent id) and initial position
    const targetList: List = await this.listRepository
      .createQueryBuilder('lists')
      .select('lists.id')
      .addSelect('lists.projectId')
      .addSelect('lists.position')
      .where('lists.ownerId = :userId', { userId })
      .andWhereInIds(listId)
      .getOneOrFail()
      .catch((err) => {
        throw new NotFoundException();
      });

    // reduce position of all lists above target List initial position in its initial Project (fil the gap left by removing target List from the Project)
    await this.listRepository
      .createQueryBuilder()
      .update(List)
      .set({ position: () => 'position - 1' })
      .where('ownerId = :userId', { userId })
      .andWhere('projectId = :projectId', {
        projectId: targetList.projectId,
      })
      .andWhere('position >= :moveFrom', {
        moveFrom: targetList.position,
      })
      .execute();

    // increase position of all Lists above target position in target Project (free position for target List)
    await this.listRepository
      .createQueryBuilder()
      .update(List)
      .set({ position: () => 'position + 1' })
      .where('ownerId = :userId', { userId })
      .andWhere('projectId = :projectId', {
        projectId: moveListDto.projectId,
      })
      .andWhere('position >= :moveTo', {
        moveTo: moveListDto.position,
      })
      .execute();

    // update target List's position and ProjectId (insert target List in target position of target Project)
    await this.listRepository
      .createQueryBuilder()
      .update(List)
      .set({ position: moveListDto.position, projectId: moveListDto.projectId })
      .where('ownerId = :userId', { userId })
      .andWhere('projectId = :projectId', {
        projectId: moveListDto.projectId,
      })
      .andWhereInIds(listId)
      .execute();
  }
}
