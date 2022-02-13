const requireAuthentication = (req, res, next) => {
    if (!req.user) {
        return res.status(403).json({message: "Not Authenticated"})
    } 

    return next();
}

module.exports = requireAuthentication