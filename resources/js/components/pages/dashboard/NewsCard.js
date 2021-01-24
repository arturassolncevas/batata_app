import React from "react";
import { Space, Badge, Avatar } from "antd";

const NewsCard = ({ tag, topic, authorName, jobDesc, authorImg, time }) => {
    const buildOrigin = () => {
        let color = "";
        let origin = "";
        switch (tag) {
            case "blog":
                color = "#3374ED";
                origin = "from our blog";
                break;

            case "promotions":
                color = "#F1C836";
                origin = "promotions";
                break;

            case "news":
                color = "#FF4949";
                origin = "news and alerts";
                break;

            default:
                break;
        }

        return (
            <Space>
                <Badge color={color} />
                <p className="m-0 text-normal text-light text-uppercase">
                    {origin}
                </p>
            </Space>
        );
    };

    return (
        <div className="news-card rounded my-4 p-4">
            {tag && buildOrigin()}
            <h4 className="text-caption text-dark text-capitalize my-4 lh-sm">
                {topic}
            </h4>
            <div className="w-100 d-flex justify-content-between align-items-end">
                <Space className="d-flex align-items-center">
                    <Avatar size="medium" shape="circle" src={authorImg} />
                    <span className="d-flex flex-column justify-content-between align-items-start">
                        <p className="m-0 text-normal text-light text-capitalize">
                            {authorName}
                        </p>
                        {jobDesc && (
                            <p className="m-0 text-caption-small text-grey">
                                {jobDesc}
                            </p>
                        )}
                    </span>
                </Space>

                <time className="text-caption-small text-grey">
                    Published {time}
                </time>
            </div>
        </div>
    );
};

export default NewsCard;
