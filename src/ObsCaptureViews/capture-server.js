const express = require('express');
const path = require('path');
const app = express();
const port = 2369;

function initOutputViewServer(){
    console.log("initializing webcapture servers...");
    // Serve static files from the 'public' directory
    //app.use(express.static(path.join(__dirname, '/ObsCaptureViews/Top8/')));

//Handle requests to the root URL

    app.get('/' , (req, res) => {
        res.sendFile(path.join(__dirname, '/', '404.html'));
    });
    app.use('/top8', express.static(path.join(__dirname, '/Top8/')));
    app.get('/top8', (req, res) => {
        res.sendFile(path.join(__dirname, '/Top8/', 'index.html'));
    });

// Start the server
    app.listen(port, () => {
        console.log(`Server listening on port ${port}`);
    });

}

module.exports = {
    initOutputViewServer : initOutputViewServer
}