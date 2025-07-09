// const verifyToken = (req,res,next)=>{
//     const token = req.headers["authorization"]

//     if (!token){
//         return res.status(403).json({status: "error", data: "Token required"})
//     }
//     try{
//        const decoded = jwt.verify(token.split(" ")[1],JWT_SECRET)
//        req.user = decoded
//        next() 
//     }
//     catch (error) {
//         res.status(401).json({ status: "error", data: "Invalid token" });
//     }
// }









// app.get("/user",verifyToken,async(req,res)=>{
//     try {
//         const userData = await user.findById(req.user.userId).select("-password"); // Exclude password from response
//         res.json({ status: "ok", data: userData });
//     } catch (error) {
//         res.status(500).json({ status: "error", data: error.message });
//     }
// })