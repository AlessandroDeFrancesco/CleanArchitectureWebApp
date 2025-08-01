export class ItemEntity {
  public id: string;
  public name: string;
  public description: string;
  public createdAt: Date;
  public modifiedAt: Date;
  public imageIds: string[];

  constructor(id: string, name: string, description:string, createdAt: Date, modifiedAt: Date, imageIds: string[]) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.createdAt = createdAt;
    this.modifiedAt = modifiedAt;
    this.imageIds = imageIds;
  }
}
