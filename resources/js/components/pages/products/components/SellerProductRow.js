import React from 'react'
import { Skeleton, Switch, List, Button, Row, Col, Tooltip, Tag } from 'antd';
import { StarOutlined, LikeOutlined, EditFilled, DeleteFilled } from '@ant-design/icons';

let unitsFormat = (item, val) => {
  let formatted = `${val || 0}${item.packed ? " (packs)" : (item.measurement_unit.alias || "")}`
  return formatted
}

let setFrontImageThumbnailUrl = (item) => {
  return (item.files.find(e => e.type === "thumbnail" ) || {}).url
}

let formatPrice = (item) => {
  let price = new Intl.NumberFormat('da-DK', { style: 'currency', currency: 'DKK' }).format(item.price)
  let quantity = new Intl.NumberFormat('da-DK').format(item.quantity)
  let unit = item.measurement_unit
  let formatted = `${price} / ${quantity}${unit.alias || ""}${item.packed ? " (pack)" : ""}`
  return formatted
}

const sellerProductRow = (props) => (
  <Row style={{ margin: "15px", padding: "10px", border: "1px solid #eaeaea" }}>
    <Col style={{ height: "120px", width: "120px" }}>
      <img style={{ height: "100%" }} src={setFrontImageThumbnailUrl(props.item)} />
    </Col>
    <Col style={{ flexGrow: "1", padding: "0px 15px" }}>
      <Row style={{ flexDirection: "column", height: "100%" }}>
        <Col>
          <Row>
            <strong style={{ fontSize: "17px" }}>{props.item.category.name}</strong>
            <Tag style={{ margin: "4px" }} color={props.item.category.active ? "error" : "success"}>
              {props.item.category.active ? "Inactive" : "Active"}
            </Tag>
          </Row>
        </Col>
        <Col style={{ flexGrow: "1" }} >
          {props.item.attributes.map((e, i) => {
              return <div key={i}>{`${e.attribute.name}: ${e.option.name}`}</div>
          })}
        </Col>
        <Row>
          <Col style={{ marginRight: "15px" }}>Stock balance: <strong>{unitsFormat(props.item, props.item.quantity_in_stock)}</strong></Col>
          <Col style={{ marginRight: "15px" }}>Min order: <strong>{unitsFormat(props.item, props.item.min_quantity)}</strong></Col>
          <Col style={{ marginRight: "15px" }}>Max order: <strong>{unitsFormat(props.item, props.item.max_quantity)}</strong></Col>
        </Row>
      </Row>
    </Col>
<Col style={{ display: "flex", alignItems: "center", fontSize: "17px", fontWeight: "bold", margin: "15px" }}>{ formatPrice(props.item) }</Col>
    <Col>
      <Row style={{ "flexDirection": "row", height: "100%", justifyContent: "center", alignItems: "center" }}>
        <Col>
          <Tooltip title="Edit">
            <Button type={"primary"} style={{ margin: "4px" }} shape="circle" icon={<EditFilled />} />
          </Tooltip>
        </Col>
        <Col>
          <Tooltip title="Delete">
            <Button type={"primary"} style={{ margin: "4px" }} danger shape="circle" icon={<DeleteFilled />} />
          </Tooltip>
        </Col>
      </Row>
    </Col>
  </Row>
)

export default sellerProductRow