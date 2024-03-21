let axios = require('axios');
var express = require('express')
var app = express()


function arePointsNear(checkPoint, centerPoint, km) {
    var ky = 40000 / 360;
    var kx = Math.cos(Math.PI * centerPoint.lat / 180.0) * ky;
    var dx = Math.abs(centerPoint.lng - checkPoint.lng) * kx;
    var dy = Math.abs(centerPoint.lat - checkPoint.lat) * ky;
    return Math.sqrt(dx * dx + dy * dy) <= km;
}

async function getCodeJamEventsGeoLocation(){
    let main = {}
    let codejam_events_list = [];
    const centerPoint = {lat:12.971599, lng: 77.594566};
    const now = Date.now();
    
   // console.log("timestamp", now);

    const community_codejam_events_api = 'https://community.sap.com/khhcw49343/api/2.0/search?q=select+%2A+from+messages+where+board.id+%3D+%27codejam-events%27+and+occasion_data.start_time+%3E'+ now + 'and+depth+%3D+0+order+by+occasion_data.start_time+';

    const before = Date.now();
    const codejam_events = await axios(community_codejam_events_api);
    const codejam_events_dump = await codejam_events.data;
    // const after = Date.now();
    // const duration = after-before;
    // console.log("axios call", duration);

    const before1 = Date.now();   
    codejam_events_dump.data.items.forEach((item) => {
        let significant_event_info = {};

        significant_event_info.view_href = item.view_href;
        significant_event_info.subject = item.subject;
        significant_event_info.address = item.occasion_data.location;
        significant_event_info.timezone = item.occasion_data.timezone;


        if(significant_event_info.timezone == 'Asia/Calcutta'){
            codejam_events_list.push(significant_event_info);

            // geocoder.search( { q: item.occasion_data.location } ).then((coordinates) => {
            //     console.log(coordinates);
            //     if(arePointsNear(coordinates, centerPoint, 500)){
            //         console.log(significant_event_info.address);
            //         codejam_events_list.push(significant_event_info);
            //     }
            
            // })
            // .catch((error) => {
            //     console.log(error)
            // })
        }
       

        
    });
    
    // const after1 = Date.now();
    // const duration1 = after1-before1;
    // console.log("for each loop duration", duration1);
    //console.log(codejam_events_list);
    main.results = codejam_events_list;
    return main;
}


app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
})

app.get('/api', async function(req, res){

    var output = await getCodeJamEventsGeoLocation();
    // send results or render custom UI
    var apioutput = output;
    console.log(apioutput);
    res.send(apioutput);

})  
  // http://localhost:3000
  app.listen(3000, () => console.log('Example app listening on port 3000!'))
  