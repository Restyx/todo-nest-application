import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';
import { ListService } from '../list/list.service';
import { MoveTaskDto } from './dto/move-task.dto';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    private listService: ListService,
  ) {}

  async create(userId: number, createTaskDto: CreateTaskDto): Promise<Task> {
    const list = await this.listService.findOne(createTaskDto.listId, userId);

    const { position } = await this.taskRepository
      .createQueryBuilder('tasks')
      .select('tasks.position')
      .where('tasks.ownerId = :userId', { userId })
      .andWhere('tasks.listId = :listId', {
        listId: createTaskDto.listId,
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
        ownerId: userId,
      })
      .returning('*')
      .execute();

    return this.taskRepository.create(raw[0] as object);
  }

  async findAll(userId: number): Promise<Task[]> {
    return await this.taskRepository
      .createQueryBuilder('tasks')
      .where('tasks.ownerId = :userId', { userId })
      .orderBy('tasks.position')
      .getMany();
  }

  async findOne(taskId: number, userId: number): Promise<Task> {
    return await this.taskRepository
      .createQueryBuilder('tasks')
      .where('tasks.ownerId = :userId', { userId })
      .andWhereInIds(taskId)
      .getOneOrFail()
      .catch(() => {
        throw new NotFoundException();
      });
  }

  async update(
    taskId: number,
    userId: number,
    updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    const queryResult = await this.taskRepository
      .createQueryBuilder()
      .update(Task)
      .set(updateTaskDto)
      .where('ownerId = :userId', { userId })
      .andWhereInIds(taskId)
      .returning('*')
      .execute()
      .catch(() => {
        throw new NotFoundException();
      });

    return this.taskRepository.create(queryResult.raw[0] as object);
  }

  async remove(taskId: number, userId: number): Promise<void> {
    await this.taskRepository
      .createQueryBuilder()
      .delete()
      .where('ownerId = :userId', { userId })
      .andWhereInIds(taskId)
      .execute()
      .catch(() => {
        throw new NotFoundException();
      });
  }

  async moveTo(
    userId: number,
    taskId: number,
    moveTasktDto: MoveTaskDto,
  ): Promise<void> {
    // get target Task's initial listId(parent id) and initial position
    const targetTask: Task = await this.taskRepository
      .createQueryBuilder('tasks')
      .select('tasks.listId')
      .addSelect('tasks.position')
      .where('tasks.ownerId = :userId', { userId })
      .andWhereInIds(taskId)
      .getOneOrFail()
      .catch(() => {
        throw new NotFoundException();
      });

    // reduce position of all tasks above target Task initial position in its initial List (fil the gap left by removing target Task from the list)
    await this.taskRepository
      .createQueryBuilder()
      .update(Task)
      .set({ position: () => 'position - 1' })
      .where('ownerId = :userId', { userId })
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
      .where('ownerId = :userId', { userId })
      .andWhere('listId = :listId', {
        listId: moveTasktDto.listId,
      })
      .andWhere('position >= :moveTo', {
        moveTo: moveTasktDto.position,
      })
      .execute();

    // update target Task's position and ListId (insert target Task in target position of target List)
    await this.taskRepository
      .createQueryBuilder()
      .update(Task)
      .set({ position: moveTasktDto.position, listId: moveTasktDto.listId })
      .where('ownerId = :userId', { userId })
      .andWhereInIds(taskId)
      .execute();
  }
}
