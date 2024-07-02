// //Create a function to hide all elements
// function hideAll() {
//     d3.select("#table-tab").attr("style", "display:none")
//     d3.select("#predict-tab").attr("style", "display:none")
//     d3.select("#map-tab").attr("style", "display:none")
// }
// //Create a click event that will populate the table
// d3.select("#table-tab-id").on("click", () => {
//     hideAll()
//     initTable()
//     d3.select("#table-tab").attr("style", "display:block")
//     d3.select("#home-tab").attr("style", "display:none")
// })
// //Create a click event that open predict tab
// d3.select("#predict-tab-id").on("click", () => {
//     hideAll()
//     initPredict()
//     d3.select("#predict-tab").attr("style", "display:block")
//     d3.select("#home-tab").attr("style", "display:none")
// })
// //Create a click event that will populate the map
// d3.select("#map-tab-id").on("click", () => {
//     hideAll()
//     d3.select("#map-tab").attr("style", "display:block")
//     d3.select("#home-tab").attr("style", "display:none") 
// })
// //Create a click event that will bring you back to the home tab
// d3.select("#home-tab-id").on("click", () => {
//     hideAll()
//     d3.select("#home-tab").attr("style", "display:block")

// })

// ================================================================
//                  <--Tables and Graphs-->
// ================================================================

//--GRAPHS--

//Create the input box and dropdown for the plot
let sortByDropdownMenu = d3.select('#selSortBy')
//Add options for the dropdown
let dropDownOptions = ['Year','Month','Day of the Week','Airline']
dropDownOptions.forEach(header => {
    currentData = sortByDropdownMenu.append('option')
    currentData.text(header)
})

function initTable() {
    d3.json("/get_Year_data").then(data => {
        var i = 0
        sortbys = []
        counts = []
        means = []
        Object.entries(data).forEach(element=>{
            Object.entries(element[1]).forEach(([key,value])=>{
                if(i==1){
                    sortbys.push(value)
                }
                if(i==2){
                    counts.push(value)
                }
                if(i==3){
                    means.push(value)
                }
            })
            i+=1
        })
        trace_counts = {
            x: sortbys,
            y: counts
        }
        layout_counts = {
            title: 'Number of Flights'
        }
        trace_means = {
            x: sortbys,
            y: means
        }
        layout_means = {
            title: 'Average Departure Delay Rate'
        }
        Plotly.newPlot('plot1', [trace_counts],layout_counts);
        Plotly.newPlot('plot2',[trace_means],layout_means)


        // //--TABLE--

        // // Select the table by id
        // let worldTable = d3.select('#world-data')
        // // Create a tbody
        // let worldTableBody = worldTable.append('tbody')
        // // Create the header for the table
        // let headerRow = d3.select("#world-data").select('thead').append('tr')
        // //Add the headers for the table and append options to the dropdown options list
        // Object.keys(data).forEach(key => {
        //     if(key != '_id'){
        //         headerRow.append('th').text(key)
        //     }
        // }) 
        // // Fill in the table with data
        // x.forEach(sortby=>{
        //     let newRow = worldTableBody.append('tr')
        //     newRow.append('td').text(sortby)
        //     Object.entries(data).forEach(([key,dict]) => {
        //     newRow.append('td').text(dict[sortby])
        //     })
        // })
        
    })
}

function updatePlotly() {
    let sortby = sortByDropdownMenu.property("value")
    //Use D3 to get data from mongodb
        d3.json(`/get_${sortby}_data`).then(data => {
            var i = 0
            var sortbys = []
            var counts = []
            var means = []
            console.log(data)
            Object.entries(data).forEach(element=>{
                Object.entries(element[1]).forEach(([key,value])=>{
                    if(i==1){
                        sortbys.push(value)
                    }
                    if(i==2){
                        counts.push(value)
                    }
                    if(i==3){
                        means.push(value)
                    }
                })
                i+=1
            })
            trace_counts = {
                x: sortbys,
                y: counts,
            }
            layout_counts = {
                title: 'Number of Flights'
            }
            trace_means = {
                x: sortbys,
                y: means
            }
            layout_means = {
                title: 'Average Departure Delay Rate'
            }
            Plotly.newPlot('plot1', [trace_counts],layout_counts);
            Plotly.newPlot('plot2',[trace_means],layout_means)

            // //--TABLE--

            // // Select the table by id
            // let worldTable = d3.select('#world-data')
            // // Create a tbody
            // let worldTableBody = worldTable.append('tbody')
            // // Create the header for the table
            // let headerRow = d3.select("#world-data").select('thead').append('tr')
            // headerRow.append('th').text('Year')
            // //Add the headers for the table and append options to the dropdown options list
            // Object.keys(data).forEach(key => {
            //     if(key != '_id'){
            //         headerRow.append('th').text(key)
            //     }
            // }) 
            // // Fill in the table with data
            // x.forEach(sortby=>{
            //     let newRow = worldTableBody.append('tr')
            //     newRow.append('td').text(sortby)
            //     Object.entries(data).forEach(([key,dict]) => {
            //     newRow.append('td').text(dict[sortby])
            //     })
            // })
        })

}
// // ================================================================
// //                  <--Predict-->
// // ================================================================

