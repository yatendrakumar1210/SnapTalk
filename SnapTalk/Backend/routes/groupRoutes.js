const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const { checkGroupPermission } = require('../middleware/permissionMiddleware');
const {
  createGroup,
  getGroupDetails,
  updateGroupInfo,
  addGroupMember,
  removeGroupMember,
  updateMemberRole
} = require('../controllers/groupController');

router.use(authMiddleware);

router.post('/', createGroup);
router.get('/:groupId', getGroupDetails);
router.put('/:groupId', checkGroupPermission('editGroupInfo'), updateGroupInfo);
router.post('/:groupId/members', checkGroupPermission('addMembers'), addGroupMember);
router.post('/:groupId/members/remove', removeGroupMember);
router.put('/:groupId/members/role', updateMemberRole);

module.exports = router;
