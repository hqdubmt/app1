const express=require('express');
const proModel=require('../models/pro.model');

const getPros=async()=>{
    return await proModel.getProducts();
};

const getProById=async(id)=>{
    return await proModel.getProductById(id);
};

const createPro=async(data)=>{
    const pro=new proModel(data);
    return await pro.save();
};

const updatePro=async(id,data)=>{
    return await proModel.updateProduct(id,data,{new:true});
};

const deletePro=async(id)=>{
    return await proModel.deleteProduct(id);
};

module.exports={getPros,getProById,createPro,updatePro,deletePro};