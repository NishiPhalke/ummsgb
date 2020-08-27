import { MenuItems } from './types';

export const mainMenuItems: MenuItems = {
    items: [
        {
            name: 'Home',
            href: '/',
        },
        {
            name: 'About',
            href: '/about',
        },
        {
            name: 'Biologists',
            href: '/biologists',
        },
        {
            name: 'Developers',
            href: '/developers',
        },
    ],
    defaultActive: 'Home',
};
