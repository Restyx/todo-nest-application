import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Task, CreateTaskDto, UpdateTaskDto, MoveTaskDto } from '@app/shared';
import { Repository } from 'typeorm';
import { ListService } from '../list/list.service';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    private listService: ListService,
  ) {}

  async create(ownerId: number, createTaskDto: CreateTaskDto): Promise<Task> {
    const { listId } = createTaskDto;

    const list = await this.listService.findOne(ownerId, createTaskDto.listId);

    const { position } = await this.taskRepository
      .createQueryBuilder('tasks')
      .select('tasks.position')
      .where('tasks.ownerId = :ownerId', { ownerId })
      .andWhere('tasks.listId = :listId', {
        listId,
      })
      .orderBy('tasks.position', 'DESC')
      .getOneOrFail()
      .catch(() => {
        return { position: 0 };
      });

    const { raw } = await this.taskRepository
      .createQueryBuilder()
      .insert()
      .values({
        ...createTaskDto,
        list,
        position: position + 1,
        ownerId,
      })
      .returning('*')
      .execute();

    return this.taskRepository.create(raw[0] as object);
  }

  async update(
    ownerId: number,
    id: number,
    updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    const queryResult = await this.taskRepository
      .createQueryBuilder()
      .update(Task)
      .set(updateTaskDto)
      .where('ownerId = :ownerId', { ownerId })
      .andWhereInIds(id)
      .returning('*')
      .execute()
      .catch(() => {
        throw new NotFoundException();
      });

    return this.taskRepository.create(queryResult.raw[0] as object);
  }

  async remove(ownerId: number, id: number): Promise<void> {
    await this.taskRepository
      .createQueryBuilder()
      .delete()
      .where('ownerId = :ownerId', { ownerId })
      .andWhereInIds(id)
      .execute()
      .catch(() => {
        throw new NotFoundException();
      });
  }

  async moveTo(ownerId: number, moveTasktDto: MoveTaskDto): Promise<void> {
    const { id, listId, position } = moveTasktDto;

    // get target Task's initial listId(parent id) and initial position
    const targetTask: Task = await this.taskRepository
      .createQueryBuilder('tasks')
      .select('tasks.listId')
      .addSelect('tasks.position')
      .where('tasks.ownerId = :ownerId', { ownerId })
      .andWhereInIds(id)
      .getOneOrFail()
      .catch(() => {
        throw new NotFoundException();
      });

    // reduce position of all tasks above target Task initial position in its initial List (fil the gap left by removing target Task from the list)
    await this.taskRepository
      .createQueryBuilder()
      .update(Task)
      .set({ position: () => 'position - 1' })
      .where('ownerId = :ownerId', { ownerId })
      .andWhere('listId = :listId', {
        listId: targetTask.listId,
      })
      .andWhere('position >= :moveFrom', {
        moveFrom: targetTask.position,
      })
      .execute();

    // increase position of all tasks above target position in target List (free position for target Task)
    await this.taskRepository
      .createQueryBuilder()
      .update(Task)
      .set({ position: () => 'position + 1' })
      .where('ownerId = :ownerId', { ownerId })
      .andWhere('listId = :listId', {
        listId: moveTasktDto.listId,
      })
      .andWhere('position >= :moveTo', {
        moveTo: position,
      })
      .execute();

    // update target Task's position and ListId (insert target Task in target position of target List)
    await this.taskRepository
      .createQueryBuilder()
      .update(Task)
      .set({ position, listId })
      .where('ownerId = :ownerId', { ownerId })
      .andWhereInIds(id)
      .execute();
  }

  async findOne(userId: number, taskId: number): Promise<Task> {
    return await this.taskRepository
      .createQueryBuilder('tasks')
      .where('tasks.ownerId = :userId', { userId })
      .andWhereInIds(taskId)
      .getOneOrFail()
      .catch(() => {
        throw new NotFoundException();
      });
  }

  async findAll(userId: number): Promise<Task[]> {
    return await this.taskRepository
      .createQueryBuilder('tasks')
      .where('tasks.ownerId = :userId', { userId })
      .orderBy('tasks.listId')
      .addOrderBy('tasks.position')
      .getMany();
  }
}
