import React, { FC, useState, useEffect } from "react";

const useEffectLearn1: FC = (props) => {
  const [like, setLike] = useState(0)
  const [on, setOn] = useState(true)
  useEffect(() => {
    console.log('document title effect is running')
    document.title = '点击了' + like + '次'
    // 这里只有like会触发effect  on的变化不会
  }, [like])

  return (
    <>
      <button onClick={() => { setLike(like + 1) }}>
        {like}👍🏻
      </button>
      <button onClick={() => { setOn(!on) }}>
        {on ? 'on' : 'off'}
      </button>
    </>
  )

}

export default useEffectLearn1

/**
 * 在组件挂在didmount 数据更新updataMount 的时候触发
 * 相当于vue的watch  添加了immediate:true 属性  在mounted后立即触发一次
 */