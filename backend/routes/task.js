const router=require("express").Router();
const Task=require("../models/task");
const User=require("../models/user");
const authenticateToken=require("./auth");
router.get("/user", authenticateToken, async (req, res) => {
  try {
    const id = req.headers.id;
    const user = await User.findById(id).select("username email");
    res.status(200).json({ data: user });
  } catch (err) {
    res.status(500).json({ message: "Error fetching user info" });
  }
});


router.post("/create-task",authenticateToken ,async (req,res)=>{
    try {
        const {title,desc}=req.body;
        const {id}=req.headers;
        const newTask= new Task({
            title:title,
            desc:desc,
        })
        const saveTask=await newTask.save();
        const taskid=saveTask._id;
        await User.findByIdAndUpdate(id,{$push:{tasks:taskid._id}});
        res.status(201).json({message:"Task created"});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Internal server error"});
    }
})

router.get("/get-all-tasks",authenticateToken,async (req ,res)=>{
    try {
        const {id}=req.headers;
        const userData=await User.findById(id).populate({
            path:"tasks",
            options:{sort:{createdAt:-1}},
        });
        const allTasks=userData.tasks;
        res.status(200).json({data:allTasks});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Internal server error"});
    }
});


router.delete("/delete-tasks/:id",authenticateToken,async (req ,res)=>{
    try {
        const {id}=req.params;
        const userId=req.headers.id;
        await Task.findByIdAndDelete(id);
        await User.findByIdAndUpdate(userId,{$pull:{tasks:id} }); 

        res.status(200).json({message:"Task Deleted Successfully"});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Internal server error"});
    }
});


router.put("/update-tasks/:id",authenticateToken,async (req ,res)=>{
    try {
        const {id}=req.params;
        const {title,desc}=req.body;
        await Task.findByIdAndUpdate(id,{title:title,desc:desc});
        res.status(200).json({message:"Task Updated Successfully"});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Internal server error"});
    }
});


router.put("/update-imp-task/:id",authenticateToken,async (req ,res)=>{
    try {
        const {id}=req.params;
        const TaskData= await Task.findById(id);
        const ImpTask=TaskData.important;
        await Task.findByIdAndUpdate(id,{important:!ImpTask});
        res.status(200).json({message:"Task Updated Successfully"});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Internal server error"});
    }
});


router.put("/update-complete-task/:id",authenticateToken,async (req ,res)=>{
    try {
        const {id}=req.params;
        const TaskData= await Task.findById(id);
        const CompleteTask=TaskData.complete;
        await Task.findByIdAndUpdate(id,{complete:!CompleteTask});
        res.status(200).json({message:"Task Updated Successfully"});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Internal server error"});
    }
});

router.get("/get-imp-tasks",authenticateToken,async (req ,res)=>{
    try {
        const {id}=req.headers;
        const Data=await User.findById(id).populate({
            path:"tasks",
            match:{important:true},
            options:{sort:{createdAt:-1}},
        });
        const ImpTaskData=Data.tasks;
        res.status(200).json({data:ImpTaskData});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Internal server error"});
    }
});



router.get("/get-complete-tasks",authenticateToken,async (req ,res)=>{
    try {
        const {id}=req.headers;
        const Data=await User.findById(id).populate({
            path:"tasks",
            match:{complete:true},
            options:{sort:{createdAt:-1}},
        });
        const CompTaskData=Data.tasks;
        res.status(200).json({data:CompTaskData});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Internal server error"});
    }
});


router.get("/get-Incomplete-tasks",authenticateToken,async (req ,res)=>{
    try {
        const {id}=req.headers;
        const Data=await User.findById(id).populate({
            path:"tasks",
            match:{complete:false},
            options:{sort:{createdAt:-1}},
        });
        const CompTaskData=Data.tasks;
        res.status(200).json({data:CompTaskData});
    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Internal server error"});
    }
});

module.exports=router;