const express = require("express");
const router = express.Router();
const User = require("../models/user");
const auth = require("../middleware/auth");
const isTutor = require("../middleware/isTutor");

//@route   POST /user
//@desc    Create a user
//@access  Public
//@tested  false
router.post("/user", async (req, res) => {
    const user = new User(req.body);

    try {
        await user.save();
        res.status(201).send({
            user
        });
    } catch (e) {
        res.status(400).send(e);
    }
});

//@route   GET /user/me
//@desc    Read self
//@access  Private
//@tested  false
router.get("/user/me", auth, async (req, res) => {
    try {
        await req.user.populate("profile").execPopulate();
        res.send([req.user, req.user.profile]);
    } catch (e) {
        res.status(500).send();
    }
});

//@route   PATCH /user/me
//@desc    Update self
//@access  Private
//@tested  false
router.patch("/user/me", auth, async (req, res) => {
    const allowedUpdates = ["first_name", "last_name", "email", "password"];
    const updates = Object.keys(req.body);
    const isAllowed = updates.every(update => {
        return allowedUpdates.includes(update);
    });

    if (!isAllowed) {
        return res.status(400).send({ error: "Invalid updates" });
    }

    try {
        const me = await User.findById(req.user.id);
        updates.forEach(update => {
            me[update] = req.body[update];
        });

        await me.save();
        res.send(me);
    } catch (e) {
        res.status(500).send(e);
    }
});

//@route   DEL /user/me
//@desc    Delete self
//@access  Private
//@tested  false
router.delete("/user/me", auth, async (req, res) => {
    try {
        const me = await User.findByIdAndDelete(req.user.id);
        res.send(me);
    } catch (e) {
        res.status(500).send(e);
    }
});

//@route   POST /user/login
//@desc    Login
//@access  Public
//@tested  false
router.post("/user/login", async (req, res) => {
    try {
        const user = await User.findByCredentials(
            req.body.email,
            req.body.password
        );
        const token = await user.generateAuthToken();

        res.send({ user, token });
    } catch (e) {
        res.status(400).send(e);
    }
});

//@route   POST /user/logout
//@desc    Logout
//@access  Private
//@tested  false
router.post("/user/logout", auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(token => {
            return token.token !== req.token;
        });

        await req.user.save();

        res.send();
    } catch (e) {
        res.status(500).send(e);
    }
});

//@route   POST /user/logoutAll
//@desc    Logout all sessions
//@access  Private
//@tested  false
router.post("/user/logoutAll", auth, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        res.send();
    } catch (e) {
        res.status(500).send();
    }
});

//@route   GET /user/tutors
//@desc    Read list of tutors
//@access  Public
//@tested  false
router.get("/user/tutors", async (req, res) => {
    try {
        const tutors = await User.find({
            position: "tutor"
        });

        if (!tutors) {
            return res.status(404).send();
        }

        res.send(tutors);
    } catch (e) {
        res.status(500).send();
    }
});

//@route   GET /user/students
//@desc    Read list of students
//@access  Private
//@tested  false
router.get("/user/students", auth, isTutor, async (req, res) => {
    try {
        const students = await User.find({
            position: "student"
        });

        if (!students) {
            return res.status(404).send();
        }

        res.send(students);
    } catch (e) {
        res.status(500).send();
    }
});
module.exports = router;
