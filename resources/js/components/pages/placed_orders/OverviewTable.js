import React, { useState } from "react";
import { MoreInfo, CancelModal, Result } from "./Modals";
import { Badge, Table, Row } from "antd";
import { withRouter } from "react-router-dom";
import { injectIntl } from "react-intl";
import moment from "moment";

const OverviewTable = ({ data, pagination, formatPrice, intl }) => {
    const [isMoreInfoVisible, setIsMoreInfoVisible] = useState(false);
    const [isCancelModalVisible, setIsCancelModalVisible] = useState(false);
    const [isResultModalVisible, setIsResultModalVisible] = useState(false);
    const [modalData, setModalData] = useState({});

    const showMoreInfo = () => {
        setIsMoreInfoVisible(true);
    };

    const { Column } = Table;

    return (
        <div id="overview-table">
            <Table
                dataSource={data}
                pagination={pagination}
                onRow={record => {
                    return {
                        onClick: () => {
                            console.log(record);
                            showMoreInfo();
                            setModalData(record);
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
                                    ID:
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
                formatPrice={formatPrice}
                intl={intl}
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

export default withRouter(injectIntl(OverviewTable));
