import { Injectable } from "@nestjs/common";

/**
 * BaseService
 *
 * @description This class will be used as a middleware between the database and our code logic
 */
@Injectable()
export class BaseService {
  /**
   * Sequelize Schema Model
   */
  protected model: any;

  /**
   *
   * @param {any} model SequelizeSchemaModel
   */
  constructor(model: any) {
    this.model = model;
  }

  /**
   * Find one record by condition
   *
   * @param {any} condition
   * @returns {any}
   */
  public findOne(
    condition: any,
    include?: any,
    attributes?: any,
    order?: any,
    group?: any,
  ): any {
    return this.model.findOne({
      where: condition,
      include: include,
      attributes: attributes,
      order: order,
      group: group,
    });
  }

  /**
   * Find one record by id
   *
   * @param {number} id
   * @returns {any}
   */
  public findOneById(
    id: number | string,
    include?: any,
    attributes?: any,
    order?: any,
    group?: any,
  ): any {
    return this.findOne({ id: id }, include, attributes, order, group);
  }

  /**
   * Find or create
   *
   * @param {any} condition
   * @param {any} fields
   * @returns {any}
   */
  public findOrCreate(condition: any, fields: any): any {
    return this.model.findOrCreate({ where: condition, defaults: fields });
  }

  /**
   * Find all by condition
   *
   * @param {any} condition
   * @returns {any}
   */
  public findAll(
    condition: any,
    include?: any,
    attributes?: any,
    order?: any,
    offset?: any,
    limit?: any,
    group?: any,
  ): any {
    return this.model.findAll({
      where: condition,
      order: order,
      include: include,
      attributes: attributes,
      offset: offset,
      limit: limit,
      group: group,
    });
  }

  /**
   * Find and count all by condition
   * @param {any} condition
   * @returns {any}
   */
  public findAndCountAll(condition: any): any {
    return this.model.findAndCountAll({ where: condition });
  }

  /**
   * Create new record.
   *
   * @param {any} fields
   * @returns {any}
   */
  public create(fields: any, userId?: number): any {
    if (userId) {
      fields.createdBy = userId;
    }

    return this.model.create(fields);
  }

  /**
   * Bulk Create.
   * @description TO insert data in bulk in table
   * @param {Array<any>} fieldsRecord Array of any
   * @returns {any}
   */
  public bulkCreate(fieldsRecord: any[], userId?: number): any {
    if (userId) {
      for (let index = 0; index < fieldsRecord.length; index++) {
        const fields = fieldsRecord[index];

        fields.createdBy = userId;
      }
    }

    return this.model.bulkCreate(fieldsRecord);
  }

  /**
   * Update record(s) by condition;
   *
   * @param {any} condition
   * @param {any} updatedFields any
   * @returns {any}
   */
  public updateAll(condition: any, updatedFields: any, userId?: number): any {
    if (userId) {
      updatedFields.updatedBy = userId;
    }

    return this.model.update(updatedFields, { where: condition });
  }

  public async updateOne(
    condition: any,
    updatedFields: any,
    userId?: number,
  ): Promise<any> {
    if (userId) {
      updatedFields.updatedBy = userId;
    }

    const updateRecord = await this.model.update(updatedFields, {
      where: condition,
    });

    return updateRecord[0];
  }

  /**
   * Update one record by id
   * @param {number} id
   * @param {any} fields
   * @returns {any}
   */
  public updateById(id: number, fields: any, userId?: number): any {
    return this.updateOne({ id: id }, fields, userId);
  }

  /**
   * Delete record(s) by condition
   * @param {any} condition
   * @returns {any}
   */
  public delete(condition: any): any {
    return this.model.destroy({ where: condition });
  }

  /**
   * Delete one record by id (primary key)
   * @param {number} id
   * @returns {any}
   */
  public deleteById(id: number): any {
    return this.delete({ id: id });
  }

  /**
   * Count record by condition
   * @param {any} condition
   * @returns {any}
   */
  public count(condition: any): any {
    return this.model.count({ where: condition });
  }
}
