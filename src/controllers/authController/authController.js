import { createOrUpdateAuthModuleService,getModuleFeaturesService } from "../../services/authService/authService.js";


export const createOrUpdateAuthModule = async (req, res) => {
  try {
    const { clientId, moduleName, features } = req.body;

    if (!clientId || !moduleName) {
      return res.status(400).json({
        success: false,
        message: "clientId and moduleName are required",
      });
    }

    const filteredFeatures = (features || []).filter(
      (f) => f.name && f.name.trim() !== ""
    );

    if (filteredFeatures.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one feature must be selected",
      });
    }

    const module = await createOrUpdateAuthModuleService({
      clientId,
      moduleName,
      features: filteredFeatures,
    });

    return res.status(200).json({
      success: true,
      message: "Module created or updated successfully",
      data: module,
    });

  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};


export const getModuleFeatures = async (req, res) => {
  try {
    const { clientId, moduleName } = req.params;

    if (!clientId || !moduleName) {
      return res.status(400).json({
        success: false,
        message: "clientId and moduleName are required",
      });
    }

    const features = await getModuleFeaturesService(clientId, moduleName);

    return res.status(200).json({
      success: true,
      message: "Features fetched successfully",
      data: features,
      count: features.length
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};