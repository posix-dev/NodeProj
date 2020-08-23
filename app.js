const http = require("http");

const DURATION = 5000;
const INTERVAL = 1000;
const PORT = 3004;

const server = http.createServer((req, res) => {
    console.log(`Метод: ${req.method}`);
    console.log(`URL: ${req.url}`);
    if (req.url === '/') {
        displayMessages().then((response) => res.end(response));
    }
});

server.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
});

const displayMessages = () => {
    return new Promise((resolve) => {
        let timerId = setInterval(() => {
            console.log(new Date().toISOString())
        }, INTERVAL);

        setTimeout(() => {
            clearInterval(timerId);
            resolve(new Date().toISOString())
        }, DURATION);
    });
};
