
import { services } from "../index.js";

const baseService = services.plan;


export const createPlanService = async (clientId, plansArray) => {
  if (!clientId) throw new Error("ClientId is required");
  if (!Array.isArray(plansArray) || plansArray.length === 0) {
    throw new Error("Plans array is required");
  }

  let clientPlans = await baseService.findOne({ clientId });

  if (!clientPlans) {
    if (plansArray.length > 4) {
      throw new Error("Maximum 4 plans allowed per client");
    }

    return await baseService.create({
      clientId,
      plans: plansArray,
    });
  }

  const totalPlans = clientPlans.plans.length + plansArray.length;

  if (totalPlans > 4) {
    throw new Error("Maximum 4 plans allowed per client");
  }

  const existingNames = clientPlans.plans.map((p) =>
    p.name.toLowerCase()
  );

  const duplicate = plansArray.find((p) =>
    existingNames.includes(p.name.toLowerCase())
  );

  if (duplicate) {
    throw new Error(`Plan ${duplicate.name} already exists`);
  }

  return await baseService.updateById(clientPlans._id, {
    $push: { plans: { $each: plansArray } },
  });
};


export const getPlansService = async (clientId) => {
  return await baseService.findOne({ clientId });
};

export const updatePlanService = async (clientId, planId, updateData) => {
  const clientPlans = await baseService.findOne({ clientId });

  if (!clientPlans) throw new Error("Plans not found");

  const plan = clientPlans.plans.id(planId);
  if (!plan) throw new Error("Plan not found");

  Object.assign(plan, updateData);

  return await clientPlans.save();
};

export const deletePlanService = async (clientId, planId) => {
  const clientPlans = await baseService.findOne({ clientId });

  if (!clientPlans) throw new Error("Plans not found");

  clientPlans.plans.pull(planId);

  return await clientPlans.save();
};
