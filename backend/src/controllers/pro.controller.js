const express=require('express');
const proService=require('../services/pro.service');

const getPros=async(req,res)=>{
    try{
        const pros=await proService.getPros();
        res.status(200).json(pros);
    }catch(err){
        res.status(500).json({message:err.message});
    }
};

const getProById=async(req,res)=>{
    try{
        const pro=await proService.getProById(req.params.id);

        if(!pro){
            return res.status(404).json({message:'Pro not found'});
        }
        res.status(200).json(pro);
    }catch(err){
        res.status(500).json({message:err.message});
    }
};

const createPro=async(req,res)=>{
    try{
        const pro=await proService.createPro(req.body);
        res.status(201).json(pro);
    }catch(err){
        res.status(500).json({message:err.message});
    }
};

const updatePro=async(req,res)=>{
    try{
        const pro=await proService.updatePro(req.params.id,req.body);
        if(!pro){
            return res.status(404).json({message:'Pro not found'});
        }
        res.status(200).json(pro);
    }   catch(err){
        res.status(500).json({message:err.message});
    }
};

const deletePro=async(req,res)=>{
    try{
        const pro=await proService.deletePro(req.params.id);
        if(!pro){
            return res.status(404).json({message:'Pro not found'});
        }
        res.status(200).json({message:'Pro deleted successfully'});
    }catch(err){
        res.status(500).json({message:err.message});
    }
};

module.exports={getPros,getProById,createPro,updatePro,deletePro};  