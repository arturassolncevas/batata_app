
import React, { Component } from 'react'
import { Row, Col, PageHeader, Divider, Rate, Comment, Avatar, Progress, Button } from 'antd';
import { DropboxOutlined, StarFilled } from '@ant-design/icons'
import GoogleMapReact from 'google-map-react';
import { injectIntl } from 'react-intl'
import profileImage from "../../../../images/profile.jpg";
import moment from 'moment';


const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
}

const defaultProps = {
  center: {
    lat: 56.2639,
    lng: 9.5018
  },
  zoom: 10
};

const reviews = [
  {
    user: {
      name: "Kim Larsen",
      profile_image: { url: profileImage }
    },
    time: "2020-01-02",
    rating: 4,
    comment: "After using Batata my business skyrocketed! Best. Product. Ever! Dude, your stuff is the bomb! It's really wonderful"
  },
  {
    user: {
      name: "Cecilie Holm",
      profile_image: { url: profileImage }
    },
    time: "2020-01-06",
    rating: 5,
    comment: "Batata is the most valuable business resource we have EVER purchased. I didn't even need training. Buy this now."
  }
]

const getRatingAverage = (reviews) => {
  return reviews.map(e => e.rating).reduce((a, b) => a + b) / reviews.length
}

const getRatingsGroupedTotal = (reviews) => {
  let totalReviews = reviews.length
  let groupedTotal = {
    "5": { times: 0, percentage: 0 },
    "4": { times: 0, percentage: 0 },
    "3": { times: 0, percentage: 0 },
    "2": { times: 0, percentage: 0 },
    "1": { times: 0, percentage: 0 }
  }
  reviews.forEach((e) => { groupedTotal[e.rating.toString()].times += 1 })
  return Object.keys(groupedTotal).map((e) => {
    groupedTotal[e].percentage = (groupedTotal[e].times * 100) / totalReviews
    groupedTotal[e].name = e
    return groupedTotal[e]
  }).reverse()
}

const addressLine = (address) => {
  if (!address.city || !address.country)
    return ""
  let city = address.city
  city = city.charAt(0).toUpperCase() + city.slice(1)
  let country = address.country.name
  country = country.charAt(0).toUpperCase() + country.slice(1)
  return `${city}, ${country}`
}

class CompanyProfileSettings extends Component {

  constructor(props) {
    super(props)
    this.state = { company_profile: { profile_image: { url: null }, address: { country: {} }, feature_images: [] } }
  }

  componentDidMount() {
    this.fetchInitialData()
  }

  async fetchInitialData() {
    let company_profile = await requestClient.get('/api/settings/company_profile').then(e => e.data)
    this.setState({ ...this.state, company_profile })
  }

  handleGoogleApiLoaded(map, maps) {
    //requires API
    let geocoder = new maps.Geocoder()
  }

