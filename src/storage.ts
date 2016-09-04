export interface Storage {
  clear(): void;
  getItem(key: string): string | null;
  key(index: number): string | null;
  readonly length: number;
  removeItem(key: string): void;
  setItem(key: string, data: string): void;
}
