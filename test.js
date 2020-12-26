const request = require('request');

async function getHtml() {
    return await request('https://google.com/');
}

let res = getHtml().then((res) => {
    //console.log(res.uri);
    console.log('THEN > 2');
    res.locals = { ...res.locals, uri: 'ciao', }
    test2();

});

function test2() {
    console.log(res.locals);
    console.log('THEN > 3');
}