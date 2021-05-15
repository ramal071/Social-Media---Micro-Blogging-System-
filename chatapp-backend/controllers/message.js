const HttpStatus = require('http-status-codes');
const Message = require('../models/messageModels');
const Conversation = require('../models/conversationModels');
const User = require('../models/userModels');
const { result, values } = require('lodash');
const Helper = require('../Helpers/helpers');

module.exports = {
    async GetAllMessages(req, res) {
        const { sender_Id, receiver_Id } = req.params;
        const conversation = await Conversation.findOne({
            $or:  [
                {
                    $and: [{'participants.senderId': sender_Id},
                    {'participants.receiverId': receiver_Id}
                ]
                },
                {
                    $and: [{'participants.senderId': receiver_Id},
                    {'participants.receiverId': sender_Id }
                ]
                }
            ]
        }).select('_id');

        if(conversation) {
            const messages = await Message.findOne({
                conversationId: conversation._id});

                res.status(HttpStatus.OK)
                .json({ message: 'Messages returned', messages})
        }
    },   

    SendMessage(req, res) {
       // console.log(req.body); 
       const { sender_Id, receiver_Id } = req.params;

       Conversation.find({
           $or: [
               { participants: { 
                   $elemMatch: { senderId: sender_Id,
            receiverId: receiver_Id}
                 }
             },

         { participants: { 
             $elemMatch: { senderId: receiver_Id,receiverId: sender_Id}
            }
        }
           ]
        }, async (err, result) => {
            if(result.length > 0) {
            //  console.log(result);
            const msg = await Message.findOne({conversationId: result[0]._id});
                Helper.updateChatList(req, msg);
               await Message.updateOne({
                    conversationId: result[0]._id
                }, {
                    $push: {
                        message: {
                    senderId: req.user._id,
                    receiverId: req.params.receiver_Id,
                    sendername: req.user.username,
                    receivername: req.body.receiverName,
                    body: req.body.message
                        } 
                    }
                }).then(() => 
                res.status(HttpStatus.OK).json({ message: 'Message sent successfully' })
                )
                .catch(err => 
                    res.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .json({ message : 'Error occured' })
                    );  

            } else {
                const newConversation = new Conversation();

                newConversation.participants.push({
                    senderId: req.user._id,
                    receiverId: req.params.receiver_Id
                });  
                const saveConversation = await newConversation.save();
                
                const newMessage = new Message();
                newMessage.conversationId = saveConversation._id;
                newMessage.sender = req.user.username;
                newMessage.receiver = req.body.receiverName;
                newMessage.message.push({
                    senderId: req.user._id,
                    receiverId: req.params.receiver_Id,
                    sendername: req.user.username,
                    receivername: req.body.receiverName,
                    body: req.body.message
                });

                await User.updateMany({
                    _id: req.user._id
                }, {
                    $push:  {
                        chatList: {
                            $each: [
                                { 
                                    receiverId: req.params.receiver_Id,
                                    msgId: newMessage._id
                                }
                            ],
                            $position: 0
                        }
                    }
                }
                );

                await User.updateMany({
                    _id: req.params.receiver_id
                }, {
                    $push:  {
                        chatList: {
                            $each: [
                                { 
                                    receiverId: req.user._Id,
                                    msgId: newMessage._id
                                }
                            ],
                            $position: 0
                        }
                    }
                }
                );

                await newMessage
                .save()
                .then(() => 
                res.status(HttpStatus.OK).json({ message: "Message sent" })
                )
                .catch(err => 
                    res.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .json({ message : 'Error occured' })
                    );
                
            }
       }); 
    },
    async MarkReceiverMessages(req, res) {
       // console.log(req.params);
       const { sender, receiver } = req.params;
       const msg = await Message.aggregate ([
           { $unwind : '$message' },
        {
            $match: {
                $and: [{'message.sendername': receiver, 'message.receivername': sender }]
            }
        }
       ]);
      // console.log(msg);
      if(msg.length > 0) {     
          try {
              msg.forEach(async (value) => {
                  await Message.updateMany({
                    'message._id': value.message._Id
                  },
                  { $set: { 'message.$.isRead': true } } 
                  );
              });
              res
              .status(HttpStatus.OK)
              .json({ message: 'Messages maked as read'});
          } catch (err) {
            res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ message: 'Error occured' });
          }
      }
    },

    async MarkAllMessages(req, res) {
       
        const msg = await Message.aggregate ([
            {$match: {'message.receivername': req.user.username}},
            {$unwind: '$message'},
            {$match: {'message.receivername': req.user.username}},
        ]);

       // console.log(msg);  lesson 220
        
       // console.log(msg);
       if(msg.length > 0) {     
           try {
               msg.forEach(async (value) => {
                   await Message.updateMany({
                     'message._id': value.message._Id
                   },
                   { $set: { 'message.$.isRead': true } } 
                   );
               });
               res
               .status(HttpStatus.OK)
               .json({ message: 'All messages maked as read'});
           } catch (err) {
             res
             .status(HttpStatus.INTERNAL_SERVER_ERROR)
             .json({ message: 'Error occured' });
           }
       }
     }
};