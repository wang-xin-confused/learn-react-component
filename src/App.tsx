import React from 'react';
import Button from './components/Button';

import Menu from './components/Menu/menu';
import MenuItem from './components/Menu/menuItem';
import SubMenu from './components/Menu/subMenu';

function App() {
  return (
    <div className="App" style={{ margin: 20 }}>
      <Button className='custom'>Hello</Button>
      <Button disabled>disabled button</Button>
      <Button btnType='primary'>primary </Button>
      <Button btnType="danger" size="lg"> danger button </Button>
      <Button btnType="link" href="https://baidu.com" target="_black"> link button </Button>
      <Button btnType="link" href="https://google.com" disabled> link button </Button>

      <Menu defaultIndex='0' onSelect={(index) => { alert(index) }} mode='vertical' defaultOpenSubMenus={['3']}>
        {/* <Menu defaultIndex='0' onSelect={(index) => { alert(index) }} > */}
        <MenuItem >
          cool link
        </MenuItem>
        <MenuItem disabled>
          disabled
        </MenuItem>
        <MenuItem>
          cool link 2
        </MenuItem>
        <SubMenu title='dropdown'>
          <MenuItem>
            dropdown 1
          </MenuItem>
          <MenuItem>
            dropdown 2
          </MenuItem>
          <MenuItem>
            dropdown 2
          </MenuItem>
        </SubMenu>
        <MenuItem>
          cool link 4
        </MenuItem>
      </Menu>
      {/* <header className="App-header">
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}
    </div>
  );
}

export default App;
