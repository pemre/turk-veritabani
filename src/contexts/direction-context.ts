import { createContext, useContext } from 'react';

// @ts-ignore
import type { Direction } from 'react-data-grid';

export const DirectionContext = createContext<Direction>('ltr');

export function useDirection(): Direction {
    return useContext(DirectionContext);
}
