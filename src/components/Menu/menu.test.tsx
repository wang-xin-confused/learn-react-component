import React from 'react'
import { render, RenderResult, fireEvent, waitFor, cleanup } from '@testing-library/react'
//  组件
import Menu, { MenuProps } from './menu'
import MenuItem from './menuItem'
import SubMenu from './subMenu'

jest.mock('../Icon/icon', () => {
  return () => {
    return <i className="fa" />
  }
})
jest.mock('react-transition-group', () => {
  return {
    CSSTransition: (props: any) => {
      return props.children
    }
  }
})

const testProps: MenuProps = {
  defaultIndex: '0',
  onSelect: jest.fn(),
  className: 'test'
}
const testVerProps: MenuProps = {
  defaultIndex: '0',
  mode: 'vertical',
  defaultOpenSubMenus: ['4']
}
const generateMenu = (props: MenuProps) => {
  return (
    <Menu {...props}>
      <MenuItem>
        active
      </MenuItem>
      <MenuItem disabled>
        disabled
      </MenuItem>
      <MenuItem>
        xyz
      </MenuItem>
      <SubMenu title="dropdown">
        <MenuItem>
          drop1
        </MenuItem>
      </SubMenu>
      <SubMenu title="opened">
        <MenuItem>
          opened1
        </MenuItem>
      </SubMenu>
    </Menu>
  )
}

const createStyleFile = () => {
  const cssFile: string = `
    .viking-submenu {
      display: none;
    }
    .viking-submenu.menu-opened {
      display:block;
    }
  `
  const style = document.createElement('style')
  style.type = 'text/css'
  style.innerHTML = cssFile
  return style
}



let wrapper: RenderResult, wrapper2: RenderResult, menuElement: HTMLElement, activeElement: HTMLElement, disabledElement: HTMLElement
describe('test Menu and MenuItem component in default(horizontal) mode', () => {
  beforeEach(() => {
    wrapper = render(generateMenu(testProps))
    // 插入style节点
    wrapper.container.append(createStyleFile())
    menuElement = wrapper.getByTestId('test-menu')
    activeElement = wrapper.getByText('active')
    disabledElement = wrapper.getByText('disabled')
  })
  it('should render correct Menu and MenuItem based on default props', () => {
    expect(menuElement).toBeInTheDocument()
    expect(menuElement).toHaveClass('viking-menu test')
    // 以为添加了submenu 节点 getElementsByTagName 会抓取节点下所有的li标签 
    // expect(menuElement.getElementsByTagName('li').length).toEqual(3)
    // :scope 表示当前元素
    expect(menuElement.querySelectorAll(':scope > li').length).toEqual(5)
    expect(activeElement).toHaveClass('menu-item is-active')
    expect(disabledElement).toHaveClass('menu-item is-disabled')
  })
  it('click items should change active and call the right callback', () => {
    const thirdItem = wrapper.getByText('xyz')
    fireEvent.click(thirdItem)
    expect(thirdItem).toHaveClass('is-active')
    expect(activeElement).not.toHaveClass('is-active')
    expect(testProps.onSelect).toHaveBeenCalledWith('2')
    fireEvent.click(disabledElement)
    expect(disabledElement).not.toHaveClass('is-active')
    expect(testProps.onSelect).not.toHaveBeenCalledWith('1')
  })

  it('should render vertical mode when mode is set to vertical', () => {
    cleanup()
    wrapper2 = render(generateMenu(testVerProps))
    const menuElement = wrapper2.getByTestId('test-menu')
    expect(menuElement).toHaveClass('menu-vertical')
  })

  // 使用async 可以test 异步操作
  it('should show dropdown items when hover on subMenu', async () => {

    // queryByText 与getByText 区别就是会返回element 或者 null  与getByText找到的话返回目标元素,找不到直接test报错 断言失败了
    expect(wrapper.queryByText('drop1')).not.toBeVisible() // 不出现
    const dropdownElement = wrapper.getByText('dropdown') // 获取到dropdown文本的元素
    fireEvent.mouseEnter(dropdownElement) // 鼠标事件
    // 因为移入组件中有setTimeout 操作 await 会被重复执行 或者timeout 报错
    await waitFor(() => {
      expect(wrapper.queryByText('drop1')).toBeVisible()
    })
    // query 会返回htmlElement | null 联合类型 ts 会报类型错误 因为wrapper是对象不能.null
    // fireEvent.click(wrapper.queryByText('drop1'))
    fireEvent.click(wrapper.getByText('drop1'))// getbytext 只会返回htmlElement 类型
    expect(testProps.onSelect).toHaveBeenCalledWith('3-0')
    // 鼠标离开 drop 消失
    fireEvent.mouseLeave(dropdownElement)
    await waitFor(() => {
      expect(wrapper.queryByText('drop1')).not.toBeVisible()
    })
  })


})