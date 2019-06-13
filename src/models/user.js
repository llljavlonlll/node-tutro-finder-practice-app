const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema({
    first_name: {
        type: String,
        require: true,
        trim: true
    },
    last_name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid email");
            }
        }
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 6
    },
    position: {
        type: String,
        required: true,
        trim: true,
        validate(value) {
            if (!["tutor", "student"].includes(value.toLowerCase())) {
                throw new Error("Invalid position value");
            }
        }
    },
    tokens: [
        {
            token: {
                type: String,
                required: true
            }
        }
    ]
});

userSchema.virtual("profile", {
    ref: "Profile",
    localField: "_id",
    foreignField: "owner"
});

userSchema.methods.toJSON = function() {
    const userObject = this.toObject();
    delete userObject.password;
    delete userObject.tokens;
    return userObject;
};

userSchema.methods.generateAuthToken = async function() {
    const token = jwt.sign({ _id: this.id.toString() }, "hurshidaisthebest", {
        expiresIn: "7 days"
    });
    this.tokens = this.tokens.concat({ token });
    await this.save();
    return token;
};

userSchema.statics.findByCredentials = async function(email, password) {
    const user = await User.findOne({
        email
    });

    if (!user) {
        throw new Error("Unable to login");
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error("Unable to login");
    }

    return user;
};

userSchema.pre("save", async function(next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 8);
    }
    next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
