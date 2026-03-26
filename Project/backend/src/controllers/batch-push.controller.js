"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendBatchPushController = void 0;
const batch_push_service_1 = require("../services/batch-push.service");
const app_error_1 = require("../utils/app-error");

const sendBatchPushController = async (req, res, next) => {
    try {
        const { language, title, body } = req.body;

        if (!language || !title || !body) {
            throw new app_error_1.BadRequestException("language, title, and body are required fields.");
        }

        const stats = await (0, batch_push_service_1.sendBatchPushByLanguageService)(language, title, body);

        return res.status(200).json({
            success: true,
            message: `Batch push completed for language: ${language}`,
            data: stats
        });
    } catch (error) {
        next(error);
    }
};
exports.sendBatchPushController = sendBatchPushController;
