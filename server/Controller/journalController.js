const Journal =  require('../Models/journal-model')

const getAllJournal = async (req,res)=>{
    try {
        const journals = await Journal.find({userId:req.user.userId}).sort({createdAt:-1}).populate('userId','fullname gender email age')
        if(!journals){
            return res.status(404).json({
            success:false,
            message:'Journal is Empty'
        })
        }
        return res.status(200).json({
            success:true,
            message:'Journaling All',
            totalJournal:journals.length,
            journals
        })
    } catch (error) {
        console.error('error')
        return res.status(500).json({
            success:false,
            message:'Some Error Occured'
        })
    }
}

const getJournalById = async(req,res) =>{
    try {
        const journal = await Journal.findOne({_id:req.params.id,userId:req.user.userId}).populate('userId','fullname gender email age')
        if(!journal){
            return res.status(404).json({
            success:false,
            message:'NO Journal Found'
            })
        }
        return res.status(200).json({
            success:true,
            message:'Journal Found',
            journal
        })
    } catch (error) {
          console.error('error')
        return res.status(500).json({
            success:false,
            message:'Some Error Occured'
        })
    }
} 

const createJournal = async (req, res) => {
    try {
        const { title,color,content} = req.body;

        if (!title || !title.trim()) {
            return res.status(403).json({
                success: false,
                message: 'Fields Are Empty'
            });
        }

        const newJournal = await Journal.create({
            userId: req.user.userId,
            title,
            content,
            color: color || '#EB2D2E',
            status:'draft'
        });

        await newJournal.populate('userId','fullname gender email age')

        return res.status(200).json({
            success: true,
            message: 'New Journal Entry',
            newJournal,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Some Error Occurred'
        });
    }
};

const updateJournal = async(req,res)=>{
    try {
        const {title, content, color} = req.body

        const updateJournal = await Journal.findOneAndUpdate(
            {_id:req.params.id,userId:req.user.userId},
            {$set:{...(title && {title}) ,content,  ...(color && { color }), status:content ? 'inProgress':'draft'}},
            {
                new:true, runValidators:true
            },
        ).populate('userId','fullname gender email age')

        if(!updateJournal){
            return res.status(403).json({
                success:false,
                message:'Journal Not Found or You dont have the permission for it'
            })
        }

        return res.status(200).json({
            success:true,
            message:'Journal Updated Successfully!',
            newJournal:updateJournal
        })
    } catch (error) {
         console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Some Error Occurred'
        });
    }
}

const deleteJournal = async (req,res)=>{
    try {
        const id = req.params.id
        if(!id){
            return res.status(404).json({
                success:false,
                message:"No id is provided"
            })
        }
        const deleteJournal = await Journal.findOneAndDelete({
            _id:id,userId:req.user.userId
        }).populate('userId','fullname gender email age')

        if(!deleteJournal){
            return res.status(404).json({
                success:false,
                message:'Jounral Not Found'
            })
        }

        return res.status(200).json({
            success:true,
            message:'Jounral Successfully Deleted',
            deleteJournal
        })
    } catch (error) {
          console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Some Error Occurred'
        });
    }
}


module.exports = {getAllJournal, getJournalById, createJournal, updateJournal,deleteJournal}