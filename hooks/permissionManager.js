const hasPermission = (granted = []) => {
  return (req, res, next) => {
    if(granted.includes(req.decode.role)){
        next();
    } else {
         res
           .status(401)
           .json({ success: false, message: "You have no permissions" });
    }
  };
};

module.exports = hasPermission