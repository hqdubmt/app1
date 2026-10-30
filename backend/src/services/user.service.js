const express=require('express');
const userModel=require('../models/user.model');

const getUsers=async()=>{
    return await userModel.getUsers();
};

const getUserById=async(id)=>{
    return await userModel.getUserById(id);
};

const createUser = async(data) => {
    return await userModel.createUser(data);
};

const updateUser=async(id,data)=>{
    return await userModel.updateUser(id,data);
};

const deleteUser=async(id)=>{
    return await userModel.deleteUser(id);
};

module.exports={getUsers,getUserById,createUser,updateUser,deleteUser};