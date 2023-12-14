const jwt = require('jsonwebtoken');
const jwtKey = process.env.JWT_KEY;
require('dotenv').config();

exports.verifyToken = async (req, res, next) => {
    try {
        const token = req.headers['authorization'];

        if (token !== undefined) {
            const payload = await new Promise((resolve, reject) => {
                jwt.verify(token, process.env.JWT_KEY, (error, decoded) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(decoded);
                    }
                });
            });

            req.user = payload;

            next();

        }
        else {
            res.status(403).json({ message: "Accès interdit : token manquant" })
        }
    } catch (error) {
        console.log(error);
        res.status(403).json({ message: "Accès interdit : token invalide" })
    }
}


exports.verifyUserToken = async (req, res, next) => {
    try {
        const token = req.headers['authorization'];

        if (token !== undefined) {

            const payload = await new Promise((resolve, reject) => {
                jwt.verify(token, process.env.JWT_KEY, (error, decoded) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(decoded);
                    }
                });
            });

            req.user = payload;


            if (payload.id == req.params.user_id) {
                next();
            } else {
                res.status(403).json({ message: "Vous n'avez pas le bon token" })
                return;
            }



        }
        else {
            res.status(403).json({ message: "Accès interdit : token user invalide" })
        }
    } catch (error) {
        console.log(error);
        res.status(403).json({ message: "Accès interdit : token invalide" })
    }
} 