import express from "express";
import { getDashboardStats } from "../controllers/dashboardController.js";

const dashboardRouter = express.Router();

dashboardRouter.get("/stats/:userId", getDashboardStats);

export default dashboardRouter;