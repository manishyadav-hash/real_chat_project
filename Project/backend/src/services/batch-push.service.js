"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendBatchPushByLanguageService = void 0;
const { Op } = require("sequelize");
const { FcmDeviceModel } = require("../models");
const firebase_service_1 = require("./firebase.service");

const sendBatchPushByLanguageService = async (language, title, body) => {
    let lastId = 0;
    let hasMoreUsers = true;
    let totalSent = 0;
    let totalFailed = 0;
    let totalInvalid = 0;
    let totalProcessed = 0;

    console.log(`Starting batch push for Language: ${language}`);

    let batchNumber = 1;
    while (hasMoreUsers) {
        const fetchTimerName = `DB Fetch Batch ${batchNumber} (500 users)`;
        console.time(fetchTimerName);

        // 1. Fetch exactly 500 users from the DB starting after the last ID
        const devicesBatch = await FcmDeviceModel.findAll({
            where: {
                language,
                id: { [Op.gt]: lastId },
                fcmToken: { [Op.not]: null }
            },
            attributes: ["id", "fcmToken"],
            limit: 500,
            order: [["id", "ASC"]],
            raw: true
        });

        console.timeEnd(fetchTimerName);
        batchNumber++;

        if (devicesBatch.length === 0) {
            hasMoreUsers = false;
            break;
        }

        totalProcessed += devicesBatch.length;

        // 2. Extract tokens
        const tokensChunk = devicesBatch.map(device => device.fcmToken);

        // 3. Send THIS specific batch of 500 to Firebase
        const pushResult = await (0, firebase_service_1.sendPushToTokens)({
            tokens: tokensChunk,
            title,
            body,
            data: { language, type: "batch_announcement" }
        });

        totalSent += pushResult.sentCount;
        totalFailed += pushResult.failedCount;
        totalInvalid += pushResult.invalidTokens.length;

        // 4. Update tracker so the next loop grabs the next 500
        lastId = devicesBatch[devicesBatch.length - 1].id;
    }

    console.log(`Finished batch push for ${language}. Processed: ${totalProcessed}. Sent: ${totalSent}`);

    return {
        totalProcessed,
        totalSent,
        totalFailed,
        totalInvalid
    };
};
exports.sendBatchPushByLanguageService = sendBatchPushByLanguageService;
