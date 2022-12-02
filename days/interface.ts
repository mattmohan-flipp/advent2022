export type DayHalfFunc = (file: string) => string;
export interface day {
  a: DayHalfFunc;
  b: DayHalfFunc;
}
