import {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

import { BaseInterfaceRepository } from 'src/lib/repositories/base/base.interface.repository';

interface hasId {
  id: number;
}

export abstract class BaseAbstractRepository<T extends hasId>
  implements BaseInterfaceRepository<T>
{
  private entity: Repository<T>;
  protected constructor(entity: Repository<T>) {
    this.entity = entity;
  }

  public create(data: DeepPartial<T>): T {
    return this.entity.create(data);
  }

  public createMany(data: DeepPartial<T>[]): T[] {
    return this.entity.create(data);
  }

  public async save(data: DeepPartial<T>): Promise<T> {
    return await this.entity.save(data);
  }

  public async saveMany(data: DeepPartial<T>[]): Promise<T[]> {
    // this.entity.update()
    return await this.entity.save(data);
  }

  public async findOneById(id: any): Promise<T> {
    const options: FindOptionsWhere<T> = {
      id: id,
    };

    return await this.entity.findOneBy(options);
  }

  public async findByCondition(
    filteredCondition: FindOneOptions<T>,
  ): Promise<T> {
    return await this.entity.findOne(filteredCondition);
  }

  public async findWithRelations(relations: FindManyOptions<T>): Promise<T[]> {
    return this.entity.find(relations);
  }

  public async findAll(options?: FindManyOptions<T>): Promise<T[]> {
    return await this.entity.find(options);
  }

  public async remove(entity: T): Promise<T> {
    return await this.entity.remove(entity);
  }

  public async preload(entityLike: DeepPartial<T>): Promise<T> {
    return await this.entity.preload(entityLike);
  }
}
