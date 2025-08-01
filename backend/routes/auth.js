const jwt=require("jsonwebtoken");
require("dotenv").config();

const authenticateToken=(req,res,next)=>{
    const authHeader=req.headers["authorization"];
    const token=authHeader && authHeader.split(" ")[1];

    if(!token){
        return res.status(401).json({message:"Authentication token required"});
    }

    jwt.verify(token, process.env.JWT_SECRET,(err,user)=>{
        if(err){
            return res.status(403).json({message:"Invalid or Expired Token"});
        }
        req.user=user;
        next();
    });
};

module.exports=authenticateToken;