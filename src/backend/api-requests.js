const { closeSync } = require("original-fs");
const {data_top8Data} = require("./api_requested_data");

var msg = 'Hello World';
console.log(msg);


let lastEventID = null;
let eventPhases = null;
let Top8PhaseID = null;


let query = /* GraphQL */ `
query getEventId($slug: String) {
  event(slug: $slug) {
    id
    name
    startAt
  }
},

`;


let variables = {
    "slug": "null"
  }


let placementQuery =
 `query EventStandings($eventId: ID!, $page: Int!, $perPage: Int!) {
  event(id: $eventId) {
    id
    name
    standings(query: {
      perPage: $perPage,
      page: $page
    }){
      nodes {
        placement
        entrant {
          id
          name
        }
      }
    }
  }
}`;

let placementVars = 
{
  "eventId": null,
  "page": 1,
  "perPage": 8
}

const getPhasesInEvent = 
  `query getAllPhases($eventId: ID!) {
    event(id: $eventId) {
      id
      name
      phaseGroups{
        bracketUrl
        displayIdentifier
      }
      phases(state:null, phaseId:null)
      {
      id
      name
      phaseOrder
      }
    }
  }`;

  const getPhasesinEventVars = 

  {
    "eventId": 1261806
  };


  
const getSetsFromPhase =
`query PhaseSets($phaseId: ID!, $page: Int!, $perPage: Int!) {
  phase(id: $phaseId) {
    id
    name
    sets(
      page: $page
      perPage: $perPage
      sortType: STANDARD
    ){
      pageInfo {
        total
      }
      nodes {  
        id
        fullRoundText
        identifier
        round
        winnerId
        slots {
          id
          slotIndex
          entrant {
            id
            name
          }
          standing{
              id
              placement
              stats {
                score {
                  label
                  value
                }
              }
          }
        }
      }
    }
  }
},
`;
const getSetsFromPhaseVars =  
{
"phaseId":1821663,
"page": 1,
"perPage": 12
};


const getSetEntrantsQuery = `query SetEntrants($setId: ID!) {
  set(id: $setId) {
    id
    stream{
      id
      streamName
    }
    slots {
      id
      entrant {
        id
        name
        participants {
          id
          gamerTag
          connectedAccounts
        
        }
      }
    }
  }
},`;

 // -----------------------------------------------------------------------------------------------------------------------------------   

  // ---- Get Event ID ---- //
function pollTop8Data(authToken, slug, callback = null){
    console.log("pollTop8Data start");
  if (slug == null){
    console.error("Error: no slug provided.");
      if ( typeof callback === 'function'){
          callback(false);
      }
    return false;
  }

  variables.slug = slug;
  fetch('https://api.start.gg/gql/alpha', {
    method: 'POST',
    headers: 
    { 
         "Authorization": "Bearer " + authToken
    }
    ,
    body:JSON.stringify({ query, variables}),
  })
    .then((r) => r.json())
    .then((rsp) => {
        console.log(rsp);

        
        console.log('getting data from event :', rsp.data?.event?.name);
        if (!rsp.data?.event?.name) {
            console.log("Invalid");
            if ( typeof callback === 'function'){
                callback(false);
            }
            return false;
        }
        let date = Date(rsp.data.event.startAt);
        console.log(date.toString());
        console.log("---------------------------------------------------------------------");
        getPhasesinEventVars.eventId =rsp.data.event.id;

        lastEventID = rsp.data.event.id;

          // ---- Get All Phases ---- //
        fetch('https://api.start.gg/gql/alpha', {
            method: 'POST',
            headers: 
            { 
                 "Authorization": "Bearer " + authToken
            }
            ,
            body: JSON.stringify({ query: getPhasesInEvent, variables: getPhasesinEventVars}) ,
          })
            .then((r) => r.json())
            .then((rsp) => {
                if(rsp.data?.event?.phases?.length > 0){
                   let eventPhases = rsp.data.event.phases;
                   let currentPhase = {
                    id: -1,
                    phaseOrder: -1
                   };
                    for (const phase of rsp.data.event.phases){
                        if (phase.phaseOrder > currentPhase.phaseOrder){
                            currentPhase = phase;
                        }
                    }
                    console.log("Using phase: " + currentPhase.name);
                  getSetsFromPhaseVars.phaseId = currentPhase.id;
                  Top8PhaseID = currentPhase.id;
///-----------------------------------------------------------------------------------------------------------///  


        fetch('https://api.start.gg/gql/alpha', {
          method: 'POST',
          headers: 
          { 
              "Authorization": "Bearer " + authToken
          }
          ,
          body: JSON.stringify({ query: getSetsFromPhase, variables: getSetsFromPhaseVars}) ,
          })
          .then((r) => r.json())
              .then((rsp) => {

                const sets = rsp.data.phase.sets.nodes;

                for (let set of sets){
                      console.log("  ");
                      console.log("------------------");
                      console.log(set.fullRoundText);
                      console.log("------------------");
                      let outstring = "";
                  
                  for (let slot of set.slots){
                    if(slot.entrant) outstring +=  slot.entrant.name + " - " + slot.standing.stats.score.value + "       ";
                  }

                  console.log(outstring);
                  console.log("------------------");
                }

              if ( typeof callback === 'function'){
                  callback(true);
              }
          }



          );

////--------------------------------------------------------------------------------------------------------/////
                  }
            });
        
    });
    return true;
}


