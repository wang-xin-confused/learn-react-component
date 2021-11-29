import { RefObject, useEffect } from "react";

function useClickOutside(ref: RefObject<HTMLElement>, handler: Function) {
  useEffect(() => {
    const listener = (event: MouseEvent) => {
      // 如果触发click的元素是在ref元素内  则不关闭弹窗
      if (!ref.current || ref.current.contains(event.target as HTMLElement)) {
        return
      }
      // 否则执行回调
      handler(event) // event 就是鼠标事件
    }
    document.addEventListener('click', listener)
    return () => {
      document.removeEventListener('click', listener)
    }
  }, [ref, handler]) //* 当ref handler 发生变化时出发effect函数  给document绑定了个事件
}

export default useClickOutside