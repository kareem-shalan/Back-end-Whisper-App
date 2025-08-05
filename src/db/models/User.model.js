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
    confirmEmail: Date,
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
        required: function(){
            return this.provider === provider.system ? true : false
        },
        unique: true,
        minlength: [11, "Phone must be at least 11 characters"],

    },
    provider: {
        type: String, 
        enum: {
            values: Object.values(provider),
            message: "{VALUE} is not a valid provider ",
            default: provider.system
        }
    },
    picture: String,
    confirmPhone: Date,
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

const UserModel = mongoose.models.User || mongoose.model('User', userSchema)

export default UserModel

UserModel.syncIndexes()