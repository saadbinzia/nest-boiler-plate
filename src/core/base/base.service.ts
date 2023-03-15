import { Injectable } from '@nestjs/common';


/**
 * BaseService
 */
@Injectable()
export class BaseService {

  /**
   * Sequelize Schema Model
   */
  protected model: any;

  /**
   * 
   * @param model SequelizeSchemaModel
   */
  constructor(model: any) {
    this.model = model;
  }

  /**
   * Find one record by condition
   *
   * @param condition any
   * @param include any
   * @param attributes any
   * @param order any
   * @returns Model
   */
  public findOne(condition: any, include?: any, attributes?: any, order?: any,) {
    return this.model.findOne({
      where: condition,
      include: include,
      attributes: attributes,
      order: order
    },);
  }

  /**
   * Find one record by id
   *
   * @param id number
   * @param include any
   * @param attributes any
   * @param order any
   * @returns Model
   */
  public findOneById(id: number, include?: any, attributes?: any, order?: any,) {
    return this.findOne({ id: id }, include, attributes, order);
  }

  /**
   * Find or create 
   *
   * @param condition any
   * @param fields any
   * @returns Model
   */
  public findOrCreate(condition: any, fields: any) {
    return this.model.findOrCreate({ where: condition, defaults: fields });
  }

  /**
   * Find all by condition
   *
   * @param condition any
   * @param order any
   * @param include any
   * @param attributes any
   * @param offset any
   * @param limit any
   * @returns Model
   */
  public findAll(condition: any, sortOrder?: any, include?: any, attributes?: any, offset?: any, limit?: any) {
    return this.model.findAll({
      where: condition,
      order: sortOrder,
      include: include,
      attributes: attributes,
      offset: offset,
      limit: limit,
    });
  }

  /**
   * Count record by condition
   * @param condition any
   * @returns 
   */
  public count(condition: any) {
    return this.model.count({ where: condition });
  }

  /**
   * Find and count all by condition
   * @param condition any
   * @returns Model
   */
  public findAndCountAll(condition: any) {
    return this.model.findAndCountAll({ where: condition });
  }

  /**
   * Create new record.
   *
   * @param fields any
   * @returns Model
   */
  public create(fields: any) {
    return this.model.create(fields);
  }

  /**
   * Update record(s) by condition;
   *
   * @param condition any
   * @param fields any
   * @returns array
   */
  public update(condition: any, fields: any) {
    return this.model.update(fields, { where: condition })
  }

  /**
   * Update record(s) by condition;
   *
   * @param condition any
   * @param fields any
   * @returns object
   */
  public updateOne(condition: any, fields: any) {
    return this.model.updateOne(fields, { where: condition })
  }

  /**
   * Update one record by id
   * @param id number
   * @param fields any
   * @returns object
   */
  public updateById(id: number, fields: any) {
    return this.updateOne({ id: id }, fields);
  }

  /**
   * Delete record(s) by condition
   * @param condition any
   * @returns 
   */
  public delete(condition: any) {
    return this.model.destroy({ where: condition })
  }

  /**
   * Delete one record by id (primary key)
   * @param id number
   * @returns 
   */
  public deleteById(id: number) {
    return this.delete({ id: id });
  }
}
