import User from "../model/User.model.js";
import {Webhook} from "svix";
import "dotenv/config"
const ClearkWebhooks=async(req,res)=>{
    try {
        //create a svix instance with clerk webhook secret
        const whook=new Webhook(process.env.CLERK_WEBHOOKS_SECRET);
        // getting headers
        const headers={
            "svix-id":req.headers["svix-id"],
            "svix-timestamp":req.headers["svix-timestamp"],
            "svix-signature":req.headers["svix-signature"]
        }
        //verifying headers
        await whook.verify(JSON.stringify(req.body),headers)

        //getting data from request body
        const {data,type}=req.body;
        const userdata={
            _id:data.id,
            email:data.email_addresses[0].email_address,
            username: data.first_name + " " + data.last_name,
            image:data.image_url,
             phone: data.phone_numbers?.[0]?.phone_number || ""

        }
        //switch case for diffrent events
        switch(type){
            case "user.created":{
                await User.create(userdata);
                break;
            }
             case "user.created":{
                await User.findByIdAndUpdate(data.id,userdata);
                break;
            }
              case "user.deleted":{
                await User.findByIdAndDelete(data.id);
                break;
            }
            default:
                break;
            

        }
        res.status(200).json({message:"success webhook recived"})

    } catch (error) {
        console.log("there is some error",error);
        res.status(400).json({message:"success false webhook "})
        
    }
}
export default ClearkWebhooks;

