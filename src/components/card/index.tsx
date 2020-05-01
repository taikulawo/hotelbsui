import React from 'react'
import './card.sass'
export type CardPropsType = {
  title: string
  picurl: string
  onClick: () => {}
}

export default function(props: CardPropsType) {
  return (
    <div className="bs_card">
      <img src={props.picurl}></img>
      <div>
        <span>{props.title}</span>
      </div>
    </div>
  )
}