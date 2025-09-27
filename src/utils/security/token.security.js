import jwt from "jsonwebtoken";
import UserModel, { role } from "../../db/models/User.model.js";
import * as DBService from "../../db/db.service.js"
import { v4 as uuidv4 } from 'uuid'
import BlackListModel from "../../db/models/blackList.model.js"
export const logoutEnum = {
    signoutFromAll: "signoutFromAll",
    signoutFromDevice: "signoutFromDevice",
    stayLoggedIn: "stayLoggedIn"
}
export const signatureLevel = {
    System: "System",
    Bearer: "Bearer"
}
export const tokenType = {
    access: "access",
    refresh: "refresh"
}


export const generateToken = async ({
    payload = {},
    secretKey = process.env.JWT_ACCESS_USER_SECRET,
    options = { expiresIn: Number(process.env.JWT_USER_EXPIRES_IN) || "30m" }
} = {}) => {
    return jwt.sign(payload, secretKey, options);
};

export const verifyToken = async ({
    token = "",
    secretKey = process.env.JWT_ACCESS_USER_SECRET,
    options = {}
} = {}) => {
    return jwt.verify(token, secretKey, options);
};

export const decodeToken = async ({
    token = ""
} = {}) => {
    return jwt.decode(token);
};


export const getSignature = async ({ signatureLevel = "Bearer" } = {}) => {
    const signature = {
        accessSignature: undefined,
        refreshSignature: undefined
    };

    switch (signatureLevel) {
        case signatureLevel.System:
            signature.accessSignature = process.env.JWT_ACCESS_ADMIN_SECRET;
            signature.refreshSignature = process.env.JWT_REFRESH_ADMIN_SECRET;


            break;

        default:
            signature.accessSignature = process.env.JWT_ACCESS_USER_SECRET;
            signature.refreshSignature = process.env.JWT_REFRESH_USER_SECRET;

            break;
    }
    return signature
}

export const decodedToken = async ({ next, authorization = "", tokenType: type = tokenType.access } = {}) => {

    const [Bearer, token] = authorization.split(" ")

    console.log({ token, Bearer })
    if (!Bearer || !token) {
        next(new Error("Invalid token", { cause: 401 }));
        return;
    }

    let signature = {
        accessSignature: undefined,
        refreshSignature: undefined
    };

    switch (Bearer) {
        case signatureLevel.System:
            signature.accessSignature = process.env.JWT_ACCESS_ADMIN_SECRET;
            signature.refreshSignature = process.env.JWT_REFRESH_ADMIN_SECRET;
            break;

        default:
            signature.accessSignature = process.env.JWT_ACCESS_USER_SECRET;
            signature.refreshSignature = process.env.JWT_REFRESH_USER_SECRET;
            break;
    }

    try {
        const decoded = await verifyToken({
            token,
            secretKey: type === tokenType.access ? signature.accessSignature : signature.refreshSignature
        })

        if (!decoded?.id) {
            next(new Error("Invalid token", { cause: 401 }));
            return;
        }

        if (decoded.jti && await DBService.findOne({ model: BlackListModel, filter: { jti: decoded.jti } })) {
            next(new Error("Token is blacklisted", { cause: 401 }));
            return;
        }

        const user = await DBService.findById({
            model: UserModel,
            id: decoded.id,
        })

        if (!user) {
            next(new Error("Not registered user", { cause: 404 }));
            return;
        }
        console.log(user , "user");
        
        
        if (user?.changeCredintialsTime?.getTime() > decoded.iat )   {
            next(new Error("Token is expired", { cause: 401 }));
            
            return;
        }

        console.log(user.changeCredintialsTime?.getTime(), decoded.iat, "user.changeCredintialsTime?.getTime() > decoded.iat * 1000")

        return { user, decoded }

    } catch (error) {
        next(new Error("Token verification failed", { cause: 401 }));
        return;
    }



}



export const generateNewCredentials = async ({
    user = {}
} = {}) => {


    let signature = await getSignature({ signatureLevel: user.role !== role.user ? "System" : "Bearer" })

    const jwtId = uuidv4()
    // Generate Tokens
    const access_token = await generateToken({
        payload: {
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            gender: user.gender,
            jti: jwtId

        },
        secretKey: signature.accessSignature,
        options: {
            expiresIn: process.env.JWT_USER_EXPIRES_IN

        }
    });

    const refresh_token = await generateToken({
        payload: {
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            gender: user.gender,
            jti: jwtId

        },
        secretKey: signature.refreshSignature,
        options: {
            expiresIn: process.env.JWT_USER_REFRESH_EXPIRES_IN

        }
    });



    return { access_token, refresh_token }

}

export const revokeTokenForAll = async ({req} = {}) => {
    return await DBService.create({ 
        model: BlackListModel,
        data: {
            jti: req.decoded.jti,
            userId: req.decoded.id,
            expireAt: new Date(Date.now() + (Number(process.env.JWT_REVOKE_EXPIRES_IN || 31536000) * 1000)), 
        },
       return: true
    })
}