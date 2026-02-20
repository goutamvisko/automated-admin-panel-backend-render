import {
  createPlanService,
  deletePlanService,
  getPlansService,
  updatePlanService,
} from "../../services/paymentService/planServices.js";

export const createPlan = async (req, res) => {
  try {
        const { clientId, plans } = req.body;

    const plan = await createPlanService(clientId,plans);

    res.status(201).json({
      success: true,
      message: "Plan created successfully",
      data: plan,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getPlans = async (req, res) => {
  try {
    const { clientId } = req.params;

    const plans = await getPlansService(clientId);

    res.json({
      success: true,
      message: "Plans fetched successfully",
      data: plans,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updatePlan = async (req, res) => {
  try {
    const clientId = req.params.clientId;
    const planId = req.params.planId;

    const plan = await updatePlanService(clientId, planId, req.body);

    res.json({
      success: true,
      message: "Plan updated successfully",
      data: plan,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deletePlan = async (req, res) => {
  try {
    const clientId = req.params.clientId;
    const planId = req.params.planId;

    await deletePlanService(clientId, planId);

    res.json({
      success: true,
      message: "Plan deleted successfully",
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
