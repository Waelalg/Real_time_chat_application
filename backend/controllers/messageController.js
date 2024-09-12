import Conversation from "../models/conversationModel.js";
import Message from "../models/messageModel.js";

const sendMessage = async (req,res)=>{
    try {
        const {message} = req.body;
        const {id : receiverId} = req.params;
        const senderId = req.user._id;

        let conversation = await Conversation.findOne({
            participants:{ $all:[senderId,receiverId]},
        });

        if(!conversation){
            conversation = await Conversation.create({
                participants: [senderId , receiverId],
            })
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            message,
        });

        if(newMessage){
            conversation.messages.push(newMessage._id);
        };


        //socket functionality will be here

        await Promise.all([conversation.save(),newMessage.save()]);

        res.status(201).json(newMessage)


    } catch (error) {
        console.log("Error sending a message : ",error.message)
        res.status(500).json({error : "Internal server error"})
    }
};

const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const senderId = req.user._id;

        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, userToChatId] }
        }).populate("messages");

        if (!conversation) {
            return res.status(200).json([]); // Return early if no conversation is found
        }

        const messages = conversation.messages;
        return res.status(200).json(messages); // Return early with messages

    } catch (error) {
        console.error("Error getting messages:", error); // Improved logging
        return res.status(500).json({ error: "Internal server error" });
    }
};


export {sendMessage , getMessages}