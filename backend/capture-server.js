const express = require('express');
const path = require('path');
const app = express();
const port = 2369;

function initCaptureServers(){
    console.log("initializing servers ");
    // Serve static files from the 'public' directory
    //app.use(express.static(path.join(__dirname, '/ObsCaptureViews/Top8/')));

//Handle requests to the root URL
    app.get('/' , (req, res) => {
        res.sendFile(path.join(__dirname, '/ObsCaptureViews/', '404.html'));
    });
    app.get('/top8', (req, res) => {
        res.sendFile(path.join(__dirname, '/ObsCaptureViews/Top8/', 'index.html'));
    });

// Start the server
    app.listen(port, () => {
        console.log(`Server listening on port ${port}`);
    });

}

module.exports = {
    initCaptureServers : initCaptureServers
}