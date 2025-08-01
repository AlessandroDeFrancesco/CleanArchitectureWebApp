export interface RouterService {
  goTo(path: string): Promise<void>;
}