const express=require('express');
const proController=require('../controllers/pro.controller');

const router=express.Router();

const {getPros,getProById,createPro,updatePro,deletePro}=require('../controllers/pro.controller');

router.get('/',getPros);
router.get('/:id',getProById);
router.post('/',createPro);
router.put('/:id',updatePro);
router.delete('/:id',deletePro);

module.exports=router;
