import React from 'react'
import { Skeleton, Switch, List, Button, Row, Col, Tooltip, Tag } from 'antd';
import { StarOutlined, LikeOutlined, EditFilled, DeleteFilled } from '@ant-design/icons';
import { injectIntl } from 'react-intl'


let unitsFormat = (item, value, intl, options = { checkIfPacked: true }) => {
  let decimalPoints = item.measurement_unit.max_decimal_points
  if (options.checkIfPacked)
    decimalPoints = item.packed ? 0 : decimalPoints
  let formatted = numberHelper.parse(value.toString(), { maxDecimalPoints: decimalPoints || 0 })
  return `${formatted || 0}${item.packed ? " (" + intl.formatMessage({ id: "general.packs" }) + ")" : (item.measurement_unit.alias || "")}`
}

let setFrontImageThumbnailUrl = (item) => {
  return (item.files.find(e => e.type === "thumbnail") || {}).url
}

let formatPrice = (item) => {
  let price = new Intl.NumberFormat('da-DK', { style: 'currency', currency: 'DKK' }).format(item.price)
  let quantity = new Intl.NumberFormat('da-DK').format(item.quantity)
  let unit = item.measurement_unit
  let formatted = `${price} / ${quantity}${unit.alias || ""}${item.packed ? " (pack)" : ""}`
  return formatted
}

const sellerProductRow = (props) => (
  <Row style={{ margin: "15px 0px", padding: "10px", border: "1px solid #eaeaea" }}>
    <Col style={{ height: "120px", width: "120px" }}>
      <img style={{ height: "100%" }} src={setFrontImageThumbnailUrl(props.item)} />
    </Col>
    <Col style={{ flexGrow: "1", padding: "0px 15px" }}>
      <Row style={{ flexDirection: "column", height: "100%" }}>
        <Col>
          <Row>
            <strong style={{ fontSize: "17px" }}>{props.item.category.name}</strong>
            <Tag style={{ margin: "4px" }} color={props.item.category.active ? "error" : "success"}>
              {props.item.category.active ? props.intl.formatMessage({ id: 'general.inactive' }) : props.intl.formatMessage({ id: 'general.active' })}
            </Tag>
          </Row>
        </Col>
        <Col style={{ flexGrow: "1" }} >
          {props.item.attributes.map((e, i) => {
            return <div key={i}>{`${e.attribute.name}: ${e.option.name}`}</div>
          })}
        </Col>
        <Row>
          <Col style={{ marginRight: "15px" }}>{props.intl.formatMessage({ id: 'models.product.quantityInStock' })}: <strong>{unitsFormat(props.item, props.item.quantity_in_stock, props.intl)}</strong></Col>
          <Col style={{ marginRight: "15px" }}>{props.intl.formatMessage({ id: 'models.product.minQuantity' })}: <strong>{unitsFormat(props.item, props.item.min_quantity, props.intl)}</strong></Col>
          <Col style={{ marginRight: "15px" }}>{props.intl.formatMessage({ id: 'models.product.maxQuantity' })}: <strong>{unitsFormat(props.item, props.item.max_quantity, props.intl)}</strong></Col>
        </Row>
      </Row>
    </Col>
    <Col style={{ display: "flex", alignItems: "center", fontSize: "17px", fontWeight: "bold", margin: "15px" }}>{formatPrice(props.item)}</Col>
    <Col>
      <Row style={{ "flexDirection": "row", height: "100%", justifyContent: "center", alignItems: "center" }}>
        <Col>
          <Tooltip title="Edit">
            <Button type={"primary"} style={{ margin: "4px" }} shape="circle" icon={<EditFilled />} onClick={() => { props.history.push(`products/${props.item.id}/edit`) }}/>
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

export default injectIntl(sellerProductRow)