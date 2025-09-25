import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(

    {
        content: {
            type: String,
            trim: true,
            maxlength: [2000, "Message must be less than 2000 characters"],
            minlength: [1, "Message must be at least 1 character"],
            required: function(){
                return this.attachments?.length > 0 ? false : true
            },
        },
        attachments: [{
            public_id: {
                type: String,

            },
            secure_url: {
                type: String,

            }
        }],
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        receiver: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }




    },
    {
        timestamps: true,
    }
)





export const MessageModel = mongoose.models.Message || mongoose.model('Message', messageSchema)

