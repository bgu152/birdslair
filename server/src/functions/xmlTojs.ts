
const xml2js = require('xml2js');

const parser = new xml2js.Parser({explicitArray : false});

// Parsing xml to js, used to handle drone data
export default function xmlToJs(data:string) {
    let ans:any;
    parser.parseString(data, function (err:any, result:any) {
        ans = result;
    });
    return ans;
}