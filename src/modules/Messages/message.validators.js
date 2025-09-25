import joi from "joi";

export const createMessageSchema = {
  params: joi.object().keys(
    {
        receiverId: joi.string().required() 
    }
  ),
  body: joi.object({
    content: joi.string().min(1).max(2000).messages({
        "string.empty": "Content is required",
        "string.min": "Content must be at least 1 character",
        "string.max": "Content must be less than 2000 characters"
    }).optional(),
    attachments: joi.array().min(0).max(2).items(joi.string()).optional()
  }).required()    
}