//Use d3 to select the dropdown options
let selectDate = d3.select("#selectDate");
let selectTime = d3.select("#selectTime");
let selectAirline = d3.select("#selectAirline");
let selectOrigin = d3.select("#selectOrigin");
let selectDest = d3.select("#selectDest");
let selectDOW = d3.select("#selectDOW");
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
    keys.shift();
    keys.shift();
    //Return 0 for each key as a placeholder
    keys.forEach(key=> {
        flightInfo[key] = 0
    })
    console.log(flightInfo);

    //Add options for the dropdown
    dows = [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday'
    ]
    dows.forEach(dow=>{
        currentData = selectDOW.append('option')
        currentData.text(dow)
    })
    Object.keys(flightInfo).forEach(key => {
        if(selectOrigin.text() == ''){
            
        }
        if (key.includes('ORIGIN_')){
            currentData = selectOrigin.append('option')
            currentData.text(key.replace('ORIGIN_',''))
        }
        if (key.includes('DEST_')){
            currentData = selectDest.append('option')
            currentData.text(key.replace('DEST_',''))
        }

        if (key.includes('MKT_UNIQUE_CARRIER_')){
            currentData = selectAirline.append('option')
            currentData.text(key.replace('MKT_UNIQUE_CARRIER_',''))
        }
    })
})
function initPredict() {

    //Use d3 to select the predict button
    let submit = d3.select("#submit");
    //Use d3 to select the output box
    let response = d3.select("#response");
    submit.on("click", () => {
        //reset the text to empty
        response.text('')
        var origin = document.getElementById("selectOrigin").value;
        var dest = document.getElementById("selectDest").value;
        if (origin == dest){
            response.text("Origin and Destination cannot be the same. Please try again.")
        }
        else if ((origin == 'MCI')||(dest == 'MCI')){
            //grab the values from each dropdown and input box
            let origin = selectOrigin.property("value");
            let destination = selectDest.property("value");
            let dow = selectDOW.property("value")
            let date = selectDate.property("value").split('-');
            let year = "new"
            let months = {
                1: "January",
                2: "February",
                3: "March",
                4: "April",
                5: "May",
                6: "June",
                7: "July",
                8: "August",
                9: "September",
                10: "October",
                11: "November",
                12: "December"
            }
            let month = months[parseInt(date[1])]
            let day = parseInt(date[2])
            let timeblks = {
                0 : "0001-0559",
                1 : "0001-0559",
                2 : "0001-0559",
                3 : "0001-0559",
                4 : "0001-0559",
                5 : "0001-0559",
                6 :"0600-0659",
                7 :"0700-0759",
                8 :"0800-0859",
                9 :"0900-0959",
                10 :"1000-1059",
                11 :"1100-1159",
                12 :"1200-1259",
                13 :"1300-1359",
                14 :"1400-1459",
                15 :"1500-1559",
                16 :"1600-1659",
                17 :"1700-1759", 
                18 :"1800-1859", 
                19 :"1900-1959", 
                20 :"2000-2059",
                21 :"2100-2159",
                22 :"2200-2259", 
                23 :"2300-2359",
            }
            let time = selectTime.property("value").split(':');
            let timeblk = timeblks[parseInt(time[0])]
            let carrier = selectAirline.property("value");
            console.log(time)
            //update the flight info we want to predict
            Object.keys(flightInfo).forEach(key => {
                flightInfo[key] = 0
            })
            Object.keys(flightInfo).forEach(key => {
                if (key.includes("ORIGIN_" + origin)){
                    flightInfo[key] = 1
                }
                if (key.includes("DEST_" +destination)){
                    flightInfo[key] = 1
                }
                if (key.includes(year)){
                    flightInfo[key] = 1
                }
                if (key.includes(carrier)){
                    flightInfo[key] = 1
                }
                if (key.includes(month)){
                    flightInfo[key] = 1
                }
                if (key.includes(day)){
                    flightInfo[key] = 1
                }
                if (key.includes(timeblk)){
                    flightInfo[key] = 1
                }
                if (key.includes(dow)){
                    flightInfo[key] = 1
                }
            })
            console.log(flightInfo)
            // flightInfo['CRS_DEP_TIME']=parseFloat(time)
            //create an empty list for values
            let readyToPredict = []
            Object.keys(flightInfo).forEach(key => {
                readyToPredict.push(flightInfo[key])
            })
            console.log(readyToPredict)
            //create a payload to give the data to the predict flask
            payload = {data: readyToPredict}
            //use the code from app.py to make a prediction on the payload data
            d3.text("/predict", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: "data=" +  JSON.stringify(payload) // add it to the http header as a json string
            }).then(data => {
                //display the data in div 'response'
                response.text(`${data} ${response.text()}`)
                //log the data
                console.log('this is what the response from flask was')
                console.log(data);
            });
        }else{
            response.text("Origin or Destination must be MCI. Please try again.")
        }
    })
}  
// // Run initial functions
// hideAll()
initTable()
initPredict()
