import React, { FC, useState, ChangeEvent, KeyboardEvent, ReactElement, useEffect, useRef } from 'react'
import classNames from 'classnames'
import Input, { InputProps } from '../Input/input'
import Icon from '../Icon/icon'
import Transition from '../Transition/transition'
import useDebounce from '../../hooks/useDebounce'
import useClickOutside from '../../hooks/useClickOutside'
interface DataSourceObject {
  value: string;
}

//* 使用泛型 在传入的时候才知道别的类型
export type DataSourceType<T = {}> = T & DataSourceObject

//*  因为InputProps 中也定义了onSelect  使用Omit忽略掉这个冲突
export interface AutoCompleteProps extends Omit<InputProps, 'onSelect'> {
  fetchSuggestions: (str: string) => DataSourceType[] | Promise<DataSourceType[]>;
  onSelect?: (item: DataSourceType) => void;
  renderOption?: (item: DataSourceType) => ReactElement;
}

export const AutoComplete: FC<AutoCompleteProps> = (props) => {
  const {
    fetchSuggestions,
    onSelect,
    value,
    renderOption,
    ...restProps
  } = props

  // *input 输入的值
  const [ inputValue, setInputValue ] = useState(value as string)
  // *推荐的数组
  const [ suggestions, setSugestions ] = useState<DataSourceType[]>([])
  // *控制loading状态
  const [ loading, setLoading ] = useState(false)
  // *控制展开与收起
  const [ showDropdown, setShowDropdown] = useState(false)
  // *控制选中item的样式
  const [ highlightIndex, setHighlightIndex] = useState(-1)
  // *控制在onchange的时候触发渲染  在onselect 的时候不触发第二次渲染
  const triggerSearch = useRef(false)
  // *获取到dom的结构
  const componentRef = useRef<HTMLDivElement>(null)
  // *防抖 通过这个返回值的变化触发视图更新
  const debouncedValue = useDebounce(inputValue, 300)
  // *点击外部关闭弹窗的钩子
  useClickOutside(componentRef, () => { setSugestions([])})

  // 副作用
  useEffect(() => {
    // 在debouncedValue存在的情况与triggerSearch.current为true的情况下才请求新的数据
    if (debouncedValue && triggerSearch.current) {
      setSugestions([]) // 清空推介列表
      const results = fetchSuggestions(debouncedValue) // 异步获取请求的数据
      if (results instanceof Promise) { // 返回结果如果是Promise实例
        setLoading(true)
        results.then(data => {
          setLoading(false)
          setSugestions(data)
          if (data.length > 0) {
            setShowDropdown(true)
          }
        })
      } else { // * 不是实例直接取值
        setSugestions(results)
        setShowDropdown(true)
        if (results.length > 0) {
          setShowDropdown(true)
        } 
      }
    } else {
      setShowDropdown(false)
    }
    setHighlightIndex(-1) // 每次请求完之后默认选中第一个item
  }, [debouncedValue, fetchSuggestions]) // 在input框中值通过防抖发生改变后 或 获取到新数据  执行副作用

  // * 这是选中item index 使用样式的工具函数
  const highlight = (index: number) => {
    if (index < 0) index = 0 // 小于0 默认选中第一个
    if (index >= suggestions.length) { // 大于推荐length 不能再往下了  就最后一个
      index = suggestions.length - 1
    }
    setHighlightIndex(index) // 设置index值
  }
  // * 几种键盘事件
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    switch(e.keyCode) {
      case 13: // 回车
        if (suggestions[highlightIndex]) {
          handleSelect(suggestions[highlightIndex]) // 选中item
        }
        break
      case 38: // 上
        highlight(highlightIndex - 1)
        break
      case 40: // 下
        highlight(highlightIndex + 1)
        break
      case 27: // esc
        setShowDropdown(false)
        break
      default:
        break
    }
  }

  // *input框中的值改变触发的事件
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim()
    setInputValue(value) // 这是input值
    triggerSearch.current = true // 值发生改变触发请求
  }

  // *选中item
  const handleSelect = (item: DataSourceType) => {
    setInputValue(item.value)
    setShowDropdown(false)
    // 有传入的话才调用
    if (onSelect) {
      onSelect(item)
    }
    triggerSearch.current = false // suggestions有值的时候选中item 就不要请求推介列表了
  }

  // 是否使用自定义模板渲染
  const renderTemplate = (item: DataSourceType) => {
    return renderOption ? renderOption(item) : item.value //item.value是为了使用复杂格式的数据
  }

  // *生成下拉列表
  const generateDropdown = () => {
    return (
      <Transition
        in={showDropdown || loading} // 展开或loading 为true 时有渐变效果
        animation="zoom-in-top"
        timeout={300}
        onExited={() => {setSugestions([])}} // 动画退出时重置suggestions为空
      >
        <ul className="viking-suggestion-list">
          {/* 加载数据时展示loading */}
          { loading &&
            <div className="suggstions-loading-icon">
              <Icon icon="spinner" spin/>
            </div>
          }
          {/* 渲染li */}
          {suggestions.map((item, index) => {
            const cnames = classNames('suggestion-item', {
              'is-active': index === highlightIndex
            })
            return (
              <li key={index} className={cnames} onClick={() => handleSelect(item)}>
                {renderTemplate(item)}
              </li>
            )
          })}
        </ul>
      </Transition>
    )
  }
  return (
    // 这里的ref 是给点击外部区域管理下拉hooks 使用的
    <div className="viking-auto-complete" ref={componentRef}> 
      <Input
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        {...restProps}
      />
      {generateDropdown()}
    </div>
  )
}

export default AutoComplete;

