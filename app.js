const readline = require('readline');
const CHAT_SERVER_URL = `https://3000-spdit-chatserver-3jncsje983x.ws-us98.gitpod.io`;

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

const data = {
    sender: '',
    lastId: 0,
};

function showMenu() {
    console.log(`What do you want to do today?`);
    console.log(menu.map(([message], index) => `\t${index + 1}: ${message}`).join('\n'));
    rl.question(`Enter your option (1 - ${menu.length}): `, function (answer) {
        menu[+answer - 1][1]();
    });
}

function sendMessage() {
    rl.question('What message do you want to send?: ', function (message) {
        console.log('Sending...');
        fetch(CHAT_SERVER_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sender: data.sender, message }),
        })
            .then(function () {
                console.log('Sent!');
            })
            .catch(function (err) {
                console.log('Failed to send!');
                console.log(err.message);
            })
            .finally(function () {
                setTimeout(showMenu, 1000);
            });
    });
}
function seeNewMessages() {
    console.log(`Getting messages since message id=${data.lastId}...`);
    fetch(`${CHAT_SERVER_URL}?last=${data.lastId}`)
        .then(function (response) {
            return response.json();
        })
        .then(function (body) {
            console.log(`\t\t========= START OF MESSAGES =========`);
            console.log(body.rows.map(({ id, sender, message }) => `\t\t[${id}] ${sender}: ${message}`).join('\n'));
            console.log(`\t\t========= END OF MESSAGES =========`);

            data.lastId = body.rows[body.rows.length - 1].id;
        })
        .catch(function (err) {
            console.log('Failed to get!');
            console.log(err.message);
        })
        .finally(function () {
            setTimeout(showMenu, 1000);
        });
}
function exit() {
    rl.close();
}

const menu = [
    ['Send a message', sendMessage],
    ['See new messages', seeNewMessages],
    ['Exit', exit],
];

rl.question('What is your name?: ', function (name) {
    data.sender = name;
    console.log(`Hi ${name}, welcome to chat app`);
    showMenu();
});
