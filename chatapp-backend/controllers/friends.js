 const HttpStatus = require('http-status-codes');
const { create } = require('../models/userModels');

  const User = require('../models/userModels');

module.exports = {
    FollowUser(req, res) {
        const followUser = async () => {
            await User.update(
                {
                    _id: req.user._id,
                    'following.userFollowed': { $ne: req.body.userFollowed }
                },
                {
                    $push: {
                        following: {
                            userFollowed: req.body.userFollowed
                        }
                    }
                }
            );

            await User.update(
                {
                    _id: req.body.userFollowed,
                    'following.follower': { $ne: req.user._id }
                },
                {
                    $push: {
                        followers: {
                            follower : req.user._id
                        },
                        notification: { 
                            senderId: req.user._id,
                            message: `${req.user.username} is now following you `,
                            created: new Date(),
                            viewProfile: false
                        }
                    }
                }
            );
        };

        followUser()
        .then(() =>{
            res
            .status(HttpStatus.OK)
            .json({message: 'Following user now' });
        })
        .catch(err => {
            res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({message: 'Error occured'});
        });  
    },



    UnFollowUser(req, res) {
        const unFollowUser = async () => {
            await User.update(
                {
                    _id: req.user._id
                  
                },
                {
                    $pull: {
                        following: {
                            userFollowed: req.body.userFollowed
                        }
                    }
                }
            );

            await User.update(
                {
                    _id: req.body.userFollowed
                },
                {
                    $pull: {
                        followers: {
                            follower : req.user._id
                        }
                    }
                }
            );
        };

        unFollowUser()
        .then(() =>{
            res
            .status(HttpStatus.OK)
            .json({message: 'Unfollowing user now' });
        })
        .catch(err => {
            res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({message: 'Error occured'});
        });  
    },
    async MarkNotification(req, res){
      //  console.log(req.body);
      if (!req.body.deleteValue){
        await User.updateOne({
            _id: req.user._id,
            'notification._id': req.params.id
        }, 
        {
            $set: { 'notification.$.read': true }
        }
        ).then(() => {
            res
            .status(HttpStatus.OK)
            .json({message: 'Marked as read'});
        }).catch( err => {
            res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({message: 'Error occured'});
        });
      } else {
          await User.update({
              _id: req.user._id,
              'notification._id': req.params.id
          },
    {
        $pull : {
            notification: { _id: req.params.id }
        }
    }
    ).then(() => {
        res
        .status(HttpStatus.OK)
        .json({message: 'Deleted successfully'});
    }).catch( err => {
        res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({message: 'Error occured'});
    });
      }
    },
    async MarkAllNotification(req, res) {
        console.log(req.body);
        await User.update({
            _id: req.user._id
        }, 
        {
            $set: { 'notification.$[elem].read': true }
        },
        { arrayFilters: [{ 'elem.read': false }], multi: true }
        ).then(() => {
            res
            .status(HttpStatus.OK)
            .json({message: 'Marked successfully'});
        }).catch( err => {
            res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({message: 'Error occured'});
        });
    }
}; 