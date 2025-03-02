import { Destination } from "../models/Destination";

const destinationData = process.env.NODE_ENV === 'production'
    ? require('../constants/destination.json')
    : require('../constants/test.json');

const citySize = process.env.NODE_ENV === 'production' && process.env.QUIZ_SIZE
    ? parseInt(process.env.QUIZ_SIZE, 4)
    : destinationData.length;

export const seedDatabase = async () => {
    try {
        const limitedData = destinationData.slice(0, citySize);
        for (const data of limitedData) {
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
