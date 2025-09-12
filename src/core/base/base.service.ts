import { Injectable, NotFoundException } from "@nestjs/common";
import {
  BulkCreateOptions,
  CountOptions,
  CreateOptions,
  DestroyOptions,
  FindAndCountOptions,
  FindOptions,
  FindOrCreateOptions,
  Model,
  ModelStatic,
  Transaction,
  UpdateOptions,
  WhereOptions,
} from "sequelize";
import { Request } from "express";
import { AuthenticatedRequest } from "../config/interface/request.interface";

/**
 * BaseService
 *
 * @description This class serves as a base service providing common database operations
 * @template T - The model type extending from Sequelize Model
 */
@Injectable()
export class BaseService<T extends Model> {
  /**
   * Sequelize Model
   */
  protected model: ModelStatic<T>;

  constructor(model: ModelStatic<T>) {
    this.model = model;
  }

  /**
   * Find one record by condition
   * @param {WhereOptions} condition - The where clause for the query
   * @param {Omit<FindOptions, 'where'>} options - Additional query options
   * @returns {Promise<T | null>} The found record or null if not found
   */
  public async findOne(
    req: Request | AuthenticatedRequest,
    condition: WhereOptions,
    options: Omit<FindOptions, "where"> = {},
  ): Promise<T | null> {
    return this.model.findOne({
      where: condition,
      ...options,
    });
  }

  /**
   * Find one record by primary key
   * @param {string | number} id - The primary key value
   * @param {Omit<FindOptions, 'where'>} options - Additional query options
   * @returns {Promise<T>} The found record
   * @throws {NotFoundException} When record is not found
   */
  public async findOneById(
    req: Request | AuthenticatedRequest,
    id: string | number,
    options: Omit<FindOptions, "where"> = {},
  ): Promise<T> {
    const record = await this.model.findByPk(id, options);
    if (!record) {
      throw new NotFoundException(`${this.model.name} with id ${id} not found`);
    }
    return record;
  }

  /**
   * Find or create a record
   * @param {WhereOptions} condition - The where clause to find the record
   * @param {Partial<T>} defaults - Default values if creating a new record
   * @param {FindOrCreateOptions} options - Additional options
   * @returns {Promise<[T, boolean]>} A tuple of the instance and whether it was created
   */
  public async findOrCreate(
    req: Request | AuthenticatedRequest,
    condition: WhereOptions,
    defaults: Partial<T>,
    options: FindOrCreateOptions = {},
  ): Promise<[T, boolean]> {
    return this.model.findOrCreate({
      where: condition,
      defaults: defaults as any,
      ...options,
    });
  }

  /**
   * Find all records matching the condition
   * @param {WhereOptions} condition - The where clause for the query
   * @param {Omit<FindOptions, 'where'>} options - Additional query options
   * @returns {Promise<T[]>} Array of found records
   */
  public async findAll(
    req: Request | AuthenticatedRequest,
    condition: WhereOptions = {},
    options: Omit<FindOptions, "where"> = {},
  ): Promise<T[]> {
    return this.model.findAll({
      where: condition,
      ...options,
    });
  }

  /**
   * Find and count all records matching the condition with pagination
   * @param {WhereOptions} condition - The where clause for the query
   * @param {Omit<FindAndCountOptions, 'where'>} options - Additional query options
   * @returns {Promise<{count: number; rows: T[]}>} Object containing count and array of records
   */
  public async findAndCountAll(
    req: Request | AuthenticatedRequest,
    condition: WhereOptions = {},
    options: Omit<FindAndCountOptions, "where"> = {},
  ): Promise<{ count: number; rows: T[] }> {
    return this.model.findAndCountAll({
      where: condition,
      ...options,
    });
  }

  /**
   * Create a new record
   * @param {MakeNullishOptional<T["_creationAttributes"]>} data - The data to create
   * @param {CreateOptions} options - Additional create options
   * @returns {Promise<T>} The created record
   */
  public async create(
    req: Request | AuthenticatedRequest,
    data: T["_creationAttributes"] | any,
    options: CreateOptions = {},
  ): Promise<T> {
    // Ensure plain object so fields like email are preserved
    const plain =
      data && typeof (data as any).get === 'function'
        ? (data as any).get({ plain: true })
        : { ...(data as any) };
  
    return this.model.create(plain as any, options);
  }

