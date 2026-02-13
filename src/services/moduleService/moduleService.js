import { services } from "../index.js";

const authModuleService = services.auth;

export const createOrUpdateAuthModuleService = async ({
  clientId,
  moduleName,
  features,
}) => {
  let existingModule = await authModuleService.findOne({
    clientId,
    moduleName,
  });

  if (existingModule) {
    const existingFeatureNames = existingModule.features.map((f) => f.name);

    const newFeaturesToAdd = features.filter(
      (f) => !existingFeatureNames.includes(f.name),
    );

    if (newFeaturesToAdd.length > 0) {
      await authModuleService.updateOne(
        { _id: existingModule._id },
        { $addToSet: { features: { $each: newFeaturesToAdd } } },
      );
    }
  }

  return existingModule;
};
