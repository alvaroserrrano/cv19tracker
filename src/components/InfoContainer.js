import React, { useState } from "react";
import "../styles/InfoContainer.css";
import { Card, CardContent, Typography } from "@material-ui/core";

function InfoContainer({ title, cases, total, ...props }) {
    return (
        <Card onClick={props.onClick} className="infoContainer">
            <CardContent className="card__content" card__content>
                <Typography
                    color="textSecondary"
                    className="infoContainer__title"
                >
                    {title}
                </Typography>
                <h2 className="infoContainer__cases" color="textSecondary">
                    {cases}
                </h2>
                <Typography
                    className="infoContainer__total"
                    color="textSecondary"
                >
                    {total} Total
                </Typography>
            </CardContent>
        </Card>
    );
}

export default InfoContainer;
