"use strict";
require("dotenv").config();
const { FcmDeviceModel } = require("../models");
const crypto = require("crypto");
// We also need the sequelize instance for sync if it hasn't run
const { sequelize } = require("../config/sequelize.config");

const generateRandomMobile = () => {
    // Starting from 6, 7, 8, 9 as requested for indian mobiles
    const startDigits = ['6', '7', '8', '9'];
    let num = startDigits[Math.floor(Math.random() * startDigits.length)];
    for (let i = 0; i < 9; i++) {
        num += Math.floor(Math.random() * 10).toString();
    }
    return num;
};

const generateRandomToken = () => {
    return "fcm_dummy_" + crypto.randomBytes(32).toString('hex');
};

// 5 languages as requested
const languages = ["Hindi", "English", "Tamil", "Telugu", "Marathi"];

// Random application name
const apps = ["ChatAppPro", "MessagerPlatform", "SuperChat", "CommunicateV2"];

const seedFcmDevices = async () => {
    try {
        console.log("Connecting and syncing database table...");
        await sequelize.authenticate();
        await FcmDeviceModel.sync({ alter: true }); // ensure table exists
        
        console.log("Starting to seed 1,00,000 FCM devices... This will take a moment.");
        
        // Let's clear the old ones if we run this script multiple times
        await FcmDeviceModel.destroy({ where: {}, truncate: true });
        
        // We do it in chunks of 5000 so Node.js doesn't run out of memory
        const BATCH_SIZE = 5000;
        const TOTAL_RECORDS = 100000;

        for (let i = 0; i < TOTAL_RECORDS; i += BATCH_SIZE) {
            const batch = [];
            for (let j = 0; j < BATCH_SIZE; j++) {
                batch.push({
                    mobileNumber: generateRandomMobile(),
                    fcmToken: generateRandomToken(),
                    applicationName: apps[Math.floor(Math.random() * apps.length)],
                    language: languages[Math.floor(Math.random() * languages.length)],
                });
            }
            
            await FcmDeviceModel.bulkCreate(batch);
            console.log(`✅ Inserted batch: ${i + BATCH_SIZE} / ${TOTAL_RECORDS} rows`);
        }
        
        console.log("🚀 Successfully seeded exactly 1 Lakh (100,000) records!");
        process.exit(0);
    } catch (error) {
        console.error("❌ Failed to seed:", error);
        process.exit(1);
    }
};

seedFcmDevices();
