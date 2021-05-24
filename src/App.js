import React, { useEffect, useState } from "react";
import "./App.css";
import "./style.css";
import { hondaWmiApi } from "./hondaWmiApi";

function App() {
  const keys = ["Name", "WMI", "Country", "CreatedOn", "VehicleType"];
  const [initialData, setInitialData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [uniqueCountries, setUniqueCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [searchText, setSearchText] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Getting Initial Data
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    filterData(searchText, selectedCountry);
  }, [initialData, searchText, selectedCountry]);

  // Get Data
  const fetchData = () => {
    hondaWmiApi.getData()
      .then((result) => {
        setIsLoaded(true);
        setInitialData(sortData(result));
        setUniqueCountries(filterUniqueCountries(result));
      }, (error) =>{
        console.log("Cannot Fetch Data: " + error)
      });
  }

  // Filter Unique Countries
  const filterUniqueCountries = (data) => {
    var result = [];
    data.forEach((element) => {
      if (element.Country != null && !result.includes(element.Country)) {
        result.push(element.Country);
      }
    });
    return result;
  };

  // Filter Data by CreatedOn and WMI
  const sort1 = "CreatedOn";
  const sort2 = "WMI";
  const sortData = (data) => {
    return data.sort(function (a, b) {
      return a[sort1] === b[sort1]
        ? a[sort2] < b[sort2]
          ? -1
          : 1
        : a[sort1] > b[sort1]
        ? 1
        : -1;
    });
  };

  const searchCountry = (country) => {
    setSelectedCountry(country);
  };

  const searchData = (search) => {
    setSearchText(search);
  };

  // Filter data by SearchText and SelectedCountry
  const filterData = (searchText, selectedCountry) => {
    if (!searchText && !selectedCountry) {
      setFilteredData(initialData);
      return;
    }

    var filtered = initialData;
    if (selectedCountry) {
      filtered = filtered.filter((x) => x.Country === selectedCountry);
    }

    if (searchText) {
      filtered = filtered.filter((x) => {
        return (
          x.Name.toLowerCase().indexOf(searchText.toLowerCase()) > -1 ||
          x.WMI.toLowerCase().indexOf(searchText.toLowerCase()) > -1 ||
          x.VehicleType.toLowerCase().indexOf(searchText.toLowerCase()) > -1 ||
          x.CreatedOn.toLowerCase().indexOf(searchText.toLowerCase()) > -1
        );
      });
    }

    setFilteredData(sortData(filtered));
  };

  return (
    <div className="App">
      <header className="header">
        WMI Data - Honda | Total: {initialData.length} | Filtered: {filteredData.length}
      </header>
      <div className="filter-box">
        <span>
          <label htmlFor="search">Search: </label>
          <input
            type="text"
            id="search"
            placeholder="Search"
            onChange={(e) => searchData(e.target.value)}
          />
        </span>
        <span>
          <label htmlFor="country">Country: </label>
          <select id="country" onChange={(e) => searchCountry(e.target.value)}>
            <option value="">View All</option>
            {uniqueCountries.map((x) => (
              <option key={x} value={x}>
                {x}
              </option>
            ))}
          </select>
        </span>
      </div>
      <table>
        <thead>
          <tr>
            {keys.map((k) => (
              <th key={k}>{k}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {isLoaded ? (
            filteredData.length > 0 ? (
              filteredData.map((d) => {
                const wmi = d.WMI;
                return (
                  <tr key={wmi}>
                    {keys.map((k) => (
                      <td key={`${wmi}-${k}`}>{d[k]}</td>
                    ))}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="5">No matching data</td>
              </tr>
            )
          ) : (
            <tr>
              <td colSpan="5"><div className="loader">Loading...</div></td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;
