//Create a function to hide all elements
function hideAll() {
    d3.select("#table-tab").attr("style", "display:none")
    d3.select("#predict-tab").attr("style", "display:none")
    d3.select("#map-tab").attr("style", "display:none")
}
//Create a click event that will populate the table
d3.select("#table-tab-id").on("click", () => {
    hideAll()
    initTable()
    d3.select("#table-tab").attr("style", "display:block")
    d3.select("#home-tab").attr("style", "display:none")
})
//Create a click event that open predict tab
d3.select("#predict-tab-id").on("click", () => {
    hideAll()
    initPredict()
    d3.select("#predict-tab").attr("style", "display:block")
    d3.select("#home-tab").attr("style", "display:none")
})
//Create a click event that will populate the map
d3.select("#map-tab-id").on("click", () => {
    hideAll()
    d3.select("#map-tab").attr("style", "display:block")
    d3.select("#home-tab").attr("style", "display:none") 
})
//Create a click event that will bring you back to the home tab
d3.select("#home-tab-id").on("click", () => {
    hideAll()
    d3.select("#home-tab").attr("style", "display:block")

})

// ================================================================
//                  <--Tables and Graphs-->
// ================================================================

//--GRAPHS--

//Create the input box and dropdown for the plot
let sortByDropdownMenu = d3.select('#selSortBy')
//Add options for the dropdown
let dropDownOptions = ['Year','Month','Day of the Week','Origin','Destination','Airline']
dropDownOptions.forEach(header => {
    currentData = sortByDropdownMenu.append('option')
    currentData.text(header)
})

function initTable() {
    d3.json("/get_years_data").then(data => {
        keys = []
        graphs = []
        Object.entries(data).forEach(([key,dict])=>{
            keys.push(key)
            x = []
            y = []
            Object.entries(dict).forEach(([sortby,stat])=>{
                x.push(sortby)
                y.push(stat)  
            })
            var trace = {
                    x: x,
                    y: y,
                    type: 'line'
            };
            graphs.push(trace)
        })
        var layout = {
            title: 'MCI'
        };
        
        Plotly.newPlot('plot1', [graphs[0]],layout);
        Plotly.newPlot('plot2',[graphs[1]],layout)

        //--TABLE--

        // Select the table by id
        let worldTable = d3.select('#world-data')
        // Create a tbody
        let worldTableBody = worldTable.append('tbody')
        // Create the header for the table
        let headerRow = d3.select("#world-data").select('thead').append('tr')
        headerRow.append('th').text('Year')
        //Add the headers for the table and append options to the dropdown options list
        Object.keys(data).forEach(key => {
            if(key != '_id'){
                headerRow.append('th').text(key)
            }
        }) 
        // Fill in the table with data
        x.forEach(sortby=>{
            let newRow = worldTableBody.append('tr')
            newRow.append('td').text(sortby)
            Object.entries(data).forEach(([key,dict]) => {
            newRow.append('td').text(dict[sortby])
            })
        })
        
    })
}

function updatePlotly() {
    let sortby = sortByDropdownMenu.property("value")
    //Use D3 to get data from mongodb
        d3.json(`/get_${sortby}_data`).then(data => {
            keys = []
            graphs = []
            Object.entries(data).forEach(([key,dict])=>{
                keys.push(key)
                x = []
                y = []
                Object.entries(dict).forEach(([sortby,stat])=>{
                    x.push(sortby)
                    y.push(stat)  
                })
                var trace = {
                        x: x,
                        y: y,
                        type: 'line'
                };
                graphs.push(trace)
            })
            var layout = {
                title: 'MCI'
            };
            
            Plotly.newPlot('plot1', [graphs[0]],layout);
            Plotly.newPlot('plot2',[graphs[1]],layout)

            //--TABLE--

            // Select the table by id
            let worldTable = d3.select('#world-data')
            // Create a tbody
            let worldTableBody = worldTable.append('tbody')
            // Create the header for the table
            let headerRow = d3.select("#world-data").select('thead').append('tr')
            headerRow.append('th').text('Year')
            //Add the headers for the table and append options to the dropdown options list
            Object.keys(data).forEach(key => {
                if(key != '_id'){
                    headerRow.append('th').text(key)
                }
            }) 
            // Fill in the table with data
            x.forEach(sortby=>{
                let newRow = worldTableBody.append('tr')
                newRow.append('td').text(sortby)
                Object.entries(data).forEach(([key,dict]) => {
                newRow.append('td').text(dict[sortby])
                })
            })
        })

}
// // ================================================================
// //                  <--Predict-->
// // ================================================================

