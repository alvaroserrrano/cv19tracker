import React, { useState, useEffect } from "react";
import "./styles/App.css";
import { sortData } from "./utils";
import InfoContainer from "./components/InfoContainer";
import Map from "./components/Map";
import LineGraph from "./components/LineGraph";
import Table from "./components/Table";
import {
    FormControl,
    Icon,
    Select,
    MenuItem,
    Paper,
    Switch,
    ThemeProvider,
    createMuiTheme,
    Card,
    CardContent
} from "@material-ui/core";

function App() {
    const [darkMode, setDarkMode] = useState(true);
    const theme = createMuiTheme({
        palette: {
            type: darkMode ? "dark" : "light"
        }
    });
    const [countries, setCountries] = useState([]);
    // use worldwide view by default for the selec
    const [country, setCountry] = useState("worldwide");
    const [countryInfo, setCountryInfo] = useState({});
    const [tableData, setTableData] = useState([]);
    const [casesType, setCasesType] = useState("cases");
    useEffect(() => {
        fetch("https://disease.sh/v3/covid-19/all")
            .then(res => res.json())
            .then(data => {
                setCountryInfo(data);
            });
    }, []);
    useEffect(() => {
        const getCountries = async () => {
            await fetch(
                "https://disease.sh/v3/covid-19/countries?yesterday=true&sort=cases"
            )
                .then(res => res.json())
                .then(data => {
                    const countries = data.map(country => ({
                        name: country.country,
                        val: country.countryInfo.iso3,
                        id: country._id
                    }));
                    const sortedData = sortData(data);
                    setTableData(data);
                    setCountries(countries);
                });
        };
        getCountries();
    }, []);
    const changeSelectedCountry = async e => {
        const countryCode = e.target.value;
        setCountry(countryCode);
        const url =
            countryCode === "worldwide"
                ? "https://disease.sh/v3/covid-19/all"
                : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
        await fetch(url)
            .then(res => res.json())
            .then(data => {
                setCountryInfo(data);
            });
    };
    return (
        <ThemeProvider theme={theme}>
            <Paper style={{ height: "100vh" }}>
                <div className="app">
                    <div className="app__left">
                        <div className="app__header">
                            <h1>Covid19 Eavesdropper</h1>
                            <FormControl className="app__dropdown">
                                <Select
                                    variant="filled"
                                    value={country}
                                    onChange={changeSelectedCountry}
                                >
                                    <MenuItem value="worldwide">
                                        Worldwide
                                    </MenuItem>
                                    {countries.map(country => (
                                        <MenuItem
                                            value={country.val}
                                            key={country.id}
                                        >
                                            {country.name} - {country.val}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            <Switch
                                className="app__switch"
                                checked={darkMode}
                                onChange={() => setDarkMode(!darkMode)}
                            ></Switch>
                        </div>
                        <div className="app__stats">
                            <InfoContainer
                                title="Coronavirus cases"
                                cases={countryInfo.todayCases}
                                total={countryInfo.cases}
                            ></InfoContainer>
                            <InfoContainer
                                title="Recovered"
                                cases={countryInfo.todayRecovered}
                                total={countryInfo.recovered}
                            ></InfoContainer>
                            <InfoContainer
                                title="Deaths"
                                cases={countryInfo.todayDeaths}
                                total={countryInfo.deaths}
                            ></InfoContainer>
                        </div>
                        <Map></Map>
                    </div>
                    <Card className="app__right">
                        <CardContent>
                            <h3>Live cases by country</h3>
                            <Table countries={tableData}></Table>
                            <h3>Worldwide new cases</h3>
                            <LineGraph />
                        </CardContent>
                    </Card>
                </div>
            </Paper>
        </ThemeProvider>
    );
}

export default App;
