
export type PageSize = 'A4' | 'A3' | 'Letter';
export type Orientation = 'Portrait' | 'Landscape';

export interface GridState {
  imageSrc: string | null;
  imageWidth: number;
  imageHeight: number;
  rows: number;
  columns: number;
  pageSize: PageSize;
  orientation: Orientation;
  maintainAspectRatio: boolean;
}

export interface PageDimensions {
  width: number;
  height: number;
}
