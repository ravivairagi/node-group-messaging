const router = require('express').Router();
const  {
    createGroup,
    sendMessage,
    likeMessage,
    getGroup,
    searchGroup,
    addMembers,
    deleteGroup
} = require('../controllers/group.controller');
const { isAuthenticate } = require('../middleware/auth');
const { validateCreateGroup, validateAddMembers, validateSendMessage } = require('../middleware/validation')

router.post('/',  isAuthenticate, validateCreateGroup, createGroup);
router.post('/:id/members',  isAuthenticate, validateAddMembers, addMembers);
router.post('/:id/message',  isAuthenticate, validateSendMessage, sendMessage);
router.post('/:id/message/:messageId/like',  isAuthenticate, likeMessage);
router.get('/:id', isAuthenticate, getGroup);
router.get('/search/:name',  isAuthenticate, searchGroup);
router.delete('/:id',  isAuthenticate, deleteGroup);

module.exports = router;
