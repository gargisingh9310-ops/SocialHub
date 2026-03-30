import notificationModel from "../schemas/notificationSchema.js"

export async function getNotifications(req, res) {
    try {
        const {userId}= req.params

        const notifications= await notificationModel.find({
            userId
        }).sort({createdAt: -1})

        return res.status(200).json({
            notifications
        })
    } catch (error) {
        return res.status(500).json({
            message: "something went wrong"
        })
    }
}

export async function markAsRead(req, res) {
    try {
        const {notificationId} = req.body

        const notification= await notificationModel.findById(notificationId)
        if(!notification){ 
            return res.status(404).json({
                message: "notification not found"
            })
        }

        notification.isRead= true
        await notification.save()

        return res.status(200).json({
            message: "notification marked as read"
        }) 
        } catch (error) {
        return res.status(500).json({
            message: "something went wrong"
        })
    }
}

export async function deleteNotification(req, res) {
    try {
        const {notificationId} = req.body

        const notification= await notificationModel.findById(notificationId)
        if(!notification){
            return res.status(404).json({
                message: "notification not found"
            })
        }

        await notificationModel.findByIdAndDelete(notificationId)

        return res.status(200).json({
            message: "notification deleted"
        })
    } catch (error) {
        return res.status(500).json({
            message: "something went wrong"
        })
    }
}

export async function getUnreadCount(req, res) {
    try {
        const {userId}= req.params

        const count= await notificationModel.countDocuments({
            userId, 
            isRead:false
        })

        return res.status(200).json({
            unreadCount:count
        })
    } catch (error) {
        return res.status(500).json({
            message: "something went wrong"
        })
    }
} 