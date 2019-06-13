const mongoose = require("mongoose");

const profileSchema = mongoose.Schema({
    first_name: {
        type: String,
        trim: true,
        required: true
    },
    last_name: {
        type: String,
        trim: true,
        required: true
    },
    date_of_birth: {
        type: String,
        trim: true,
        required: true
    },
    gender: {
        type: String,
        trim: true,
        required: true
    },
    address: {
        type: String,
        trim: true
    },
    city: {
        type: String,
        trim: true
    },
    education: [
        {
            school: {
                type: String,
                unique: true,
                trim: true,
                required: true
            },
            level: {
                type: String,
                trim: true,
                required: true
            },
            specialization: {
                type: String,
                trim: true,
                required: true
            },
            date_entered: {
                type: Number,
                trim: true,
                required: true
            },
            grad_date: {
                type: String,
                trim: true,
                required: true
            }
        }
    ],
    ielts_score: {
        type: Number,
        trim: true,
        validate(value) {
            if (value < 1 || value > 9.0) {
                throw new Error("Invalid IELTS score");
            }
        }
    },
    gmat_score: {
        type: Number,
        trim: true,
        validate(value) {
            if (value < 200 || value > 800) {
                throw new Error("Invalid GMAT score");
            }
        }
    },
    reviews: [
        {
            review: {
                type: String,
                trim: true,
                required: true
            },
            point: {
                type: Number,
                trim: true,
                default: 5
            }
        }
    ],
    bio: {
        type: String,
        trim: true
    },
    subjects: [
        {
            subject: {
                type: String,
                trim: true,
                required: true
            }
        }
    ],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    isCertified: {
        type: Boolean,
        required: true
    }
});

const Profile = mongoose.model("Profile", profileSchema);

module.exports = Profile;
