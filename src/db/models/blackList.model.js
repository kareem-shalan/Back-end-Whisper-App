import mongoose from "mongoose"

const blackListSchema = new mongoose.Schema({
    jti: { type: String, required: true , unique: true},
    expireAt: { type: Date , required: true },      
    userId: {type: mongoose.Schema.Types.ObjectId , ref: "User" , required: true} 
}, { 
    timestamps: true,
    toObject: { virtuals: true }, 
    toJSON: { virtuals: true } 
})

const BlackListModel = mongoose.models.BlackList || mongoose.model('BlackList', blackListSchema)

export default BlackListModel