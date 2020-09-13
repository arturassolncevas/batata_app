import React from 'react'
import { PageHeader, Divider, Row, Table, Tag, Col } from 'antd';
import { CarryOutOutlined } from '@ant-design/icons';


const tableColumns = [
  {
    title: 'ID',
    dataIndex: 'orderId',
    key: 'orderId',
    fixed: 'left',
  },
  {
    title: 'Quantity',
    dataIndex: 'quantity',
    key: 'quantity',
    fixed: 'left',
    render: (objects = []) => { 
      return objects.map((obj, index) => (
        <Row key={index} >
          <img style={{ height: "30px", padding: "1px", marginRight: "15px" }} src={obj.imageLink}/>
          <div>{` ${obj.title} ${obj.quantity} x ${obj.price} /${obj.measure}`}</div>
        </Row>
      ))
    }
  },
  {

  },
  {
    title: 'Order time',
    dataIndex: 'orderTime',
    key: 'orderTime',
  },
  {
    title: 'Delivery/Pickup date',
    dataIndex: 'deliveryDate',
    key: 'inStock',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
    render: (status) => {
      let color = ""
      switch(status) {
        case "Pending":
          color = "blue"
          break
        case "Payment received":
          color = "orange"
          break
        case "Delivered":
          color = "green"
          break
        case "Cancelled":
          color = "red"
          break
      }
      return <Tag style={{ margin: "4px" }}
        color={color}>
        {status}
      </Tag>
    }
  },
];

