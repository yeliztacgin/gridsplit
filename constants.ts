
import { PageSize, PageDimensions } from './types';

// Dimensions in mm (Portrait base)
export const PAGE_DIMENSIONS: Record<PageSize, PageDimensions> = {
  'A4': { width: 210, height: 297 },
  'A3': { width: 297, height: 420 },
  'Letter': { width: 215.9, height: 279.4 }
};
