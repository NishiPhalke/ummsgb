import React from 'react';
import { Menu, Button, MenuMenuProps } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { Item } from '../config/types';
import { MainMenuProps } from './types';

const MenuContent: React.FC<MenuMenuProps> = (props) => (
    <>
        {props.items.map((item: Item) => (
            <Menu.Item as={Link} to={item.href} name={item.name} key={item.name} active={item.name === props.active} />
        ))}
        <Menu.Item position="right">
            <Button inverted>Log In</Button>&nbsp;
            <Button inverted>Sign Up</Button>
        </Menu.Item>
    </>
);

const MainMenu: React.FC<MainMenuProps> = (props) => (
    <Menu pointing secondary inverted>
        <MenuContent items={props.items} active={props.active} />
    </Menu>
);
export default MainMenu;