function updateTop8(authToken){
  getSetsFromPhaseVars.phaseId = Top8PhaseID;
  fetch('https://api.start.gg/gql/alpha', {
    method: 'POST',
    headers: 
    { 
        "Authorization": "Bearer " + authToken
    }
    ,
    body: JSON.stringify({ query: getSetsFromPhase, variables: getSetsFromPhaseVars}) ,
    })
    .then((r) => r.json())
    .then((rsp) => {
      console.log("");
      console.log('////////////////////////////////UPDATED NEW SET///////////////////////////////////////');
      let date = Date.now();
      console.log(date.toString());
      const sets = rsp.data.phase.sets.nodes;


      for (let set of sets){
        console.log("------------------");
        console.log(set.fullRoundText + " - " + set.identifier);
        console.log("------------------");
        let outstring = "";

       const setSummary = {
          set_id: set.identifier,
          player1_name: "",
          player1_score:null,
          player2_name: "",
          player2_score:null
      };
        for (let slot of set.slots){
          if(slot.entrant){    
            outstring += "(" + slot.slotIndex +") " + slot.entrant.name + " - " + slot.standing.stats.score.value + "  |   " ;
            if (slot.slotIndex == 0){ // hopefully this doesnt go rogue from falsey values
              setSummary.player1_name = slot.entrant.name;
              setSummary.player1_score = slot.standing.stats.score.value;
            }
            if(slot.slotIndex == 1){
              setSummary.player2_name = slot.entrant.name;
              setSummary.player2_score = slot.standing.stats.score.value;
            }
          }        
        }
        
        switch (set.identifier){
          case "A":
            data_top8Data.winner_sf_1 = setSummary;
            break;
          case "B":
            data_top8Data.winner_sf_2 = setSummary;
            break;
          case "C":
            data_top8Data.winner_final = setSummary;
            break;
          case "D":
            data_top8Data.grand_final = setSummary;
            break;
          case "E":
            data_top8Data.grand_final_reset = setSummary;
            break;
          case "F":
            data_top8Data.loser_rd_1_1  = setSummary;
            break;
          case "G":
            data_top8Data.loser_rd_1_2  = setSummary;
            break;
          case "H":
            data_top8Data.loser_qf_1  = setSummary;
            break;
          case "I":
            data_top8Data.loser_qf_2  = setSummary;
            break;
          case "J":
            data_top8Data.loser_sf  = setSummary;
            break;
          case "K":
            data_top8Data.loser_final  = setSummary;
            break;
        }   


     
        console.log(outstring);
        console.log("-------------------");
      }         

      console.log('//////////////////////////////////////////////////////////////////////////////////////');
    } );
}




function GetAllSets(token, setId){
  
}


  // ---------------------------------Original Query to get top 8 placements -------------------------
  // fetch('https://api.start.gg/gql/alpha', {
  //   method: 'POST',
  //   headers: 
  //   { 
  //        "Authorization": "Bearer " + authToken
  //   }
  //   ,
  //   body:JSON.stringify({ query, variables}),
  // })
  //   .then((r) => r.json())
  //   .then((rsp) => {
  //       console.log(rsp);

        
  //       console.log('getting data from event :', rsp.data?.event?.name);
  //       let date = Date(rsp.data.event.startAt);
  //       console.log(date.toString());
  //       console.log("---------------------------------------------------------------------");
  //       placementVars.eventId =rsp.data.event.id;

  //         // ---- Get All Phases ---- //
  //       fetch('https://api.start.gg/gql/alpha', {
  //           method: 'POST',
  //           headers: 
  //           { 
  //                "Authorization": "Bearer " + authToken
  //           }
  //           ,
  //           body: JSON.stringify({ query: placementQuery, variables: placementVars}) ,
  //         })
  //           .then((r) => r.json())
  //           .then((rsp) => {
  //               if(rsp.data?.event?.standings?.nodes?.length > 0)
  //                   for (const entry of rsp.data.event.standings.nodes){
  //                       console.log(entry.entrant.name + ' placed '+ entry.placement + '!');
  //                   }
  //           });
        
  //   });


 
  module.exports = {
    pollTop8Data: pollTop8Data,
    updateTop8: updateTop8
  };
