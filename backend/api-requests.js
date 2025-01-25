const { closeSync } = require("original-fs");

var msg = 'Hello World';
console.log(msg);


let lastEventID = null;
let lastPhaseID = null;


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
        round
        winnerId
        slots {
          id
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
const getSetsFromPhaseVars=  
{
"phaseId":1821663,
"page": 1,
"perPage": 10
};

 // -----------------------------------------------------------------------------------------------------------------------------------   

  // ---- Get Event ID ---- //
function pollTop8Data(authToken, slug){
  if (slug == null){
    console.error("Error: no slug provided.")
    return;
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
                  lastPhaseID = currentPhase.id;
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
              console.log("------------------")
            }         
          } );

////--------------------------------------------------------------------------------------------------------/////
                  }
            });
        
    });
}


function updateTop8(authToken){
  getSetsFromPhaseVars.phaseId = lastPhaseID;
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
        console.log(set.fullRoundText);
        console.log("------------------");
        let outstring = "";
        for (let slot of set.slots){
          if(slot.entrant) outstring +=  slot.entrant.name + " - " + slot.standing.stats.score.value + "       ";
        }
        
        console.log(outstring);
        console.log("-------------------");
      }         

      console.log('//////////////////////////////////////////////////////////////////////////////////////');
    } );
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
