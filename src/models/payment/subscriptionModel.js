const subscriptionSchema = new mongoose.Schema(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    planId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plan",
    },
    startDate: {
      type: Date,
      default: Date.now,
    },
    endDate: Date,
    paymentMethod: {
      type: String,
      enum: ["stripe", "razorpay", "paypal"],
    },

    gatewaySubscriptionId: String,
    currentPeriodEnd: Date,

    status: {
      type: String,
      enum: ["pending", "active", "cancelled", "expired"],
      default: "pending",
    },

  },
  { timestamps: true },
);
subscriptionSchema.index({ clientId: 1, status: 1 });

export default mongoose.model("Subscription", subscriptionSchema);
