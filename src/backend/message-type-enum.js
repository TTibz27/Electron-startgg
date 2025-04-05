const MessageType = Object.freeze({
    FRONTEND_CONNECT_REQUEST: 0,
    FRONTEND_CONNECT_CONFIRM: 1,
    API_CONNECT_REQUEST: 2,
    API_CONNECT_REPLY: 3,
    GAMEFEED_CONNECT_REQUEST: 4,
    GAMEFEED_CONNECT_REPLY: 5,
    TOP_8_SET_PREFS:6,
    TOP_8_GET_PREFS:7,
    GET_TOP_8_REQUEST: 8,
    GET_TOP_8_REPLY: 9,
    GET_TOP_8_UPDATE: 10,


});

const MESSAGE_TEMPLATE= {
    type: "type from enum",
    success: "was action successful",
    request: "content of a request", //API_request_or_reply | string
    reply: "content of a reply", //API_request_or_reply | string
    top8: "Top 8 data"
}

// valid request / reply values
const API_request_or_reply = {
    api_service_name: "ALL or GOOGLE or STRIVE", // for API CONNECT REQUEST/REPLYS.
                                                   // ALL can request everything at connection,Frontend sends ALL, Backend sends back individual per service.
    slug: "string of slug for startgg"
}


const environmentVars = {
    env: "dev or mod or admin",
    build: "build date string MM-DD-YYYY"
}


const top8 = {
    loser_rd_1_1: {
        player1_name: "Name",
        player1_score:0,
        player2_name: "Name2",
        player2_score:3
    },
    loser_rd_1_2: {},
    loser_qf_1:{},
    loser_qf_2:{},
    winner_sf_1: {},
    winner_sf_2:{},
    loser_sf:{},
    loser_final:{},
    winner_final:{},
    grand_final:{}


}

module.exports = {
    MessageType:MessageType
}