const tableData = [
  {
    key: 1,
    orderId: "42552",
    orderTime: "2020-09-01 15:20",
    deliveryDate: "2020-10-01",
    status: "Pending",
    quantity: [
      { 
        quantity: 25,
        title: "Tomatoes",
        measure: "1Kg",
        imageLink: "https://www.myswanlake.com/wp-content/uploads/2016/08/Hot-House-Tomatoes-On-The-Vine-200x200.jpg",
        price: "5,00 kr."
      },
      { 
        quantity: 40,
        title: "Apples",
        measure: "1Kg",
        imageLink: "https://kgmi.com/wp-content/blogs.dir/70/files/2014/10/apples-200x200.jpg",
        price: "6,00 kr."
      },
      { 
        quantity: 40,
        title: "Summer Rhubarb",
        measure: "15pcs(pack)",
        imageLink: "https://gardenseedsmarket.com/images/thumbnails/320/320/detailed/61/rabarbar-victoria.jpg",
        price: "6,00 kr."
      },
    ],
  },
  {
    key: 2,
    orderId: "42553",
    orderTime: "2020-08-28 10:14",
    deliveryDate: "2020-09-14",
    status: "Payment received",
    quantity: [
      { 
        quantity: 15,
        title: "Broiler",
        measure: "1.5kg(pack)",
        imageLink: "https://5.imimg.com/data5/IQ/NS/MY-11305339/whole-uncooked-raw-chicken-500x500.jpg",
        price: "15,00 kr. "
      },
      { 
        quantity: 5,
        title: "Tomatoes",
        measure: "Kg",
        imageLink: "https://www.myswanlake.com/wp-content/uploads/2016/08/Hot-House-Tomatoes-On-The-Vine-200x200.jpg",
        price: "5,00 kr."
      },
    ],
  },
  {
    key: 3,
    orderId: "42552",
    orderTime: "2020-08-28 10:14",
    deliveryDate: "2020-09-14",
    status: "Delivered",
    quantity: [
      { 
        quantity: 15,
        title: "Basil",
        measure: " 150g(pack)",
        imageLink: "https://www.plantorama.dk/-/media/Images/Guide/Have/Haveplanter/Spiselige-baer-og-planter/Krydderurter/Dyrkning-af-basilikum/basilikum-spot-1.png?width=200&height=200&mode=crop&quality=70",
        price: "5,00 kr."
      },
      { 
        quantity: 20,
        title: "Broiler",
        measure: "1.5kg(pack)",
        imageLink: "https://5.imimg.com/data5/IQ/NS/MY-11305339/whole-uncooked-raw-chicken-500x500.jpg",
        price: "15,00 kr. "
      },
      { 
        quantity: 50,
        title: "Apples",
        measure: "Kg",
        imageLink: "https://kgmi.com/wp-content/blogs.dir/70/files/2014/10/apples-200x200.jpg",
        price: "6,00 kr."
      }
    ],
  },
  {
    key: 4,
    orderId: "42551",
    orderTime: "2020-08-28 10:14",
    deliveryDate: "2020-09-14",
    status: "Cancelled",
    quantity: [
      { 
        quantity: 23,
        title: "Basil",
        measure: " 150g(pack)",
        imageLink: "https://www.plantorama.dk/-/media/Images/Guide/Have/Haveplanter/Spiselige-baer-og-planter/Krydderurter/Dyrkning-af-basilikum/basilikum-spot-1.png?width=200&height=200&mode=crop&quality=70",
        price: "5,00 kr."
      },
    ],
  },
  {
    key: 5,
    orderId: "42552",
    orderTime: "2020-08-28 10:14",
    deliveryDate: "2020-09-14",
    status: "Delivered",
    quantity: [
      { 
        quantity: 10,
        title: "Broiler",
        measure: "1.5kg(pack)",
        imageLink: "https://5.imimg.com/data5/IQ/NS/MY-11305339/whole-uncooked-raw-chicken-500x500.jpg",
        price: "15,00 kr. "
      },
      { 
        quantity: 10,
        title: "Tomatoes",
        measure: "Kg",
        imageLink: "https://www.myswanlake.com/wp-content/uploads/2016/08/Hot-House-Tomatoes-On-The-Vine-200x200.jpg",
        price: "5,00 kr."
      },
      { 
        quantity: 20,
        title: "Apples",
        measure: "Kg",
        imageLink: "https://kgmi.com/wp-content/blogs.dir/70/files/2014/10/apples-200x200.jpg",
        price: "6,00 kr."
      }
    ],
  },
  {
    key: 6,
    orderId: "42552",
    orderTime: "2020-08-28 10:14",
    deliveryDate: "2020-09-14",
    status: "Delivered",
    quantity: [
      { 
        quantity: 15,
        title: "Basil",
        measure: " 150g(pack)",
        imageLink: "https://www.plantorama.dk/-/media/Images/Guide/Have/Haveplanter/Spiselige-baer-og-planter/Krydderurter/Dyrkning-af-basilikum/basilikum-spot-1.png?width=200&height=200&mode=crop&quality=70",
        price: "5,00 kr."
      },
      { 
        quantity: 65,
        title: "Apples",
        measure: "Kg",
        imageLink: "https://kgmi.com/wp-content/blogs.dir/70/files/2014/10/apples-200x200.jpg",
        price: "6,00 kr."
      },
      { 
        quantity: 35,
        title: "Tomatoes",
        measure: "Kg",
        imageLink: "https://www.myswanlake.com/wp-content/uploads/2016/08/Hot-House-Tomatoes-On-The-Vine-200x200.jpg",
        price: "5,00 kr."
      },
    ],
  },

  {
    key: 7,
    orderId: "42552",
    orderTime: "2020-08-28 10:14",
    deliveryDate: "2020-09-14",
    status: "Delivered",
    quantity: [
      { 
        quantity: 12,
        title: "Summer Rhubarb",
        measure: "15pcs(pack)",
        imageLink: "https://gardenseedsmarket.com/images/thumbnails/320/320/detailed/61/rabarbar-victoria.jpg",
        price: "6,00 kr."
      },
      { 
        quantity: 110,
        title: "Apples",
        measure: "Kg",
        imageLink: "https://kgmi.com/wp-content/blogs.dir/70/files/2014/10/apples-200x200.jpg",
        price: "6,00 kr."
      },
      { 
        quantity: 25,
        title: "Broiler",
        measure: "1pcs (pack)",
        imageLink: "https://5.imimg.com/data5/IQ/NS/MY-11305339/whole-uncooked-raw-chicken-500x500.jpg",
        price: "15,00 kr. "
      },
      { 
        quantity: 15,
        title: "Tomatoes",
        measure: "Kg",
        imageLink: "https://www.myswanlake.com/wp-content/uploads/2016/08/Hot-House-Tomatoes-On-The-Vine-200x200.jpg",
        price: "5,00 kr."
      },
    ]
  }
];

export default function OrdersPage() {
  return (
    <div>
      <PageHeader
        className="site-page-header"
        title="Orders"
        avatar={{ icon: (<CarryOutOutlined />) }}
      />
      <Divider className="site-devider after-header"></Divider>
      <Row style={{}}>
        <Col md={24} >
          <Table columns={tableColumns} dataSource={tableData} />
        </Col>
      </Row>
    </div>
  )
}