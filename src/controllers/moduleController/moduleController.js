import { createOrUpdateAuthModuleService } from "../../services/moduleService/moduleService.js";


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