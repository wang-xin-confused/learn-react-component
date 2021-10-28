import React, { useContext } from 'react'
import classNames from 'classnames'
// context的Interface
import { MenuContext } from './menu'

export interface MenuItemProps {
  index?: string; // 与父组件defaultIndex 作比较
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const MenuItem: React.FC<MenuItemProps> = (props) => {
  const { index, disabled, className, style, children } = props

  // 使用父组件注入的context
  const context = useContext(MenuContext)

  const classes = classNames('menu-item', className, {
    'is-disabled': disabled,
    'is-active': context.index === index // 高亮
  })
  // item组件自身触发的click事件  
  const handleClick = () => {
    // 当 父组件有onselect方法 && 当前item不是disabled 时 调用父组件方法
    if (context.onSelect && !disabled && (typeof index === 'string')) {
      context.onSelect(index)
    }
  }
  return (
    <li className={classes} style={style} onClick={handleClick}>
      {children}
    </li>
  )
}

// 会在menuItem.type 上添加一些静态属性
MenuItem.displayName = 'MenuItem'
export default MenuItem