import React, { useState } from "react";
import "../styles/InfoContainer.css";
import { Card, CardContent, Typography } from "@material-ui/core";

function InfoContainer({ title, active, cases, isRed, total, ...props }) {
    return (
        <Card
            onClick={props.onClick}
            className={`infoContainer ${active && "infoContainer--selected"} ${
                isRed && "infoContainer--red"
            }`}
        >
            <CardContent className="card__content" card__content>
                <Typography
                    color="textSecondary"
                    className="infoContainer__title"
                >
                    {title}
                </Typography>
                <h2
                    className={`infoContainer__cases ${
                        !isRed && "infoContainer__cases--green"
                    }`}
                >
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
