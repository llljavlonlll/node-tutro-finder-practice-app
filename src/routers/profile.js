const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const Profile = require("../models/profile");

//@route   POST /profile
//@desc    Create a profile
//@access  Private
//@tested  false
router.post("/profile", auth, async (req, res) => {
    const profile = new Profile({
        ...req.body,
        owner: req.user._id
    });

    try {
        await profile.save();
        res.status(201).send(profile);
    } catch (e) {
        res.status(400).send(e);
    }
});

//@route   GET /profile
//@desc    Read self profile
//@access  Private
//@tested  false
router.get("/profile", auth, async (req, res) => {
    try {
        const myProfile = await Profile.findOne({
            owner: req.user.id
        });

        if (!myProfile) {
            return res.status(404).send({ error: "Profile not found" });
        }
        await myProfile.populate("owner").execPopulate();
        res.send(myProfile);
    } catch (e) {
        res.status(500).send(e);
    }
});

//@route   PATCH /profile
//@desc    Update self profile
//@access  Private
//@tested  false
router.patch("/profile", auth, async (req, res) => {
    const updates = Object.keys(req.body);
    try {
        const myProfile = await Profile.findOne({
            owner: req.user.id
        });

        if (!myProfile) {
            return res.status(404).send({ error: "Profile not found" });
        }

        updates.forEach(update => {
            myProfile[update] = req.body[update];
        });

        await myProfile.save();
        res.send(myProfile);
    } catch (e) {
        res.status(500).send(e);
    }
});

//@route   DEL /profile
//@desc    Delete self profile
//@access  Private
//@tested  false
router.delete("/profile", auth, async (req, res) => {
    try {
        const myProfile = await Profile.findOneAndDelete({
            owner: req.user.id
        });
        res.send(myProfile);
    } catch (e) {
        res.status(500).send(e);
    }
});

//////////////////////////////////////////////////////////////////////////////////////////////
//                                    EDUCATION                                            //
/////////////////////////////////////////////////////////////////////////////////////////////

//@route   POST /profile/education
//@desc    Add education to self profile
//@access  Private
//@tested  false
router.post("/profile/education", auth, async (req, res) => {
    try {
        const myProfile = await Profile.findOne({
            owner: req.user.id
        });

        if (!myProfile) {
            return res.status(404).send({ error: "Profile not found" });
        }

        // Check if school already exists
        myProfile.education.forEach(school => {
            if (school.school === req.body.school) {
                throw new Error("Duplicate school");
            }
        });

        myProfile.education = myProfile.education.concat(req.body);
        await myProfile.save();
        res.send(myProfile);
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
});

//@route   GET /profile/education
//@desc    Read education of self profile
//@access  Private
//@tested  false
router.get("/profile/education", auth, async (req, res) => {
    try {
        const myProfile = await Profile.findOne({
            owner: req.user.id
        });

        if (!myProfile) {
            return res.status(404).send({ error: "Profile not found" });
        }

        res.send(myProfile.education);
    } catch (e) {
        res.status(500).send();
    }
});

//@route   PATCH /profile/education/:school
//@desc    Update education of self profile
//@access  Private
//@tested  false
router.patch("/profile/education/:school", auth, async (req, res) => {
    const updates = Object.keys(req.body);
    try {
        const myProfile = await Profile.findOne({
            owner: req.user.id
        });

        if (!myProfile) {
            return res.status(404).send({ error: "Profile not found" });
        }

        // Check if school already exists
        myProfile.education.forEach(school => {
            if (school.school === req.body.school) {
                throw new Error("Duplicate school");
            }
        });

        const education = myProfile.education;
        let schoolIndex;

        // Find the index position of school provided in query params
        // in the education array
        for (let i = 0; i < education.length; i++) {
            if (education[i].school === req.params.school) {
                schoolIndex = i;
            }
        }

        updates.forEach(update => {
            myProfile.education[schoolIndex][update] = req.body[update];
        });

        await myProfile.save();
        res.send(myProfile.education);
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
});

//@route   DEL /profile/education/:school
//@desc    Delete one education (school) of self profile
//@access  Private
//@tested  false
router.delete("/profile/education/:school", auth, async (req, res) => {
    try {
        const myProfile = await Profile.findOne({
            owner: req.user.id
        });

        if (!myProfile) {
            return res.status(404).send({ error: "Profile not found" });
        }

        const education = myProfile.education;
        let schoolIndex = -1;

        // Find the index position of school provided in query params
        // in the education array
        for (let i = 0; i < education.length; i++) {
            if (education[i].school === req.params.school) {
                schoolIndex = i;
            }
        }

        if (schoolIndex >= 0) {
            myProfile.education.splice(schoolIndex, 1);
        }
        await myProfile.save();
        res.send(myProfile.education);
    } catch (e) {
        res.status(500).send();
    }
});

//////////////////////////////////////////////////////////////////////////////////////////////
//                                    SUBJECT                                              //
/////////////////////////////////////////////////////////////////////////////////////////////

//@route   POST /profile/subjects
//@desc    Add subject to self profile
//@access  Private
//@tested  false
router.post("/profile/subjects", auth, async (req, res) => {
    try {
        const myProfile = await Profile.findOne({
            owner: req.user.id
        });

        if (!myProfile) {
            return res.status(404).send({ error: "Profile not found" });
        }

        // Check if subject already exists
        myProfile.subjects.forEach(subject => {
            if (subject.subject === req.body.subject) {
                throw new Error("Duplicate subject");
            }
        });

        myProfile.subjects = myProfile.subjects.concat(req.body);
        await myProfile.save();
        res.send(myProfile.subjects);
    } catch (e) {
        res.status(500).send({ error: e.message });
    }
});

//@route   GET /profile/subjects
//@desc    Read subjects of self profile
//@access  Private
//@tested  false
router.get("/profile/subjects", auth, async (req, res) => {
    try {
        const myProfile = await Profile.findOne({
            owner: req.user.id
        });

        if (!myProfile) {
            return res.status(404).send({ error: "Profile not found" });
        }

        res.send(myProfile.subjects);
    } catch (e) {
        res.status(500).send();
    }
});

//@route   DEL /profile/subjects/:subject
//@desc    Delete one subject of self profile
//@access  Private
//@tested  false
router.delete("/profile/subjects/:subject", auth, async (req, res) => {
    try {
        const myProfile = await Profile.findOne({
            owner: req.user.id
        });

        if (!myProfile) {
            return res.status(404).send({ error: "Profile not found" });
        }

        const subjects = myProfile.subjects;
        let subjectIndex = -1;

        // Find the index position of school provided in query params
        // in the education array
        for (let i = 0; i < subjects.length; i++) {
            if (subjects[i].subject === req.params.subject) {
                subjectIndex = i;
            }
        }

        // console.log(req.params.subject);
        // console.log(myProfile.subjects.indexOf(req.params.subject));

        if (subjectIndex >= 0) {
            myProfile.subjects.splice(subjectIndex, 1);
        } else {
            throw new Error("Subject not found");
        }
        await myProfile.save();
        res.send(myProfile.subjects);
    } catch (e) {
        res.status(400).send({ error: e.message });
    }
});

module.exports = router;
