"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const xml2js = require('xml2js');
const parser = new xml2js.Parser({ explicitArray: false });
// Parsing xml to js, used to handle drone data
function xmlToJs(data) {
    let ans;
    parser.parseString(data, function (err, result) {
        ans = result;
    });
    return ans;
}
exports.default = xmlToJs;
