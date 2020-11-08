import React from 'react'
import { Skeleton, Switch, List, Button, Row, Col, Tooltip, Tag } from 'antd';
import { StarOutlined, LikeOutlined, EditFilled, DeleteFilled } from '@ant-design/icons';
import { injectIntl } from 'react-intl'


let unitsFormat = (item, value, intl, options = {}) => {
  let productFormatter = new ProductFormatter()
  productFormatter.setOptions({ measurementUnitAlias: item.measurement_unit.alias, packed: item.packed, intl })
  return productFormatter.formattedQuantity({ quantity: value })
}

let setFrontImageThumbnailUrl = (item) => {
  return (item.files.find(e => e.type === "thumbnail") || {}).url
}

let formatPrice = (item, intl) => {
  let productFormatter = new ProductFormatter()
  productFormatter.setOptions({ measurementUnitAlias: item.measurement_unit.alias, packed: item.packed, intl })
  return productFormatter.formattedPrice({ price: currencyHelper.value(item.price).format(), quantity: item.quantity })
}

const cartRow = (props) => (
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
            return <div key={i}>{`${e.attribute.name}: ${(e.option || {}).name}`}</div>
          })}
        </Col>
        <Row>
          <Col style={{ marginRight: "15px" }}>{props.intl.formatMessage({ id: 'models.product.quantityInStock' })}: <strong>{unitsFormat(props.item, props.item.quantity_in_stock, props.intl)}</strong></Col>
          <Col style={{ marginRight: "15px" }}>{props.intl.formatMessage({ id: 'models.product.minQuantity' })}: <strong>{unitsFormat(props.item, props.item.min_quantity, props.intl)}</strong></Col>
          <Col style={{ marginRight: "15px" }}>{props.intl.formatMessage({ id: 'models.product.maxQuantity' })}: <strong>{unitsFormat(props.item, props.item.max_quantity, props.intl)}</strong></Col>
        </Row>
      </Row>
    </Col>
    <Col style={{ display: "flex", alignItems: "center", fontSize: "17px", fontWeight: "bold", margin: "15px" }}>{formatPrice(props.item, props.intl)}</Col>
    <Col>
      <Row style={{ "flexDirection": "row", height: "100%", justifyContent: "center", alignItems: "center" }}>
        <Col>
          <Tooltip title={props.intl.formatMessage({ id: 'crud.edit'})}>
            <Button type={"primary"} style={{ margin: "4px" }} shape="circle" icon={<EditFilled />} onClick={() => { props.history.push(`products/${props.item.id}/edit`) }}/>
          </Tooltip>
        </Col>
        <Col>
          <Tooltip title={props.intl.formatMessage({ id: 'crud.delete'})}>
            <Button type={"primary"} style={{ margin: "4px" }} danger shape="circle" icon={<DeleteFilled />} onClick={() => { props.onDeleteClickCallback(props.item) }} />
          </Tooltip>
        </Col>
      </Row>
    </Col>
  </Row>
)

export default injectIntl(cartRow)