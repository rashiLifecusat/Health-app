const mongoose = require("mongoose")

const favSchema= new mongoose.Schema({
    favouriteId:{type:mongoose.Types.ObjectId,refer:"users"},
    userId:{type:mongoose.Types.ObjectId,refer:"users"}
})

const FavModel = mongoose.model("favourites",favSchema)
module.exports= FavModel