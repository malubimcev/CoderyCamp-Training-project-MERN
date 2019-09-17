const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;

let shopDatabase;
let productCollection;

module.exports = {
    init() {
        MongoClient.connect('mongodb://localhost:27017')
            .then(function (clientInstance) {
                shopDatabase = clientInstance.db("shop");
                productCollection = shopDatabase.collection("product");
            });
    },

    getProducts(where) {
        if (where && where.key) {
            where.key = Number(where.key);
            return productCollection.findOne({"key": where.key});
        } else if (where && where.slug) {
            return productCollection.findOne({"slug": where.slug});
        } else {
            const cursor = productCollection.find();
            const promise = cursor.toArray();
            return promise;
        }
    },

    getProductByID(id) {
        if (ObjectID.isValid(id)) {
            return productCollection.findOne({_id: ObjectID(id)});
        }
        return Promise.reject();
    },

    updateProduct(id, patch) {
        delete patch._id;
        productCollection.update(
            { _id: ObjectID(id) },
            {
                $set: patch
            }
        )
        .then(result => {
            return productCollection.findOne({_id: ObjectID(id)});
        })
        .catch(err => {
            console.log(`Error=${err}`);
            return null;
        });
    }

    // insertProduct(patch) {
        
    // }
};