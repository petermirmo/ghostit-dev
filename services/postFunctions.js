var request = require("request");
var cheerio = require("cheerio");

module.exports = {
    getImagesFromUrl: function(req, res) {
        var url = req.body.link;
        request(url, function(err, result, body) {
            if (err) throw err;
            var imgSrc = [];
            var $ = cheerio.load(body);
            $("img").each(function(index, img) {
                imgSrc.push(img.attribs.src);
            });
            res.send(imgSrc);
        });
    }
};
