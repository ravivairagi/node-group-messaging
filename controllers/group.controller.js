const Group = require('../schema/group.schema')

module.exports.createGroup = async (req, res) => {
    try {
        const { name } = req.body;
        const group = await Group.create({userId: req.user._id, name});
        res.status(201).json({ message: 'Group created successfully', group });
    } catch (error) {
        res.status(500).json({ error: 'Something broken' });
    }
};

module.exports.addMembers = async (req, res) => {
    try {

        const {id : _id } = req.params;
        const { members } = req.body;
        if(!members){
            return res.status(400).json({message: 'Missing required fields members'});
        }
        const group = await Group.get({_id});
        group.members = [ ...new Set(group.members.concat(members))]
        await group.save();
        res.status(200).json({ message: 'Group members added successfully' });

    } catch (error) {
        res.status(500).json({ error: 'Something broken' });
    }
};

module.exports.sendMessage = async (req, res) => {
    try {
        const _id = req.params.id,
            senderId = req.user._id;

        let group = await Group.get({_id});

        if (!group) {
            return res.status(404).json({ error: 'Group not found' });
        }

        // Check if the user is a member of the group or not
        if (!group.members.includes(senderId)) {
           return res.status(403).json({ error: 'User is not a member of the group' });
        }

        // Create a new message
        let message = {
            text: req.body.message,
            sender: senderId,
            likes: [],
        };

        group.messages.push(message);
        await group.save();
        message = group.messages.slice(-1)[0]

        res.status(201).json({ message: 'Message sent successfully', message });
    } catch (error) {
        res.status(500).json({ error: 'Something broken' });
    }
};

module.exports.likeMessage = async (req, res) => {
    try {
        const { id: _id, messageId } = req.params;

        // Check if group exist
        const group = await Group.get({_id});
        if (!group) {
            return res.status(404).json({ error: 'Group not found' });
        }

        if (!group.members.includes(req.user._id)) {
            return res.status(403).json({ error: 'User is not a member of the group' });
        }

        const message = group.messages.id(messageId);
        if (!message) {
            return res.status(404).json({ error: 'Message not found' });
        }

        // Add the user's like to the message
        message.likes.push(_id);
        await group.save();

        res.status(200).json({ message: 'Message liked successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Something broken' });
    }
};

module.exports.getGroup = async (req, res) => {
    try {
        const {id : _id } = req.params
        const group = await Group.get({_id});
        res.status(200).json({ message: 'Group details', group });
    } catch (error) {
        res.status(500).json({ error: 'Something broken' });
    }
};

module.exports.searchGroup = async (req, res) => {
    try {
        let { name } = req.params
        const groups = await Group.search({ name: { $regex: name, $options: 'i' } });
        res.status(200).json({ message: 'Group details', groups });
    } catch (error) {
        res.status(500).json({ error: 'Something broken' });
    }
};

module.exports.deleteGroup = async (req, res) => {
    try {
        const {id : _id } = req.params
        let group = await Group.delete({_id});

        if(!group.deletedCount){
            return res.status(404).json({ message: 'Invalid group id' });
        }

        return res.status(200).json({ message: 'Group deleted successfully' });

    } catch (error) {
        res.status(500).json({ error: 'Something broken' });
    }
};
