var Connect = require('connect');

module.exports = Connect.createServer([
    {module: require('chatd')},
    {module: require('')}
]);