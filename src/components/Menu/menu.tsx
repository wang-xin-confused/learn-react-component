import React, { FC, useState, createContext, CSSProperties } from "react";
import classNames from "classnames";
// 引入item interface
import { MenuItemProps } from './menuItem'

type MenuMode = 'horizontal' | 'vertical' // vertical 垂直
type SelectCallBack = (selectedIndex: string) => void

export interface MenuProps {
  /**默认 active 的菜单项的索引值 */
  defaultIndex?: string;
  className?: string;
  /**菜单类型 横向或者纵向 */
  mode?: MenuMode;
  style?: CSSProperties;
  /**点击菜单项触发的回掉函数 */
  onSelect?: SelectCallBack;
  /**设置子菜单的默认打开 只在纵向模式下生效 */
  defaultOpenSubMenus?: string[];
}

// menu的context
interface IMenuContext {
  index: string;
  onSelect?: SelectCallBack;
  mode?: MenuMode;
  defaultOpenSubMenus?: string[];
}


//创建一个context 想有提示的话就把泛型传进去
export const MenuContext = createContext<IMenuContext>({ index: '0' })


export const Menu: FC<MenuProps> = (props) => {
  const { className, mode, style, children, defaultIndex, onSelect, defaultOpenSubMenus } = props

  const [currentActive, setActive] = useState(defaultIndex)

  const classes = classNames('viking-menu', className, {
    'menu-vertical': mode === 'vertical',
    'menu-horizontal': mode !== 'vertical',
  })

  const handleClick = (index: string) => {
    setActive(index)
    // 有则调用父组件函数
    if (onSelect) {
      onSelect(index)
    }
  }

  // 传递给子组件的值
  const passedContext: IMenuContext = {
    index: currentActive ? currentActive : '0',
    onSelect: handleClick,
    mode,
    defaultOpenSubMenus,
  }

  // 不直接遍历children 因为children是什么结构并不一定 可能是个arr obj fun 调用map就报错
  // 使用React提供的api 会跳过不合格的数据结构 生成dom结构
  // 往生成的dom对象上混入一些属性 使用cloneElement方法
  const renderChildren = () => {
    return React.Children.map(children, (child, index) => {
      // 这里是因为失去了类型  需要类型断言一下 是一个组件实例dom元素(生成了dom结构了理解为)
      const childElement = child as React.FunctionComponentElement<MenuItemProps>
      // 获取添加在menuItem上的静态属性
      const { displayName } = childElement.type
      // 在满足这两个条件下才进行添加到dom结构中去
      if (displayName === 'MenuItem' || displayName === 'SubMenu') {
        // 往每个chile的dom对象中混入index属性 用于active 选中项
        return React.cloneElement(childElement, {
          index: index.toString() // 因为index 是num 类型 需要转成 str类型
        })
      } else {
        console.error("Warning: Menu has a child which is not a MenuItem component")
      }
    })
  }

  return (
    <ul className={classes} style={style} data-testid="test-menu">
      {/* 注入到子组件中 */}
      <MenuContext.Provider value={passedContext}>
        {/* {children} */}
        {renderChildren()}
      </MenuContext.Provider>
    </ul>
  )
}

Menu.defaultProps = {
  defaultIndex: '0',
  mode: 'horizontal',
  defaultOpenSubMenus: [],
}

export default Menu;