/*!
 * Ext JS Connect
 * Copyright(c) 2010 Ext JS, Inc.
 * MIT Licensed
 */

/**
 * Module dependencies.
 */

var queryString = require('querystring');

/**
 * Extract the mime type from the given request's 
 * Content-Type header.
 *
 * @param  {Request} req
 * @return {String}
 * @api private
 */

function mime(req) {
    var str = req.headers['content-type'] || '';
    return str.split(';')[0];
}

/**
 * Supported decoders.
 */

exports.decode = {
    'application/x-www-form-urlencoded': queryString.parseQuery,
    'application/json': JSON.parse
};

/**
 * Decode the following request bodies:
 *   - application/json
 *   - application/x-www-form-urlencoded
 */

exports.handle = function(err, req, res, next){
    var decoder = exports.decode[mime(req)];
    if (decoder) {
        var data = '';
        req.setEncoding('utf8');
        req.addListener('data', function(chunk) { data += chunk; });
        req.addListener('end', function() {
            req.rawBody = data;
            try {
                req.body = decoder(data);
            } catch (err) {
                next(err);
            }
            next();
        });
    } else {
        next();
    }
};