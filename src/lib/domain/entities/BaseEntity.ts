/**
 * Base entity for all domain entities
 */
export abstract class BaseEntity {
  constructor(
    public readonly id: string,
    public readonly created: string,
    public readonly updated: string
  ) {}

  equals(entity: BaseEntity): boolean {
    return this.id === entity.id;
  }

  getAge(): number {
    return Date.now() - new Date(this.created).getTime();
  }
}