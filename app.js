const http = require("http");
const {duration} = require("./config");
const {interval} = require("./config");
const {port} = require("./config");

const server = http.createServer((req, res) => {
    console.log(`Метод: ${req.method}`);
    console.log(`URL: ${req.url}`);
    if (req.url === '/') {
        displayMessages().then((response) => res.end(response));
    }
});

server.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});

const displayMessages = () => {
    return new Promise((resolve) => {
        let timerId = setInterval(() => {
            console.log(new Date().toISOString())
        }, interval);

        setTimeout(() => {
            clearInterval(timerId);
            resolve(new Date().toISOString())
        }, duration);
    });
};