//Use d3 to select the dropdown options
let selectDay = d3.select("#selectDay");
let days = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,2,29,30,31]
days.forEach(day=>{
    currentData = selectDay.append('option')
    currentData.text(day)

})
let selectMonth = d3.select("#selectMonth");
let months = ['January', 'February', 'March', 'April', 'May', 'June','July','August','September','October','November','December']
months.forEach(month=>{
    currentData = selectMonth.append('option')
    currentData.text(month)
})
let selectDow = d3.select("#selectDOW");
let dows = ['Sunday', 'Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']
dows.forEach(dow=>{
    currentData = selectDow.append('option')
    currentData.text(dow)
})
let selectAMPM = d3.select("#selectAMPM");
currentData = selectAMPM.append('option')
currentData.text('AM')
currentData = selectAMPM.append('option')
currentData.text('PM')
let selectAirline = d3.select("#selectAirline");
let selectCity = d3.select("#selectCity");
let selectState = d3.select("#selectState");

function initPredict() {
    //Create an empty dictionary for the new flight info to predict
    let flightInfo = {}

    d3.json("/get_data").then(data => {
        console.log(data)
    //Get data from the mongo db to fill dropdown options
    
        //Grab keys from X dataframe
        let keys = []
        Object.keys(data).forEach(key => {
            keys.push(key)
        })
        // //remove the first two columns
        // keys.shift();
        // keys.shift();
        //Return 0 for each key as a placeholder
        keys.forEach(key=> {
            flightInfo[key] = 0
        })
        console.log(flightInfo);

        //Add options for the dropdown
        Object.keys(flightInfo).forEach(key => {
            if (key.includes('DEST_CITY_NAME')){
                currentData = selectCity.append('option')
                currentData.text(key.replace('DEST_CITY_NAME_',''))
            }
            if (key.includes('DEST_STATE_NM')){
                currentData = selectState.append('option')
                currentData.text(key.replace('DEST_STATE_NM_',''))
            }
            if (key.includes('MKT_UNIQUE_CARRIER_')){
                currentData = selectAirline.append('option')
                currentData.text(key.replace('MKT_UNIQUE_CARRIER_',''))
            }
        })
    })
    // //Use d3 to select the predict button
    // let submit = d3.select("#submit");
    // //Use d3 to select the output box
    // let response = d3.select("#response");
    // submit.on("click", () => {
    //     //reset the text to empty
    //     response.text('')
    //     //grab the values from each dropdown and input box
    //     let destination = destinationPredictMenu.property("value");
    //     let date = datePredictMenu.property("value");
    //     let time = timePredictMenu.property("value");
    //     let carrier = airlinePredictMenu.property("value");
    //     //update the flight info we want to predict
    //     Object.keys(flightInfo).forEach(key => {
    //         if (key.includes(destination)){
    //             flightInfo[key] = 1
    //         }
    //         if (key.includes(date)){
    //             flightInfo[key] = 1
    //         }
    //         if (key.includes(carrier)){
    //             flightInfo[key] = 1
    //         }
    //         if (key.includes(day)){
    //             flightInfo[key] = 1
    //         }
    //     })
    //     flightInfo['CRS_DEP_TIME']=parseFloat(time)
    //     //create an empty list for values
    //     let readyToPredict = []
    //     Object.keys(flightInfo).forEach(key => {
    //         readyToPredict.push(flightInfo[key])
    //     })
    //     console.log(readyToPredict)
    //     //create a payload to give the data to the predict flask
    //     payload = {data: readyToPredict}
    //     //use the code from app.py to make a prediction on the payload data
    //     d3.text("/predict", {
    //         method: "POST",
    //         headers: {
    //             "Content-Type": "application/x-www-form-urlencoded"
    //         },
    //         body: "data=" +  JSON.stringify(payload) // add it to the http header as a json string
    //     }).then(data => {
    //         //display the data in div 'response'
    //         response.text(`${data} ${response.text()}`)
    //         //log the data
    //         console.log('this is what the response from flask was')
    //         console.log(data);
    //     });
    // })
}  
// Run initial functions
hideAll()
