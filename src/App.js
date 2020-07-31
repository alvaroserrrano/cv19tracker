import React, { useState, useEffect } from "react";
import "./styles/App.css";
import {
    FormControl,
    Select,
    MenuItem,
    Paper,
    Switch,
    ThemeProvider,
    createMuiTheme
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
                    setCountries(countries);
                });
        };
        getCountries();
    }, []);
    const changeSelectedCountry = e => {
        const countryCode = e.target.value;
        setCountry(countryCode);
    };
    return (
        <div className="App">
            <ThemeProvider theme={theme}>
                <Paper style={{ height: "100vh" }}>
                    <div className="app__header">
                        <h1>Covid19 Eavesdropper</h1>
                        <FormControl className="app__dropdown">
                            <Select
                                variant="filled"
                                value={country}
                                onChange={changeSelectedCountry}
                            >
                                <MenuItem value="worldwide">Worldwide</MenuItem>
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
                            checked={darkMode}
                            onChange={() => setDarkMode(!darkMode)}
                        ></Switch>
                    </div>
                </Paper>
            </ThemeProvider>
        </div>
    );
}

export default App;
