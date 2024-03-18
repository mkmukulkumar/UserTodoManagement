const mongoose=require('mongoose')
const userSchema = require('../model/models');
async function getUser(req, res, next) {
    const User = mongoose.model('User', userSchema);
    let user;
    try {
      user = await User.findById(req.params.id);
      if (user == null) {
        return res.status(404).json({ message: 'User not found' });
      }
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
    res.user = user;
    next();
}
module.exports=getUser;