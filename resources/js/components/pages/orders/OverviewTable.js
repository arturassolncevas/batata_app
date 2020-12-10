import React, { useState } from "react";
import { MoreInfo, CancelModal, Result } from "./Modals";
import { Badge } from "antd";

const OverviewTable = ({ data }) => {
    const [isMoreInfoVisible, setIsMoreInfoVisible] = useState(false);
    const [isCancelModalVisible, setIsCancelModalVisible] = useState(false);
    const [isResultModalVisible, setIsResultModalVisible] = useState(false);
    const [modalData, setModalData] = useState({});

    const showMoreInfo = () => {
        setIsMoreInfoVisible(true);
    };

    const TableData = data.map((d, idx) => {
        let { buyer, product, delivery, status } = d;

        let calcTotalAmount = () => {
            if (Array.isArray(product)) {
                let totalAmount = 0;
                product.map(p => {
                    let { price } = p;
                    totalAmount += parseFloat(price.split("DKK ")[1]);
                });

                return (
                    <span className="product-amount">
                        DKK
                        <span>{`${parseFloat(totalAmount.toFixed(2))}`}</span>
                    </span>
                );
            }

            let { price } = product;
            return (
                <span className="product-amount">
                    DKK
                    <span>{price.split("DKK ")[1]}</span>
                </span>
            );
        };

        let statusBadge = () => {
            let color = "";
            switch (status) {
                case "pending":
                    color = "#f4d167";
                    break;
                case "payment received":
                    color = "#82cbf4";
                    break;
                case "delivered":
                    color = "#84e296";
                    break;
                case "cancelled":
                    color = "#f08989";
                    break;
            }
            return <Badge dot style={{ backgroundColor: color }} />;
        };

        return (
            <tr
                key={idx}
                onClick={() => {
                    console.log(d);
                    showMoreInfo();
                    setModalData(d);
                }}
            >
                <td>
                    <span className="buyer-name">{buyer.name}</span>
                    <br />
                    <span className="buyer-id">
                        ID: <span>{`${buyer.id}`}</span>
                    </span>
                </td>
                <td className="product-info-cell">
                    <span className="status-badge">{statusBadge()}</span>
                    <span>
                        {calcTotalAmount()}
                        <br />
                        <span className="delivery-date">{delivery.date}</span>
                    </span>
                </td>
            </tr>
        );
    });

    return (
        <div id="overview-table">
            <table>
                <thead>
                    <tr>
                        <th>Buyer</th>
                        <th>Information</th>
                    </tr>
                </thead>
                <tbody>{TableData}</tbody>
            </table>

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
