import React, { useState } from "react";
import { Modal, Divider, Tag, Button } from "antd";

export const MoreInfo = ({
    setIsModalVisible,
    isModalVisible,
    openCancelModal,
    data
}) => {
    let { buyer, image, delivery, product, status } = data;

    const displayProducts = () => {
        if (Array.isArray(product)) {
            let totalAmount = 0;
            let products = product.map((p, idx) => {
                let { title, quantity, measure, price } = p;
                totalAmount += parseFloat(price.split("DKK ")[1]);
                return (
                    <div key={idx} className="product-cell">
                        <div className="product-info">
                            <span className="product-name">{title}</span> <br />
                            <span className="product-desc">{`${quantity} of ${measure}`}</span>
                        </div>

                        <span className="product-amount">
                            DKK
                            <span>{price.split("DKK ")[1]}</span>
                        </span>
                    </div>
                );
            });

            return (
                <div className="products-wrapper">
                    {products}
                    <Divider />
                    <p className="total-amount">
                        Total :
                        <span>
                            DKK
                            <span>{`${parseFloat(
                                totalAmount.toFixed(2)
                            )}`}</span>
                        </span>
                    </p>
                </div>
            );
        } else {
            let { price, title, quantity, measure } = product;
            return (
                <div className="products-wrapper">
                    <div className="product-cell">
                        <div className="product-info">
                            <span className="product-name">{title}</span> <br />
                            <span className="product-desc">{`${quantity} of ${measure}`}</span>
                        </div>

                        <span className="product-amount">
                            DKK
                            <span>{price.split("DKK ")[1]}</span>
                        </span>
                    </div>
                </div>
            );
        }
    };

    const displayStatus = () => {
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
        return (
            <Tag className="status" color={color}>
                {status}
            </Tag>
        );
    };

    const handleOk = () => {
        setIsModalVisible(false);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
        openCancelModal(true);
    };

    return (
        <Modal
            centered
            visible={isModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            footer={null}
        >
            {buyer !== undefined && (
                <div id="more-info">
                    <div className="buyer-info">
                        <div>
                            {image}
                            <div>
                                <span className="buyer-name">{buyer.name}</span>
                                <br />
                                <span className="buyer-id">
                                    ID: <span>{`${buyer.id}`}</span>
                                </span>
                            </div>
                        </div>
                        {displayStatus()}
                    </div>
                    <div className="delivery-info">
                        <span className="delivery-date">{delivery.date} </span>
                        <br />
                        <span className="delivery-type">{delivery.type} </span>
                    </div>
                    {displayProducts()}
                    <div className="footer">
                        <Button
                            className="cancel"
                            key="back"
                            onClick={handleCancel}
                        >
                            Cancel Order
                        </Button>
                    </div>
                </div>
            )}
        </Modal>
    );
};

export const CancelModal = ({
    setIsModalVisible,
    isModalVisible,
    openResult
}) => {
    const [loading, setLoading] = useState(false);

    const handleOk = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setIsModalVisible(false);
        }, 3000);
    };

    const handleCancel = () => {
        setIsModalVisible(false);
    };

    const onClose = () => {
        openResult(true);
        setTimeout(() => {
            openResult(false);
        }, 1500);
    };

    return (
        <Modal
            visible={isModalVisible}
            closable={false}
            footer={null}
            width={290}
            centered
            afterClose={() => {
                console.log("cancel modal closed");
                onClose();
            }}
        >
            <div id="cancel-modal">
                <p className="text-normal text-dark">
                    Are you sure you want to cancel this order?
                </p>
                <div className="footer">
                    <Button className="text-small" onClick={handleCancel}>
                        no, go back
                    </Button>
                    <Button
                        className="cancel text-small"
                        loading={loading}
                        onClick={handleOk}
                    >
                        yes, cancel order
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export const Result = ({ isModalVisible }) => {
    const CloseIcon = (
        <svg
            className="close-icon"
            width="72"
            height="59"
            viewBox="0 0 72 59"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M29.8953 58.7907C45.8538 58.7907 58.7907 45.8538 58.7907 29.8953C58.7907 13.9369 45.8538 1 29.8953 1C13.9369 1 1 13.9369 1 29.8953C1 45.8538 13.9369 58.7907 29.8953 58.7907Z"
                fill="#EDEEEF"
            />
            <path
                d="M1 29.8954C1 13.9369 13.9369 1 29.8954 1"
                stroke="black"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <rect
                width="25.8287"
                height="6.45718"
                transform="matrix(-0.707107 -0.707107 -0.707107 0.707107 71.2638 45.9946)"
                fill="#84E296"
            />
            <rect
                width="25.8287"
                height="6.45718"
                transform="matrix(-0.707107 -0.707107 -0.707107 0.707107 53.0001 27.731)"
                fill="#FF8098"
            />
            <rect
                x="30.9068"
                y="45.9946"
                width="51.6574"
                height="6.45718"
                transform="rotate(-45 30.9068 45.9946)"
                fill="#001427"
            />
        </svg>
    );

    return (
        <Modal
            centered
            visible={isModalVisible}
            closable={false}
            footer={null}
            width={290}
        >
            <div id="result">
                {CloseIcon}
                <p className="text-normal text-dark">Order cancelled</p>
            </div>
        </Modal>
    );
};
