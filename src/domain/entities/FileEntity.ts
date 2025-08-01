export class FileEntity {
  public id: string;
  public name: string;
  public mimeType: string;
  public createdAt: Date;
  public content: string;
 
  constructor(id: string, name: string, mimeType: string, createdAt: Date, content:string) {
    this.id = id;
    this.name = name;
    this.mimeType = mimeType;
    this.createdAt = createdAt;
    this.content = content;
  }
}
