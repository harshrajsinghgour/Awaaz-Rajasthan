"use strict";

const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGO_URI;

        if (!mongoURI) {
            throw new Error(
                "MONGO_URI .env file में सेट नहीं है।"
            );
        }

        const conn = await mongoose.connect(mongoURI);

        console.log(
            `✅ MongoDB Connected: ${conn.connection.host}`
        );

        mongoose.connection.on("error", (error) => {
            console.error(
                "❌ MongoDB Error:",
                error.message
            );
        });

        mongoose.connection.on("disconnected", () => {
            console.warn(
                "⚠️ MongoDB disconnected."
            );
        });

        mongoose.connection.on("reconnected", () => {
            console.log(
                "🔄 MongoDB reconnected."
            );
        });

    } catch (error) {
        console.error(
            "❌ MongoDB Connection Failed:",
            error.message
        );

        process.exit(1);
    }
};

module.exports = connectDB;
