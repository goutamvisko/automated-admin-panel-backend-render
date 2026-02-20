import mongoose from "mongoose";

const singlePlanSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  currency: { type: String, default: "INR" },

  planType: {
    type: String,
    enum: ["monthly", "yearly", "quarterly"],
    required: true,
  },

  features: [{ type: String }],

  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  },
});

const planSchema = new mongoose.Schema(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    plans: {
      type: [singlePlanSchema],
      validate: {
        validator: function (value) {
          return value.length <= 4; 
        },
        message: "Maximum 4 plans allowed per client",
      },
    },
  },
  { timestamps: true }
);

export default mongoose.model("Plan", planSchema);
