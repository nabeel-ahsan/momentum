import mongoose from "mongoose";
import bcrypt from "bcrypt"

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"]
    },
    email: {
        type: String,
        unique: true,
        required: [true, "Email is required"],
        lowercase: true,
        trim: true,
        maxlength: [100, 'Email cannot exceed 100 characters'],
        minlength: [5, 'Email must be at least 5 characters']
    },
    password:{
        type: String,
        required: [true, "Password is required field"],
        select: false
    }
},
{
    timestamps: true
})

userSchema.pre('save', async function (next) {
    const hashedPassword = await bcrypt.hash(this.password, 10)
    this.password = hashedPassword
    next()
})

const User = mongoose.model('User', userSchema)

export default User