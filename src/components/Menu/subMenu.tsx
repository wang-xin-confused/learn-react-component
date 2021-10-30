import React, { useContext, useState, FunctionComponentElement } from 'react'
import classNames from 'classnames'

import { MenuContext } from './menu'

import { MenuItemProps } from './menuItem'

import Icon from '../Icon/icon'
import Transition from '../Transition/transition'


export interface SubMenuProps {
  index?: string;
  title: string;
  className?: string;
}

const SubMenu: React.FC<SubMenuProps> = ({ index, title, children, className }) => {

  const context = useContext(MenuContext)
  // 因为要调用数组的方法 断言成数组
  const openedSubMenus = context.defaultOpenSubMenus as Array<string>
  // 判断是否展开
  const isOpend = (index && context.mode === 'vertical') ? openedSubMenus.includes(index) : false
  const [menuOpen, setOpen] = useState(isOpend)

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    setOpen(!menuOpen)
  }
  let timer: any
  const handleMouse = (e: React.MouseEvent, toggle: boolean) => {
    clearTimeout(timer)
    e.preventDefault()
    timer = setTimeout(() => {
      setOpen(toggle)
    }, 300)
  }

  const clickEvents = context.mode === 'vertical' ? {
    onClick: handleClick
  } : {}
  const hoverEvents = context.mode !== 'vertical' ? {
    onMouseEnter: (e: React.MouseEvent) => { handleMouse(e, true) },
    onMouseLeave: (e: React.MouseEvent) => { handleMouse(e, false) }
  } : {}



  const classes = classNames('menu-item submenu-item', className, {
    'is-active': context.index === index,
    'is-opened': menuOpen, // 用来控制展开时的样式 设置css权重
    'is-vertical': context.mode === 'vertical'
  })

  const renderChildren = () => {
    const subMenuClasses = classNames('viking-submenu', {
      'menu-opened': menuOpen // 添加这个class 就会显示dropdown
    })

    const childrenComponent = React.Children.map(children, (child, i) => {
      const childElement = child as FunctionComponentElement<MenuItemProps>
      if (childElement.type.displayName === 'MenuItem') {
        return React.cloneElement(childElement, {
          index: `${index}-${i}`
        })
      } else {
        console.error("Warning: SubMenu has a child which is not a MenuItem component")
      }
    })
    return (
      <Transition
        in={menuOpen}
        timeout={300}
        animation="zoom-in-top"
      >
        <ul className={subMenuClasses}>
          {childrenComponent}
        </ul>
      </Transition >
    )
  }

  return (
    <li key={index} className={classes} {...hoverEvents}>
      <div className="submenu-title" {...clickEvents}>
        {title}
        <Icon icon="angle-down" className="arrow-icon" />
      </div>
      {renderChildren()}
    </li>
  )
}

SubMenu.displayName = 'SubMenu'
export default SubMenu