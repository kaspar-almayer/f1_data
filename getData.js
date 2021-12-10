import fetch from 'node-fetch';
import fs from 'fs';

let url = "";

let settings = { method: "Get" };


let uberData = {};

// fetch(`http://ergast.com/api/f1/2021/18/results.json`, settings)
//     .then(res => res.json())
//     .then((json) => {
//         const drivers = json.MRData.RaceTable.Races[0].Results
//         for (const driver of drivers) {
//             fetch(`http://ergast.com/api/f1/2021/18/drivers/${driver.Driver.driverId}/laps.json?limit=100`, settings)
//             .then(res => res.json())
//             .then((json) => {
//                 console.log(driver.Driver.code)
//                 const laps = json.MRData.RaceTable.Races[0].Laps.map(lap => lap.Timings[0].time)
//                 //uberData.push([driver.Driver.code, laps])
//                 uberData[driver.Driver.code] = laps
//             })
            
//         }
//         setTimeout(() => { 
//             console.log("after loop")
//             fs.readFile('mexico_gp.json', (err, data) => {
//                 if (err) throw err;
//                 let fromFile = JSON.parse(data);
//                 //console.log(driver.Driver.driverId)
            
//                 //fromFile.data[driver.Driver.code] = laps
//                 fromFile.data = uberData
            
//                 let newData = JSON.stringify(fromFile, null, 2);
            
//                 fs.writeFile('mexico_gp.json', newData, (err) => {
//                     if (err) throw err;
//                     console.log('Data written to file');
//                 });
//             });
//          }, 3000);
//     })


    fetch(`http://ergast.com/api/f1/2021/18/results.json`, settings)
    .then(res => res.json())
    .then((json) => {
        const drivers = json.MRData.RaceTable.Races[0].Results
        fs.readFile('mexico_gp.json', (err, data) => {
            if (err) throw err;
            let fromFile = JSON.parse(data);

            const inOrder = drivers.map(driver => {
                return {"driver": driver.Driver.code, "timings": fromFile.data[driver.Driver.code]}
            })
            
            fromFile.data = inOrder
        
            let newData = JSON.stringify(fromFile, null, 2);
        
            fs.writeFile('mexico_gp.json', newData, (err) => {
                if (err) throw err;
                console.log('Data written to file');
            });
        });
    })



