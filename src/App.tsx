import React, { useState } from 'react';

import { Hello, LikeButton, UseEffectLearn1, UseEffectLearn2, UseEffectLearn3 } from './components/react-learn';

import Button from './components/Button';

import Menu from './components/Menu/menu';
import MenuItem from './components/Menu/menuItem';
import SubMenu from './components/Menu/subMenu';

import Icon from './components/Icon/icon';

import { library } from '@fortawesome/fontawesome-svg-core'
import { fas } from '@fortawesome/free-solid-svg-icons'

import Transition from './components/Transition/transition'

import Input from './components/Input/input'




library.add(fas)

function App() {

  const [show, setShow] = useState(false)
  const [UseEffectLearn3show, setUseEffectLearn3Show] = useState(true)

  return (
    <div className="App" style={{ margin: 20 }}>


      <Hello />
      {/* <LikeButton /> */}
      {/* <UseEffectLearn1 /> */}
      {/* <UseEffectLearn2 /> */}
      {/* {UseEffectLearn3show && <UseEffectLearn3 />}
      <p>
        <button onClick={() => { setUseEffectLearn3Show(!UseEffectLearn3show) }}>toggle</button>
      </p> */}
      <Input
        style={{ width: '300px' }}
        placeholder="input with icon"
        icon="search"
      />
      <Icon icon='arrow-down' theme="danger" size="10x" />
      <Button className='custom'>Hello</Button>
      <Button disabled>disabled button</Button>
      <Button btnType='primary'>primary </Button>
      <Button btnType="danger" size="lg"> danger button </Button>
      <Button btnType="link" href="https://baidu.com" target="_black"> link button </Button>
      <Button btnType="link" href="https://google.com" disabled> link button </Button>

      <Menu defaultIndex='0' onSelect={(index) => { alert(index) }} defaultOpenSubMenus={['3']}>
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
      <Button size="lg" onClick={() => { setShow(!show) }}>toggle</Button>

      <Transition
        timeout={300}
        animation="zoom-in-left"
        in={show}
      >
        <header className="App-header">
          <p>Edit <code>src/App.tsx</code> and save to reload. </p>
          <p>Edit <code>src/App.tsx</code> and save to reload. </p>
        </header>
      </Transition>
      <Transition
        timeout={300}
        animation="zoom-in-left"
        in={show}
        wrapper
      >
        <Button size="lg" btnType="primary">button</Button>
      </Transition>
    </div>
  );
}

export default App;
