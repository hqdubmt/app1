const express=require('express');
const db=require('../config/db');

const getUsers=async()=>{
    const result=await db.query('SELECT * FROM users');
    return result.rows;
};

const getUserById=async(id)=>{
    const result=await db.query('SELECT * FROM users WHERE id=$1',[id]);
    return result.rows[0];
};

const createUser=async(data)=>{
    const {name,email}=data;
    const result=await db.query('INSERT INTO users (name,email) VALUES ($1,$2) RETURNING *',[name,email]);
    return {id:result.rows[0].id,name,email};
};

const updateUser=async(id,data)=>{
    const {name,email}=data;
    await db.query('UPDATE users SET name=$1,email=$2 WHERE id=$3',[name,email,id]);
    return {id,name,email};
};

const deleteUser=async(id)=>{
    await db.query('DELETE FROM users WHERE id=$1',[id]);
    return true;
};

module.exports={getUsers,getUserById,createUser,updateUser,deleteUser}; 
