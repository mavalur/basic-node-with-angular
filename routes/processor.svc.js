/**
 * Created by Mavalur on 2/26/17.
 */
var lodash = require('lodash');
var fs = require('fs');


var indexMap = {};
var productListingCollection = [];


var processor = {
    optimizeName: function (name) {
        if (!name && name == null) {
            return;
        }
        name = name.replace(/\s+/g, '_').toUpperCase();
        return name;
    },
    indexListing: function () {
        fs.readFile('../data/listings.txt', function (err, data) {
            if (err) throw err;
            var array = data.toString().split("\n");
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
           // console.log(indexMap);
            processor.digestProducts();
        });

    },
    digestProducts: function () {
        fs.readFile('../data/products.txt', function (err, data) {
            if (err) throw err;
            var array = data.toString().split("\n");
            var otherCollectionListing = indexMap["OTHERS"] || [];
            for (i in array) {
                if (array[i] && array[i] != null) {
                    var product = JSON.parse(array[i]);
                    var listingByManufacturer = indexMap[processor.optimizeName(product.manufacturer)] || [];
                    var listingsForMatching = listingByManufacturer.concat(otherCollectionListing);
                    var productKeyWords = [processor.optimizeName(product.model)];
                    var name = processor.optimizeName(product.product_name);
                    var regex = new RegExp('/'+product.product_name+'|'+product.model+'/ig');

                    name = name.replace(regex,'');
                    console.log(product.product_name+" => "+ name) ;

                    var matches = listingsForMatching.filter(function(listing, index) {
                        return listing && listing.title && product.model && listing.title.indexOf(product.model)!=-1;

                    }, product);

                    productListingCollection.push({
                        name: product.product_name,
                        listings: matches
                    });
                }
            }
            fs.writeFile("../data/results.json",JSON.stringify(productListingCollection),function(err,res){
                console.log(err);
            });
        });
    }
}

processor.indexListing();
//module.exports(processor);