export interface Page<T> {
  data: T[];
  meta: {
    total: number;
    limit: number;
    offset: number;
  };
}
