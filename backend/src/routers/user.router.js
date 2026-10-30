const express=require('express');
const userController=require('../controllers/user.controller');

const router=express.Router();

const {getUsers,getUserById,createUser,updateUser,deleteUser}=require('../controllers/user.controller');

router.get('/',getUsers);
router.get('/:id',getUserById);
router.post('/',createUser);
router.put('/:id',updateUser);
router.delete('/:id',deleteUser);

module.exports=router;