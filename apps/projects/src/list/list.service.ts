import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { List, CreateListDto, UpdateListDto, MoveListDto } from '@app/shared';
import { Repository } from 'typeorm';
import { ProjectService } from '../project/project.service';

@Injectable()
export class ListService {
  constructor(
    @InjectRepository(List)
    private listRepository: Repository<List>,
    private projectService: ProjectService,
  ) {}

  async create(ownerId: number, createListDto: CreateListDto): Promise<List> {
    const { projectId } = createListDto;

    const project = await this.projectService.findOne(ownerId, projectId);

    const { position } = await this.listRepository
      .createQueryBuilder('lists')
      .select('lists.position')
      .where('lists.ownerId = :ownerId', { ownerId })
      .andWhere('lists.projectId = :projectId', {
        projectId,
      })
      .orderBy('lists.position', 'DESC')
      .getOneOrFail()
      .catch(() => {
        return { position: 0 };
      });

    const { raw } = await this.listRepository
      .createQueryBuilder('lists')
      .insert()
      .values({
        ...createListDto,
        project,
        position: position + 1,
        ownerId,
      })
      .returning('*')
      .execute();

    return this.listRepository.create(raw[0] as object);
  }

  async update(
    ownerId: number,
    id: number,
    updateListDto: UpdateListDto,
  ): Promise<List> {
    const { raw } = await this.listRepository
      .createQueryBuilder()
      .update(List)
      .set(updateListDto)
      .where('ownerId = :ownerId', { ownerId })
      .andWhereInIds(id)
      .returning('*')
      .execute()
      .catch(() => {
        throw new NotFoundException();
      });

    return this.listRepository.create(raw[0] as object);
  }

  async remove(ownerId: number, id: number): Promise<void> {
    await this.listRepository
      .createQueryBuilder()
      .delete()
      .where('ownerId = :ownerId', { ownerId })
      .andWhereInIds(id)
      .execute()
      .catch(() => {
        throw new NotFoundException();
      });
  }

  async moveTo(ownerId: number, moveListDto: MoveListDto): Promise<void> {
    const { id, projectId, position } = moveListDto;

    // get target list's initial projectId(parent id) and initial position
    const targetList: List = await this.listRepository
      .createQueryBuilder('lists')
      .select('lists.id')
      .addSelect('lists.projectId')
      .addSelect('lists.position')
      .where('lists.ownerId = :ownerId', { ownerId })
      .andWhereInIds(id)
      .getOneOrFail()
      .catch(() => {
        throw new NotFoundException();
      });

    // reduce position of all lists above target List initial position in its initial Project (fil the gap left by removing target List from the Project)
    await this.listRepository
      .createQueryBuilder()
      .update(List)
      .set({ position: () => 'position - 1' })
      .where('ownerId = :ownerId', { ownerId })
      .andWhere('projectId = :projectId', {
        projectId,
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
      .where('ownerId = :ownerId', { ownerId })
      .andWhere('projectId = :projectId', {
        projectId,
      })
      .andWhere('position >= :moveTo', {
        moveTo: position,
      })
      .execute();

    // update target List's position and ProjectId (insert target List in target position of target Project)
    await this.listRepository
      .createQueryBuilder()
      .update(List)
      .set({ position: moveListDto.position, projectId: moveListDto.projectId })
      .where('ownerId = :ownerId', { ownerId })
      .andWhereInIds(id)
      .execute();
  }

  async findOne(ownerId: number, listId: number): Promise<List> {
    return await this.listRepository
      .createQueryBuilder('lists')
      .where('lists.ownerId = :ownerId', { ownerId })
      .andWhereInIds(listId)
      .getOneOrFail()
      .catch(() => {
        throw new NotFoundException();
      });
  }

  async findAll(ownerId: number): Promise<List[]> {
    return await this.listRepository
      .createQueryBuilder('lists')
      .where('lists.ownerId = :ownerId', { ownerId })
      .orderBy('lists.projectId')
      .addOrderBy('lists.position')
      .getMany();
  }

}
