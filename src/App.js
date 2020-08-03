import React, { useState, useEffect } from "react";
import "./styles/App.css";
import { sortData, formatStat, formatLargeStat } from "./utils";
import InfoContainer from "./components/InfoContainer";
import Map from "./components/Map";
import "leaflet/dist/leaflet.css";
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
    const [mapCenter, setMapCenter] = useState({
        lat: 34.80746,
        lng: -40.4796
    });
    const [mapZoom, setMapZoom] = useState(3);
    const [mapCountries, setMapCountries] = useState([]);
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
                    setMapCountries(data);
                });
        };
        getCountries();
    }, []);
    const changeSelectedCountry = async e => {
        const countryCode = e.target.value;
        const url =
            countryCode === "worldwide"
                ? "https://disease.sh/v3/covid-19/all"
                : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
        await fetch(url)
            .then(res => res.json())
            .then(data => {
                setCountry(countryCode);
                setCountryInfo(data);
                setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
                setMapZoom(4);
            });
    };
    return (
        <ThemeProvider theme={theme}>
            <Paper style={{ height: "100vh" }}>
                <div className="app">
                    <div className="app__left">
                        <div className="app__header">
                            <h1>Covid19 {casesType}</h1>
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
                                onClick={e => setCasesType("cases")}
                                title="Coronavirus cases"
                                cases={formatStat(countryInfo.todayCases)}
                                total={formatStat(countryInfo.cases)}
                            ></InfoContainer>
                            <InfoContainer
                                onClick={e => setCasesType("recovered")}
                                title="Recovered"
                                cases={formatStat(countryInfo.todayRecovered)}
                                total={formatStat(countryInfo.recovered)}
                            ></InfoContainer>
                            <InfoContainer
                                onClick={e => setCasesType("deaths")}
                                title="Recovered"
                                title="Deaths"
                                cases={formatStat(countryInfo.todayDeaths)}
                                total={formatStat(countryInfo.deaths)}
                            ></InfoContainer>
                        </div>
                        <Map
                            countries={mapCountries}
                            casesType={casesType}
                            center={mapCenter}
                            zoom={mapZoom}
                        ></Map>
                    </div>
                    <Card className="app__right">
                        <CardContent>
                            <h3>Live cases by country</h3>
                            <Table countries={tableData}></Table>
                            <h3>Worldwide new {casesType}</h3>
                            <LineGraph casesType={casesType} />
                        </CardContent>
                    </Card>
                </div>
            </Paper>
        </ThemeProvider>
    );
}

export default App;