  render() {
    let average = getRatingAverage(reviews)
    return (
      <div>
        <PageHeader
          className="site-page-header"
          title={this.props.intl.formatMessage({ id: 'pages.companyProfileSettings.header' })}
          avatar={{ icon: (<DropboxOutlined className="header-icon" />) }}
          extra={[
              <Button
                key={"headerButton"}
                onClick={() => { this.props.history.push('/settings/profile/edit') }}
              >{this.props.intl.formatMessage({ id: 'crud.edit' })}</Button>
          ]}
        />
        <Divider className="site-devider after-header"></Divider>

        <Row>
          <Col><img
            height={150}
            width={150}
            src={(this.state.company_profile.profile_image || {}).url} alt="brand logo" /></Col>
          <Col>
            <div>{this.state.company_profile.name}</div>
            <Row style={{ alignItems: "center" }}>
              <Col>
                <div style={{ fontSize: "20px" }}>{average}</div>
              </Col>
              <Col>
                <div><Rate allowHalf style={{ fontSize: "12px" }} disabled defaultValue={average} /></div>
                <div style={{ fontSize: "8px" }}>({`${reviews.length} ${this.props.intl.formatMessage({ id: 'general.ratings' })}`})</div>
              </Col>
            </Row>
            <div>{addressLine(this.state.company_profile.address)}</div>
            <div style={{ color: "green" }}>{this.props.intl.formatMessage({ id: 'models.company.ecological' })}</div>
          </Col>
        </Row>
        <Row style={{ marginTop: "15px" }}>{this.props.intl.formatMessage({ id: 'general.about' })}</Row>
        <Row style={{ marginTop: "15px" }}>
          <Col lg={12}><div dangerouslySetInnerHTML={{ __html: this.state.company_profile.description }}></div></Col>
          <Col lg={12}>
            <div style={{ height: '200px' }}>
              <GoogleMapReact
                defaultCenter={defaultProps.center}
                defaultZoom={defaultProps.zoom}
                yesIWantToUseGoogleMapApiInternals
                onGoogleApiLoaded={({ map, maps }) => { this.handleGoogleApiLoaded(map, maps) }}
              >
              </GoogleMapReact>
            </div>
          </Col>
        </Row>
        <Row style={{ marginTop: "15px" }}>{this.props.intl.formatMessage({ id: 'general.picture_gallery' })}</Row>
        <Row style={{ marginTop: "15px" }} gutter={15}>
          {this.state.company_profile.feature_images.map((e, i) => {
            return <Col key={i}><img style={{ width: "150px", height: "150px" }} src={e.url} /></Col>
          })}
        </Row>
        <Row style={{ marginTop: "15px" }}>{this.props.intl.formatMessage({ id: 'models.company.business_info' })}</Row>
        <Row style={{ marginTop: "15px" }}>
          <Col>
            <div>{this.props.intl.formatMessage({ id: 'pages.signup.company.local_code' })}: {this.state.company_profile.local_code} </div>
            <div>{this.props.intl.formatMessage({ id: 'general.email' })}: {this.state.company_profile.address.email} </div>
            <div>{this.props.intl.formatMessage({ id: 'models.address.phone' })}: {this.state.company_profile.address.country.area_code + this.state.company_profile.address.phone} </div>
            <div>{this.props.intl.formatMessage({ id: 'models.company.website_url' })}: {this.state.company_profile.website_url} </div>
            <div>{this.props.intl.formatMessage({ id: 'models.company.social_links' })}: facebook: {this.state.company_profile.facebook_url}, instagram: {this.state.company_profile.instagram_url} </div>
          </Col>
        </Row>
        <Row style={{ marginTop: "15px" }}>
          <Col lg={16}>
            <div>{this.props.intl.formatMessage({ id: 'general.reviews' })}</div>

            {reviews.map((e, i) =>
              <Comment
                key={i}
                author={e.user.name}
                avatar={<Avatar src={e.user.profile_image.url} />}
                content={<div>{e.comment}</div>}
                datetime={moment.utc(e.time).local().format()}
                actions={[<div>{e.rating}<StarFilled /></div>]}
              />
            )}
          </Col>
          <Col lg={8}>
            <div>{this.props.intl.formatMessage({ id: 'general.ratings' })}</div>
            <div style={{ display: "flex", fontSize: "15px", alignItems: "center", justifyContent: "center", width: "40px", height: "40px", border: "1px solid black", borderRadius: "50%" }}>{average}</div>
            <Rate allowHalf style={{ fontSize: "18px" }} disabled defaultValue={average} />
            <div>({`${reviews.length} ${this.props.intl.formatMessage({ id: 'general.ratings' })}`})</div>
            {getRatingsGroupedTotal(reviews).map((e, i) => {
              return (<div key={i}>{e.name} <Progress percent={e.percentage} showInfo={true} format={() => { return `(${e.times})` }} /></div>)
            })}
          </Col>
        </Row>
      </div >
    )
  }
}

export default injectIntl(CompanyProfileSettings)