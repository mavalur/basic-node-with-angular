/**
 * Created by Mavalur on 2/26/17.
 */
var lodash = require('lodash');
var fs = require('fs');

//placeholder for indexed data
var indexMap = null;
//placeholder for results
var productListingCollection = [];
// file details
var file = {
    products: "../data/products.txt",
    listings: "../data/listings.txt",
    results: "../data/results.txt"
};

var search = {
    /*
     Searches all products and its listings
     */
    searchByProduct: function () {
        fs.readFile(file.products, function (err, data) {
            if (err) throw err;
            var array = data.toString().split("\n");
            var otherCollectionListing = indexMap["OTHERS"] || [];
            for (i in array) {
                if (array[i] && array[i] != null) {
                    var product = JSON.parse(array[i]);
                    var listingByManufacturer = indexMap[processor.optimizeName(product.manufacturer)] || [];
                    var listingsForMatching = listingByManufacturer.concat(otherCollectionListing);

                    productListingCollection.push({
                        name: product.product_name,
                        listings: search.searchByTerm(search.sanitize(product), listingsForMatching)
                    });
                }
            }
            if (fs.existsSync(file.results)) {
                fs.unlinkSync(file.results);
            }
            ;
            productListingCollection.forEach(function (eachProduct, idx) {
                fs.appendFile(file.results, JSON.stringify(eachProduct).concat("\n"));
            });
            /*fs.writeFile("../data/results.txt", JSON.stringify(productListingCollection).replace("},","\n"), function (err, res) {
             console.log(err);
             });*/
        });
    },
    /*
     searches a given product name (or) a term
     */
    searchByTerm: function (searchTerm, arrayForListings) {
        if (!arrayForListings && !searchTerm) {
            console.log("inputs not appropriate ...", searchTerm, arrayForListings);
            return [];
        }
        var searchTerms = searchTerm.split(' ');
        var r = '^';
        searchTerms.forEach(function (term, idx) {
            r = r + "(?=.*" + term + ")";
        });
        r = r + ".*$";
        //console.log(searchTerm + " => " + r);
        var regEx = new RegExp(r, 'im');
        var matches = arrayForListings.filter(function (listing, index) {
            /*//  console.log(search.sanitize(listing.title));
             var listResult = regEx.test(search.sanitize(listing.title));
             if(!listResult){
             console.log(listing.title+" = >"+regEx);
             }
             return listResult;*/
            return listing && listing.title && regEx.test(search.sanitize(listing.title));
        });
        return matches;
    },
    /*
     function to streamline the product and listing for better search.
     replaces multiple spaces, underscore and hyphens to single space and returns. can accept a product object (or) a string
     */
    sanitize: function (product) {
        var term = '';
        if (typeof product === "object") {
            term = product.product_name;
        } else {
            term = product
        }
        return term.replace(/[\s+_-]/ig, ' ');
    }
};

/*
 exported function to be visible in the parent module.
 */
var processor = {
    /*
     function to streamline the indexing part to store listings per manufacturer.
     Given a manufacture name, replaces multiple spaces with underscores and converts to uppercase. (Useful to search in the map and follow standard convention)
     */
    optimizeName: function (name) {
        if (!name && name == null) {
            return '';
        }
        name = name.replace(/\s+/g, '_').toUpperCase();
        return name;
    },
    /*
        Only service contract to be accessed by the UI. If no search term is given, produces the results for all products from @ref(file.products.txt)
     */
    search: function (optionalSearchTerm) {
        if (indexMap == null) {
            fs.readFile(file.listings, function (err, data) {
                if (err) throw err;
                var array = data.toString().split("\n");
                indexMap = {};
                for (i in array) {
                    if (array[i] && array[i] != null)
                        var listing = JSON.parse(array[i]);
                    var manufacturerNm = processor.optimizeName(listing.manufacturer);
                    manufacturerNm = (manufacturerNm == null || manufacturerNm.trim() == "") ? "OTHERS" : manufacturerNm;
                    if (!indexMap[manufacturerNm]) {
                        indexMap[manufacturerNm] = [];
                    }
                    indexMap[manufacturerNm].push(listing);
                }
                if (optionalSearchTerm && optionalSearchTerm != null) {
                    search.searchByTerm(optionalSearchTerm, array);
                } else {
                    search.searchByProduct();
                }
            });
        } else {
            if (optionalSearchTerm && optionalSearchTerm != null) {
                search.searchByTerm(optionalSearchTerm, array);
            } else {
                search.searchByProduct();
            }
        }
    }

}

processor.search();
//module.exports(processor);