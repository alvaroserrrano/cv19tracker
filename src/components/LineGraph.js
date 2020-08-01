import React, { useState } from "react";
import { Line } from "react-chartjs-2";

function LineGraph() {
    const [data, setData] = useState({});
    useEffect(() => {
        fetch("https://disease.sh/v3/covid-19/historical/all?lastdays=90")
            .then("https://disease.sh/v3/covid-19/historical/all?lastdays=90")
            .then(res => res.json())
            .then(data => {
                console.log(data);
            });
    });

    return <div>LineGraph</div>;
}

export default LineGraph;
