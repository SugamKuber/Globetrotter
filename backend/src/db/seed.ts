import { Destination } from "../models/Destination";

const destinationData = process.env.NODE_ENV === 'production'
    ? require('../constants/destination.json')
    : require('../constants/test.json');

export const seedDatabase = async () => {
    try {
        for (const data of destinationData) {
            const exists = await Destination.findOne({ city: data.city });
            if (!exists) {
                await new Destination(data).save();
                console.log(`✅ Inserted: ${data.city}`);
            } else {
                console.log(`⚡ Skipped: ${data.city} (Already Exists)`);
            }
        }
        console.log("🌍 Destination data seeding completed.");
    } catch (error) {
        console.error("❌ Error seeding destination data:", error);
    }
};
