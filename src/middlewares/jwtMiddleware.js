//jwtMiddleware.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

/**
 * Middleware to verify a general user token.
 * If the token is valid, it adds the user information to the request object.
 * Endpoint: All endpoints requiring user authentication.
 */
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
        } else {
            res.status(403).json({ message: "Access Denied: Missing Token" });
        }
    } catch (error) {
        console.log(error);
        res.status(403).json({ message: "Access Denied: Invalid Token" });
    }
};

/**
 * Middleware to verify a user token.
 * If the token is valid, it adds the user information to the request object.
 * It also checks if the user_id in the token matches the user_id in the request params.
 * Endpoint: All endpoints requiring user authentication and matching user_id.
 */
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
                res.status(403).json({ message: "Incorrect Token: User ID Mismatch" });
            }
        } else {
            res.status(403).json({ message: "Access Denied: Invalid User Token" });
        }
    } catch (error) {
        console.log(error);
        res.status(403).json({ message: "Access Denied: Invalid Token" });
    }
};

/**
 * Middleware to verify a member token.
 * If the token is valid, it adds the user information to the request object.
 * It also checks if the user_id and group_id in the token match the respective parameters in the request.
 * Endpoint: All endpoints requiring member authentication and matching user_id and group_id.
 */
exports.verifyMemberToken = async (req, res, next) => {
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

            if (payload.user_id == req.params.user_id && payload.group_id == req.params.group_id) {
                next();
            } else {
                res.status(403).json({ message: "Incorrect Token: User ID or Group ID Mismatch" });
            }
        } else {
            res.status(403).json({ message: "Access Denied: Invalid User Token" });
        }
    } catch (error) {
        console.log(error);
        res.status(403).json({ message: "Access Denied: Invalid Token" });
    }
};
