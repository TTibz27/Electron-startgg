const MessageType = Object.freeze({
    FRONTEND_CONNECT_CONFIRMATION: 0,
    API_CONNECT_REQUEST: 1,
    API_CONNECT_REPLY: 2,
    GAMEFEED_CONNECT_REQUEST: 3,
    GAMEFEED_CONNECT_REPLY: 4,
    GET_TOP_8_REQUEST: 5,
    GET_TOP_8_REPLY: 6,
    GET_TOP_8_UPDATE: 7
});

const MESSAGE_TEMPLATE= {
    type: "type from enum",
    success: "was action successful",
    request: "content of a request",
    reply: "content of a reply",
    top8: "Top 8 data"
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