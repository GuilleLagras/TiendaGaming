import { Schema , model } from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2'
const productSchema  = new Schema({
  title:{
    type:String,
    require:true
  } ,
  description:{
    type:String,
  } ,
  price:{
    type:Number,
    require:true
  } ,
  category: {
    type:String,
    require:true
  } ,
  code: {
    type:String,
    require:true
  },
  stock:{
    type: Number,
    default:0,
  } ,
  status: {
    type: Boolean,
    default:true
  } ,
  thumbnails: {
    type: [Object],
    required: true,
  } ,
  owner: {
    type: String,
    enum: ['Admin', 'Premium'],
    default: 'Admin'
  },
  
  ownerEmail: {
    type: String,
    required: true
  }
});
productSchema.plugin(mongoosePaginate)
export const productsModel = model('Products', productSchema )