  /**
   * Bulk create records
   * @param {Partial<T>[]} records - Array of records to create
   * @param {BulkCreateOptions} options - Bulk create options
   * @returns {Promise<T[]>} Array of created records
   */
  public async bulkCreate(
    req: Request | AuthenticatedRequest,
    records: Partial<T>[],
    options: BulkCreateOptions = {},
  ): Promise<T[]> {
    return this.model.bulkCreate(records as any[], options);
  }

  /**
   * Update records matching the condition
   * @param {WhereOptions} condition - The where clause to match records
   * @param {Partial<T>} data - The data to update
   * @param {Omit<UpdateOptions, 'returning' | 'where'>} options - Update options
   * @returns {Promise<[number, T[]]>} Tuple of number of affected rows and updated records
   */
  public async update(
    req: Request | AuthenticatedRequest,
    condition: WhereOptions,
    data: Partial<T>,
    options: Omit<UpdateOptions, "returning" | "where"> = {},
  ): Promise<[number, T[]]> {
    const [affectedCount, affectedRows] = await this.model.update(data, {
      where: condition,
      returning: true,
      ...options,
    });
    return [affectedCount, affectedRows as T[]];
  }

  /**
   * Update a record by primary key
   * @param {string | number} id - The primary key value
   * @param {Partial<T>} data - The data to update
   * @param {Omit<UpdateOptions, 'returning' | 'where'>} options - Update options
   * @returns {Promise<[number, T[]]>} Tuple of number of affected rows and updated records
   */
  public async updateById(
    req: Request | AuthenticatedRequest,
    id: string | number,
    data: Partial<T>,
    options: Omit<UpdateOptions, "returning" | "where"> = {},
  ): Promise<[number, T[]]> {
    return this.update(req, { id } as any, data, options);
  }

  /**
   * Delete records matching the condition
   * @param {WhereOptions} condition - The where clause to match records
   * @param {Omit<DestroyOptions, 'where'>} options - Delete options
   * @returns {Promise<number>} Number of deleted records
   */
  public async delete(
    req: Request | AuthenticatedRequest,
    condition: WhereOptions,
    options: Omit<DestroyOptions, "where"> = {},
  ): Promise<number> {
    return this.model.destroy({
      where: condition,
      ...options,
    });
  }

  /**
   * Delete a record by primary key
   * @param {string | number} id - The primary key value
   * @param {Omit<DestroyOptions, 'where'>} options - Delete options
   * @returns {Promise<number>} Number of deleted records
   */
  public async deleteById(
    req: Request | AuthenticatedRequest,
    id: string | number,
    options: Omit<DestroyOptions, "where"> = {},
  ): Promise<number> {
    return this.delete(req, { id } as any, options);
  }

  /**
   * Count records matching the condition
   * @param {WhereOptions} condition - The where clause to count records
   * @param {Omit<CountOptions, 'where'>} options - Count options
   * @returns {Promise<number>} Number of matching records
   */
  public async count(
    req: Request | AuthenticatedRequest,
    condition: WhereOptions = {},
    options: Omit<CountOptions, "where"> = {},
  ): Promise<number> {
    return this.model.count({
      where: condition,
      ...options,
    });
  }

  /**
   * Paginate through records
   * @param {WhereOptions} condition - The where clause for the query
   * @param {number} page - Page number (1-based)
   * @param {number} limit - Number of records per page
   * @param {Omit<FindOptions, 'limit' | 'offset' | 'where'>} options - Additional query options
   * @returns {Promise<{data: T[]; meta: {total: number; page: number; limit: number; pages: number}}>} Paginated result
   */
  public async paginate(
    req: Request | AuthenticatedRequest,
    condition: WhereOptions = {},
    page: number = 1,
    limit: number = 10,
    options: Omit<FindOptions, "limit" | "offset" | "where"> = {},
  ): Promise<{
    data: T[];
    meta: { total: number; page: number; limit: number; pages: number };
  }> {
    const offset = (page - 1) * limit;
    const { count, rows } = await this.findAndCountAll(req, condition, {
      ...options,
      limit,
      offset,
    });

    return {
      data: rows,
      meta: {
        total: count,
        page,
        limit,
        pages: Math.ceil(count / limit),
      },
    };
  }

  /**
   * Execute operations within a transaction
   * @param {Function} callback - Callback function that receives a transaction
   * @returns {Promise<U>} The result of the callback
   */
  public async transaction<U>(
    req: Request | AuthenticatedRequest,
    callback: (t: Transaction) => PromiseLike<U>,
  ): Promise<U> {
    return this.model.sequelize.transaction(callback);
  }
}
