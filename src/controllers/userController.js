const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();
const saltRounds = 10;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{5,}$/;
const Email = require('mongoose-type-email');


exports.userRegister = async (req, res) =>  {
    try {
        let newUser = new User(req.body);

        if (!passwordRegex.test(newUser.password)) {
            res.status(401).json({
                message: "Le mot de passe doit faire au moin 5 caractère et contenir au moins une majuscule, une minuscule, un chiffre, et un caractère spécial."
            });
            return;
        }
        newUser.password = await bcrypt.hash(newUser.password, saltRounds);
        let user = await newUser.save();
        res.status(201).json({ message: `Utilisateur créé: ${user.email}` });
    } catch (error) {
        console.log(error);
        res.status(401).json({ message: `Requête invalide` });
    }
}


exports.userLogin = async (req, res) => {
    try {
        const user = await User.findOne({email: req.body.email});

        if(!user) {
            res.status(500).json({message: "Cet utilisateur n'existe pas"});
            return;
        }
        const isPasswordValid = await bcrypt.compare(req.body.password, user.password);

        if(user.email === req.body.email && isPasswordValid) {
            const userData = {
            id: user._id,
            email: user.email
        };
        const token = await jwt.sign(userData, process.env.JWT_KEY, { expiresIn: "10h"});
        res.status(200).json({token});
        } else {
            res.status(401).json({message: "Email ou mot de passe incorrect"});
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Une erreur s'est produite lors du traitement"});
    }

};


exports.userDelete = async (req, res) =>{

    try {
        await User.findByIdAndDelete(req.params.user_id);
        res.status(200).json({message: 'Utilisateur supprimé'});

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Une erreur s'est produite lors du traitement"});
    }
}


exports.userPut = async (req, res) =>{
    try {

        if(req.body.password){
            if (!passwordRegex.test(req.body.password)) {
                res.status(401).json({
                    message: "Le mot de passe doit faire au moin 5 caractère et contenir au moins une majuscule, une minuscule, un chiffre, et un caractère spécial."
                });
                return;
            }
            req.body.password = await bcrypt.hash(req.body.password, saltRounds);
        }

        let user = await User.findByIdAndUpdate(req.params.user_id, req.body, {new: true});

        res.status(201).json({ message: `Utilisateur modifié: ${user.email}` });

    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Une erreur s'est produite lors du traitement"});
    }
}



exports.userListAll = async (req,res) => {
    try {
        const users = await User.find({});
        
        try {

        res.status(200).json(users._id, users.email);
            
        } catch (error) { 
            console.log(error);
            res.status(401).json({ message: "Requête invalide" });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({message: "Une erreur s'est produite lors du traitement"});
    }

}
