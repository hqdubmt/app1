const express=require('express');
const userService=require('../services/user.service');

const getUsers=async(req,res)=>{
    try{
        const users=await userService.getUsers();
        res.status(200).json(users);
    }catch(err){
        res.status(500).json({message:err.message});
    }
};

const getUserById=async(req,res)=>{
    try{
        const user=await userService.getUserById(req.params.id);
        if(!user){
            return res.status(404).json({message:'User not found'});
        }
        res.status(200).json(user);
    }catch(err){
        res.status(500).json({message:err.message});
    }
};

const createUser=async(req,res)=>{
    try{
        const user=await userService.createUser(req.body);
        res.status(201).json(user);
    }catch(err){
        res.status(500).json({message:err.message});
    }
};

const updateUser=async(req,res)=>{
    try{
        const user=await userService.updateUser(req.params.id,req.body);

        if(!user){
            return res.status(404).json({message:'User not found'});
        }
        res.status(200).json(user);
    }catch(err){
        res.status(500).json({message:err.message});
    }
};

const deleteUser=async(req,res)=>{
    try{
        const user=await userService.deleteUser(req.params.id);
        if(!user){
            return res.status(404).json({message:'User not found'});
        }
        res.status(200).json({message:'User deleted successfully'});
    }catch(err){
        res.status(500).json({message:err.message});
    }
};

module.exports={getUsers,getUserById,createUser,updateUser,deleteUser}; 