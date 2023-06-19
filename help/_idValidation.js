const ObjectId = require("mongojs").ObjectId;

const _idValidation = (_id)=>{
    return ObjectId.isValid(_id);
}


module.exports = _idValidation;