userSchema.methods.generateAuthToken = async function(){
    const user = this
    const token = jwt.sign({ _id : user._id.toString()},"thisismywebtoken")
    user.tokens.push(token)

    
    await user.save()
    return token
}

userSchema.statics.findByCredentials = async (email, password) =>{
    const user = await User.findOne({email})
    if(!user){
        throw new Error("Unable to login");
    }
    const isMatch = await bcrypt.compare(password, user.password)
    if(!isMatch){
        throw new Error("Unable to login") //providing single type of error message, thus not providing too much info related to creds.
    }
    return user
}

userSchema.pre('save', async function(next){
    const user = this
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password, 8)
    }
    next()
})

