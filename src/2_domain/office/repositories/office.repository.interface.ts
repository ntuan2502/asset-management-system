import { OfficeAggregate } from '../aggregates/office.aggregate';

export interface PaginatedOffices {
  nodes: OfficeAggregate[];
  meta: { totalCount: number; page: number; limit: number };
}

export const OFFICE_REPOSITORY = 'OFFICE_REPOSITORY';
export interface IOfficeRepository {
  isDuplicate(data: {
    internationalName: string;
    shortName: string;
    taxCode: string;
  }): Promise<boolean>;
  findById(id: string): Promise<OfficeAggregate | null>;
  findAll(args: { page: number; limit: number }): Promise<PaginatedOffices>;
}
