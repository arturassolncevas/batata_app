import React, { useState } from "react";
import { MoreInfo, CancelModal, Result } from "./Modals";
import { Badge, Table, Row } from "antd";
import moment from "moment";

const OverviewTable = ({ data, pagination }) => {
    const [isMoreInfoVisible, setIsMoreInfoVisible] = useState(false);
    const [isCancelModalVisible, setIsCancelModalVisible] = useState(false);
    const [isResultModalVisible, setIsResultModalVisible] = useState(false);
    const [modalData, setModalData] = useState({});

    const showMoreInfo = () => {
        setIsMoreInfoVisible(true);
    };

    // const TableData = data.map((d, idx) => {
    //     let { buyer, product, delivery, status } = d;

    //     let calcTotalAmount = () => {
    //         if (Array.isArray(product)) {
    //             let totalAmount = 0;
    //             product.map(p => {
    //                 let { price } = p;
    //                 totalAmount += parseFloat(price.split("DKK ")[1]);
    //             });

    //             return (
    //                 <span className="product-amount">
    //                     DKK
    //                     <span>{`${parseFloat(totalAmount.toFixed(2))}`}</span>
    //                 </span>
    //             );
    //         }

    //         let { price } = product;
    //         return (
    //             <span className="product-amount">
    //                 DKK
    //                 <span>{price.split("DKK ")[1]}</span>
    //             </span>
    //         );
    //     };

    //     let statusBadge = () => {
    //         let color = "";
    //         switch (status) {
    //             case "pending":
    //                 color = "#f4d167";
    //                 break;
    //             case "payment received":
    //                 color = "#82cbf4";
    //                 break;
    //             case "delivered":
    //                 color = "#84e296";
    //                 break;
    //             case "cancelled":
    //                 color = "#f08989";
    //                 break;
    //         }
    //         return <Badge dot style={{ backgroundColor: color }} />;
    //     };

    //     return (
    //         <tr
    //             key={idx}
    //             onClick={() => {
    //                 console.log(d);
    //                 showMoreInfo();
    //                 setModalData(d);
    //             }}
    //         >
    //             <td>
    //                 <span className="buyer-name">{buyer.name}</span>
    //                 <br />
    //                 <span className="buyer-id">
    //                     ID: <span>{`${buyer.id}`}</span>
    //                 </span>
    //             </td>
    //             <td className="product-info-cell">
    //                 <span className="status-badge">{statusBadge()}</span>
    //                 <span>
    //                     {calcTotalAmount()}
    //                     <br />
    //                     <span className="delivery-date">{delivery.date}</span>
    //                 </span>
    //             </td>
    //         </tr>
    //     );
    // });

    const { Column } = Table;

    return (
        <div id="overview-table">
            {/* <table>
                <thead>
                    <tr>
                        <th>Buyer</th>
                        <th>Information</th>
                    </tr>
                </thead>
                <tbody>{TableData}</tbody>
            </table> */}

            <Table
                dataSource={data}
                pagination={pagination}
                onRow={record => {
                    return {
                        onClick: () => {
                            console.log(record);
                            // showMoreInfo();
                            // setModalData(record);
                        }
                    };
                }}
            >
                <Column
                    title="Buyer"
                    dataIndex="customer"
                    key="buyer"
                    render={customer => (
                        <div className="company-details">
                            <span>
                                <span className="company-name">
                                    company name
                                </span>
                                <br />
                                <span className="company-id">
                                    ID:{" "}
                                    {/* <span>{`${customer.company_id}`}</span> */}
                                    <span>12345</span>
                                </span>
                            </span>
                        </div>
                    )}
                />
                <Column
                    title="Information"
                    key="information"
                    dataIndex="status"
                    render={(status, record) => {
                        let color = "";
                        switch (status) {
                            case "pending":
                                color = "#f4d167";
                                break;
                            case "processing":
                                color = "#82cbf4";
                                break;
                            case "completed":
                                color = "84e296";
                                break;
                            case "cancelled":
                                color = "grey";
                                break;
                            case "failed":
                                color = "#f08989";
                            default:
                                color = "grey";
                        }
                        return (
                            <Row className="product-info-cell">
                                <span className="status-badge">
                                    <Badge
                                        dot
                                        style={{ backgroundColor: color }}
                                    />
                                </span>

                                <span>
                                    <span className="product-amount">
                                        {currencyHelper
                                            .value(record.total)
                                            .format()}
                                    </span>
                                    <br />
                                    <span className="delivery-date">
                                        {moment
                                            .utc(record.created_at)
                                            .local()
                                            .format("MM-DD-YYYY hh:mm")}
                                    </span>
                                </span>
                            </Row>
                        );
                    }}
                />
            </Table>

            <MoreInfo
                setIsModalVisible={setIsMoreInfoVisible}
                isModalVisible={isMoreInfoVisible}
                openCancelModal={setIsCancelModalVisible}
                data={modalData}
            />

            <CancelModal
                setIsModalVisible={setIsCancelModalVisible}
                isModalVisible={isCancelModalVisible}
                openResult={setIsResultModalVisible}
            />

            <Result isModalVisible={isResultModalVisible} />
        </div>
    );
};

export default OverviewTable;
