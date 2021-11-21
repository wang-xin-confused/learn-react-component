import React, { FC, useState } from "react";

const LikeButton: FC = (props) => {
  const [like, setLike] = useState(0)
  const [on, setOn] = useState(true)

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

export default LikeButton

/**
 * useState()
 *
 *
 *
 *
 */