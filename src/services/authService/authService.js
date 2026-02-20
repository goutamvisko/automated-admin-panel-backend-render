import { services } from "../index.js";

const authModuleService = services.auth;

export const createOrUpdateAuthModuleService = async ({
  clientId,
  moduleName,
  features,
}) => {
  const existingModule = await authModuleService.findOne({
    clientId,
    moduleName,
  });

  if (!existingModule) {
    return await authModuleService.create({
      clientId,
      moduleName,
      features,
    });
  }

  const existingFeaturesMap = new Map();
  
  if (existingModule.features && existingModule.features.length > 0) {
    existingModule.features.forEach(feature => {
      existingFeaturesMap.set(feature.name.toLowerCase(), feature);
    });
  }

  if (features && features.length > 0) {
    features.forEach(newFeature => {
      const key = newFeature.name.toLowerCase();
      
      if (existingFeaturesMap.has(key)) {
        existingFeaturesMap.set(key, {
          ...existingFeaturesMap.get(key),
          ...newFeature,
        });
      } else {
        existingFeaturesMap.set(key, newFeature);
      }
    });
  }

  const finalFeatures = Array.from(existingFeaturesMap.values());

  const updatedModule = await authModuleService.update(
    { _id: existingModule._id },
    { $set: { features: finalFeatures } },
    { new: true, runValidators: true }
  );

  return updatedModule;
};


export const getModuleFeaturesService = async (clientId, moduleName) => {
  const module = await authModuleService.findOne(
    { clientId, moduleName },
    { features: 1, _id: 0 } 
  );
  
  return module ? module.features : [];
};
