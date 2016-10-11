module.exports = {};
var natural = require('natural'),
    TfIdf = natural.TfIdf;

    function searchPage() {
        tfidf = new TfIdf();

        // tfidf.addDocument('this document is about ruby.');
        // tfidf.addDocument('this document is about node.');
        // tfidf.addDocument('this document is about ruby and node.');
        tfidf.addDocument('this document is about node. it has node examples');

        console.log('node --------------------------------');
        tfidf.tfidfs('node', function(i, measure) {
            console.log('document #' + i + ' is ' + measure);
        });

        console.log('ruby --------------------------------');
        tfidf.tfidfs('ruby', function(i, measure) {
            console.log('document #' + i + ' is ' + measure);
        });

        //it's possible to retrieve a list of all terms in a document, sorted by their importance.

        tfidf.listTerms(3 /*document index*/ ).forEach(function(item) {
            console.log(item.term + ': ' + item.tfidf);
        });
    }

module.exports.searchPage = searchPage;
