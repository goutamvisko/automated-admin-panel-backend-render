import mongoose from "mongoose";

const validationSchema = new mongoose.Schema(
  {
    required: { type: Boolean, default: false },
    unique: { type: Boolean, default: false },
    minLength: { type: Number },
    maxLength: { type: Number },
  },
  { _id: false },
);

const fieldSchema = new mongoose.Schema(
  {
    fieldName: {
      type: String,
      required: true,
    },

    dataType: {
      type: String,
      enum: [
        "string",
        "number",
        "boolean",
        "date",
        "email",
        "password",
        "select",
      ],
      required: true,
    },

    defaultValue: mongoose.Schema.Types.Mixed,

    validations: validationSchema,
  },
  { _id: false },
);

const featureSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    fields: [fieldSchema],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { _id: false },
);

const moduleSchema = new mongoose.Schema(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    moduleName: {
      type: String,
      required: true,
    },
    features: [featureSchema],
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true },
);
moduleSchema.index({ clientId: 1, moduleName: 1 }, { unique: true });
export default mongoose.model("Auth", moduleSchema);
