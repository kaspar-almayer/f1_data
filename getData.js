import fetch from 'node-fetch';
import fs from 'fs';
import minimist from 'minimist';
var argv = minimist(process.argv.slice(2));
// -r   race number
// -y   season

console.log(argv)

let settings = { method: "Get" };

fetch(`http://ergast.com/api/f1/2023/${argv.r}/results.json`, settings)
    .then(res => res.json())
    .then((json) => {
        const drivers = json.MRData.RaceTable.Races[0].Results.map(driver => { return {"driverId": driver.Driver.driverId, "driver": driver.Driver.code}})
        const raceName = json.MRData.RaceTable.Races[0].raceName
        for (const driver of drivers) {
            fetch(`http://ergast.com/api/f1/2023/${argv.r}/drivers/${driver.driverId}/laps.json?limit=100`, settings)
            .then(res => res.json())
            .then((json) => {
                console.log(driver.driverId)
                const laps = json.MRData.RaceTable.Races[0]?.Laps.map(lap => lap.Timings[0].time)
                const objIndex = drivers.findIndex((obj => obj.driver === driver.driver));
                drivers[objIndex].timings = laps
            })
            
        }
        setTimeout(() => { 
            console.log("after loop")
            fs.readFile('empty_data.json', (err, data) => {
                if (err) throw err;
                let fromFile = JSON.parse(data);
                fromFile = {
                    raceName,
                    data: drivers,
                }
            
                let newData = JSON.stringify(fromFile, null, 2);
            
                fs.writeFile(`${argv.r}.json`, newData, (err) => {
                    if (err) throw err;
                    console.log('Data written to file');
                });
            });
         }, 3000);
    })
