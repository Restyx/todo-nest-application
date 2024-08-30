import {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
} from 'typeorm';

export interface BaseInterfaceRepository<T> {
  create(data: DeepPartial<T>): T;
  createMany(data: DeepPartial<T>[]): T[];
  save(data: DeepPartial<T>): Promise<T>;
  saveMany(data: DeepPartial<T>[]): Promise<T[]>;

  findOneById(id: any): Promise<T>;
  findByCondition(filteredCondition: FindOneOptions<T>): Promise<T>;
  findWithRelations(relations: FindManyOptions<T>): Promise<T[]>;
  findAll(options?: FindManyOptions<T>): Promise<T[]>;

  preload(entityLike: DeepPartial<T>): Promise<T>;

  remove(entity: T): Promise<T>;
}
