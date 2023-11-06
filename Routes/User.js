const express = require('express')
const router= express.Router()
const User = require("../Models/User")
router.get('/',async(req,res)=>{
    const U = await User.find()
    res.json(U)
})


router.post('/',async(req,res)=>{
    const U = new User({
        name:req.body.name,
        Number:req.body.Number
    })
    const ui= await U.save()
    res.json(ui)

})

router.get('/:id',async(req,res)=>{
    const U = await User.findById(req.params.id)
    res.json(U)
})


router.patch('/:id',async(req,res)=>{
    // const U = await User.findById(req.params.id)
    const updated_fields = req.body
    const update = await User.findByIdAndUpdate(req.params.id, updated_fields,{new:true})
    if (update) {
        res.json(update);
    } else {
        res.status(404).json({ error: 'User not found' });
    }
})









module.exports = router