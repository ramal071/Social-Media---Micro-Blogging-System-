const cloudinary = require('cloudinary');
const HttpStatus = require('http-status-codes');
//const { result } = require('lodash');


const User = require('../models/userModels');
//const message = require('./message'); /****** */

cloudinary.config({ 
    cloud_name: 'dxhesnkk0', 
    api_key: '114476111234844', 
    api_secret: 'MmF32VMfkBWiarcoaXlB1znii-I'
  });

module.exports = {
    UploadImage(req, res) {
        // console.log(req.body);  L 243
        cloudinary.uploader.upload(req.body.image, async (result) => {
           // console.log(result);   L 248

            await User.update ({
                _id: req.user._id 
            }, {
                $push: {
                    images: {
                        imgId: result.public_id, 
                        imgVersion: result.version
                    
                    }
                }
            }).then(() =>
            res
            .status(HttpStatus.OK)
            .json({ message: 'Image uploaded successfully' })
            ).catch(err => 
                res
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .json({ message: 'Error' })
            );
        });
    },

    async SetDefaultImage(req, res) {
        const { imgId, imgVersion } = req.params;

        await User.update ({
            _id: req.user._id 
        }, 
        {
            picId: imgId,
            picVersion: imgVersion,
        })
        .then(() =>
        res
        .status(HttpStatus.OK)
        .json({ message: 'Default image set' })
        )
        .catch(err => 
            res
            .status(HttpStatus.INTERNAL_SERVER_ERROR)
            .json({ message: 'Error' })
        );
    }
    
};