const User = require('../schema/user.schema');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports.addUser = async (req, res) => {
    try {
        // Register new user
        let user = await User.add(req.body);
        res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
        res.status(500).json({ error: 'Something broken' });
    }
};

module.exports.signIn = async (req, res) => {
    try {
        let { username, password } = req.body;
        let user = await User.get({username});

        if (!user) {
            res.status(400).json({message: 'invalid username'});
            return;
        }

        const verified = bcrypt.compareSync(password, user.password);

        if(!verified){
            return res.status(400).json({message: 'Invalid username or password'});
        }

        // Create jwt token
        let token = await jwt.sign({ _id: user._id, }, process.env.JWT_TOKEN_STRING, {
            expiresIn: '1d',
        });

        res.status(200).json({ message: 'Success',  token });

    } catch (error) {
        res.status(500).json({ error: 'Something broken' });
    }
};

module.exports.getUsers = async (req, res) => {
    try {
        let { isAdmin, _id } = req.user;
        // Register new user
        const users = await User.list(isAdmin, _id);
        res.status(200)
            .json({
                message: 'Users list',
                users
            });
    } catch (error) {
        res.status(500).json({ error: 'Something broken' });
    }
};

module.exports.updateUser = async (req, res) => {
    try {

        let _id = req.params.id;
        let user = await User.get({_id});
        if(!user){
            return res.status(400 ).json({ message: 'Invalid user id'});
        }

        await User.update({ _id }, req.dataToUpdate);
        res.status(200).json({ message: 'Record updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Something broken' });
    }
};
