const isTutor = (req, res, next) => {
    if (req.user.position !== "tutor") {
        return res.status(403).send({ error: "Access Denied" });
    }
    next();
};

module.exports = isTutor;
