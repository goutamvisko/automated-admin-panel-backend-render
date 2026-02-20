import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    planId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plan",
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: ["stripe", "razorpay", "paypal"],
      required: true,
    },

    gatewayPaymentId: String,

    amount: {
      type: Number,
      required: true,
    },

    currency: {
      type: String,
      default: "INR",
    },

    webhookVerified: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

paymentSchema.index({ clientId: 1, status: 1 });

export default mongoose.model("Payment", paymentSchema);
