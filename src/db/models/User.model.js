import mongoose from 'mongoose'

export let gender = { male: "male", female: "female" }
export let role = { admin: "admin", user: "user" }
export let provider = { google: "google", system: "system" }
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minlength: [3, "Name must be at least {VALUE} characters"],
        maxlength: [15, "Name must be less than {VALUE} characters"]
    },
    lastName: {
        type: String,
        required: true,
        minlength: [3, "Name must be at least {VALUE} characters"],
        maxlength: [15, "Name must be less than {VALUE} characters"]
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (v) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
            },
            message: "Invalid email address"
        }
    },
    confirmEmail: {
        type: Date,
        default: null
    },
    password: {
        type: String,
        required: function(){
            return this.provider === provider.system ? true : false 
        },
        minlength: [8, "Password must be at least 8 characters"],
        maxlength: [100, "Password must be less than {VALUE} characters"]
    },
    gender: {
        type: String,
        enum: {
            values: Object.values(gender),
            message: "{VALUE} is not a valid gender ",
            default: gender.male
        },
    },
    phone: {
        type: String,
        required: true,
    },
    provider: {
        type: String, 
        enum: {
            values: Object.values(provider),
            message: "{VALUE} is not a valid provider ",
            default: provider.system
        }
    },
    confirmEmailOtp: String,
    picture: {public_id:String, secure_url:String},
    confirmPhone: Date,
    confirmForgotPasswordOtp: String,
    oldPasswords: [String],
    changeCredintialsTime : Date,
    coverImages: {public_id:String, secure_url:String},
    devices: [{
        deviceId: String,
        deviceName: String,
        deviceType: String,
        deviceOs: String,
        deviceVersion: String,
    }],
    otpUserCount: {
        type: Number,
        default: 0
    },
    role: {
        type: String,
        enum: {
            values: Object.values(role),
            message: "{VALUE} is not a valid role ",
            default: role.user
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    isFreeze: {
        type: Boolean,
        default: false
    },
    deletedAt: {
        type: Date,
        default: null
    },
    deletedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    restoreAt: {
        type: Date,
        default: null
    },
    restoreBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',    
        default: null
    }
}, {
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
})

userSchema.virtual('fullName').set(function (value) {
    const [firstName, lastName] = value?.split(' ') || []
    this.set(firstName, lastName)
}).get(function () {
    return `${this.firstName} ${this.lastName}`
})


userSchema.virtual('messages', {
    ref: 'Message',
    localField: '_id',
    foreignField: 'receiver'
})
userSchema.index({firstName: 1 , lastName: 1} , {name: "fullName_index" , unique: true})        

const UserModel = mongoose.models.User || mongoose.model('User', userSchema)

export default UserModel

UserModel.syncIndexes()