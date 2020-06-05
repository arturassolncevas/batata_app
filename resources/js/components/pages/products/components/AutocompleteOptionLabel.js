import React from 'react'
import { Avatar } from 'antd'

const autoCompleteOptionLabel = (name, link = null) => (
  <div style={{
    display: "flex",
    justifyContent: "space-between",
    margin: "5px 0",
    alignItems: "center"
  }}>
    {name}
    <Avatar shape="square" src={link || "https://ae01.alicdn.com/kf/HTB1U6.dkbZnBKNjSZFGq6zt3FXae.jpg" } />
  </div>
)

export default autoCompleteOptionLabel