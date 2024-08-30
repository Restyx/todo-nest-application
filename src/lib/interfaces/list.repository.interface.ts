import { ListEntity } from 'src/lib/entities/list.entity';
import { BaseInterfaceRepository } from 'src/lib/repositories/base/base.interface.repository';

export interface ListReposityInterface
  extends BaseInterfaceRepository<ListEntity> {
  updatePositions(list: ListEntity, destination: number): Promise<void>;
}
