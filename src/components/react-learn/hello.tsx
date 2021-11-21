import React, { FC, FunctionComponent } from "react";

interface IHelloProps {
  message?: string
}

// const Hello = (props: IHelloProps) => {
//   return (
//     <h2>{props.message}</h2>
//   )
// }

/**
 * 函数也可以用interface表示 
 * 鼠标移上去可以看到FunctionComponent 定义的interface
 * 里面有children displayName defaultProps propTypes contextTypes
 * 
 */
// const Hello: FunctionComponent<IHelloProps> = (props) => {
// FC 是啥  鼠标移上去 看到就是 FunctionComponent 的一个别名
const Hello: FC<IHelloProps> = (props) => {
  return (
    // 直接props. 多了一个children属性
    <h2>{props.message}{props.children}</h2>
  )
}

// 还添加了静态属性的
Hello.defaultProps = {
  message: "hello world"
}

export default Hello