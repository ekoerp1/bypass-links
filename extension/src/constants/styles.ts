import { SxProps } from '@mui/system';
import { BG_COLOR_DARK } from './color';

export const PANEL_SIZE = {
  width: 792,
  height: 540,
};

export const PANEL_DIMENSIONS_PX = {
  width: `${PANEL_SIZE.width}px`,
  height: `${PANEL_SIZE.height}px`,
};

export const PERSON_SIZE = {
  width: 156,
  height: 156,
};

export const STICKY_HEADER = {
  position: 'sticky',
  top: 0,
  zIndex: 2,
  backgroundColor: BG_COLOR_DARK,
} as SxProps;
