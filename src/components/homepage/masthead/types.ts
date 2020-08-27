import { Item } from '../config/types';

export type MainMastheadProps = {
    children: any;
};

export type MenuContentProps = {
    items: Item[];
    active: string;
};

export type MainMenuProps = {
    items: Item[];
    active: string;
};
