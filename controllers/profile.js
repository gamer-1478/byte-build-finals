const User = require('../schemas/userSchema')

const profile_get = async (req, res) => {
    const user = await User.findOne({userId: req.user.userId})
    res.render('profile/profile', {user})
}

const profile_update = async (req, res) => {
    const {name, email} = req.body
    await User.findOneAndUpdate({userId: req.user.userId},{
        name,
        email
    }).then((user) => {
        res.send({success: true, msg: "Profile updated"})
    })

}

module.exports = {profile_get, profile_update}