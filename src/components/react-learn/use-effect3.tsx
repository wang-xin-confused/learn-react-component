import React, { FC, useState, useEffect } from "react";

const useEffectLearn3: FC = (props) => {
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    console.log('add effect', position.x) // 这个cosole不会被重复执行
    const updataMouse = (e: MouseEvent) => {
      console.log("inner函数体内xy值更新")
      setPosition({ x: e.clientX, y: e.clientY }) // *1. 点击触发数据变化
    }

    document.addEventListener('click', updataMouse)
    // 清除副作用的回调  在开始新的effect 执行之前调用
    return (() => {
      console.log('remove effect', position.x)
      document.removeEventListener('click', updataMouse)
    })
    // 第二个参数是触发effect的依赖 空数组就表示不依赖  只在mount unmount的时候被触发一次
  }, [])

  // x为0 因为useState 中设置了0
  console.log("before render", position.x) // * 2. 重新触发渲染 调用useEffEct
  return (
    <p>X:{position.x} , Y: {position.y}</p>
  )

}

export default useEffectLearn3

/**
 * 在组件挂在didmount 数据更新updataMount 的时候触发
 * 相当于vue的watch  添加了immediate:true 属性  在mounted后立即触发一次
 */