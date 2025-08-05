import jwt from "jsonwebtoken";
import UserModel, { role } from "../../db/models/User.model.js";
import * as DBService from "../../db/db.service.js"
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
    options = { expiresIn: process.env.JWT_USER_EXPIRES_IN || "30m" }
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

    export const decodedToken = async ({next,authorization="",tokenType=tokenType.access } = {}) => { 

 
    const [Bearer, token] = authorization.split(" ")
    
    console.log({token , Bearer})
    if (!Bearer ||!token) {
        return next(new Error("Invalid token", { cause: 401 }))
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
       



    const decoded = await verifyToken({ token ,
         secretKey: tokenType === tokenType.access ? signature.accessSignature : signature.refreshSignature })

    if (!decoded?.id) {
        return next(new Error("Invalid token", { cause: 401 }))
    }

    const user = await DBService.findById({
        model: UserModel,
        id: decoded.id,
       
    })
 
 

    
    if (!user) {
        return next(new Error("Not registered user", { cause: 401 }))
    }
    
    return user

}



export const generateNewCredentials = async ({
    user = {}
} = {}) => {


    let signature =  await getSignature({ signatureLevel: user.role !== role.user ? "System" : "Bearer" })
    
    // Generate Tokens
    const access_token = await generateToken({
        payload: {
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            gender: user.gender,
        },
        secretKey: signature.accessSignature,
        options: { expiresIn: process.env.JWT_USER_EXPIRES_IN }
    });

    const refresh_token = await generateToken({
        payload: {
            id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            gender: user.gender,
        },
        secretKey: signature.refreshSignature,
        options: { expiresIn: process.env.JWT_USER_REFRESH_EXPIRES_IN }
    });



    return { access_token, refresh_token }

}