import mongoose from 'mongoose'

const userDetailsSchema = new mongoose.Schema(
    {
    name:{ type:String, required:true},
    email:{ type:String, unique:true, required:true },
    password :{ type:String, required:true},

    phoneNumber :{ type:String},
    driverLicenseNumber: { type:String},
    isRenter: {type:Boolean, default:false},

    refreshTokens: [{
            token: { type: String, required: true }, 
            expiresAt: { type: Date, required: true },
            createdAt: { type: Date, default: Date.now },
    }],

    createdAt: { type: Date, default: Date.now },
    lastLogin: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now},
    profilePicture:{type:String, default:'https://cdn.pixabay.com/photo/2018/11/13/21/43/avatar-3814049_1280.png'},
    carOwned: [{type:String}],
    location:{
        district:{type:String},
        state:{type:String},
        country:{type:String},
        longitude:{type:String},
        latitude:{type:String}
    },
    totalSpent:{type:Number,default:0},
    
    }
)

const User = mongoose.model("User",userDetailsSchema)
export default User