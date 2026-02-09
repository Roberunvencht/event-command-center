import mongoose from 'mongoose';
import EventModel from '../models/event.model';

const seedEvents = async () => {
    try {
        console.log('--- Starting Event Seeding ---');

        // 1. Optional: Clear existing data to avoid duplicates
        // await EventModel.deleteMany({});
        // console.log('Cleared existing events.');

        const evxistingEents = await EventModel.find();
        if (evxistingEents.length) return;

        // 2. Define Sample Data
        const events = [
            {
                name: 'Manila City Run 2026',
                description: 'A scenic marathon through the heart of Manila.',
                status: 'upcoming',
                date: new Date('2026-05-20'),
                startTime: '04:00 AM',
                endTime: '11:00 AM',
                location: {
                    venue: 'Rizal Park',
                    city: 'Manila',
                    province: 'Metro Manila',
                    country: 'Philippines',
                    coordinates: { lat: 14.5826, lng: 120.9787 }
                },
                raceCategories: [
                    {
                        name: '5K Fun Run',
                        distanceKm: 5,
                        cutoffTime: 60,
                        gunStartTime: new Date('2026-05-20T05:30:00'),
                        price: 750,
                        slots: 500,
                        registeredCount: 150
                    },
                    {
                        name: '21K Half Marathon',
                        distanceKm: 21,
                        cutoffTime: 240,
                        gunStartTime: new Date('2026-05-20T04:30:00'),
                        price: 1500,
                        slots: 300,
                        registeredCount: 100
                    }
                ],
                registration: {
                    isOpen: true,
                    opensAt: new Date('2026-01-01'),
                    closesAt: new Date('2026-05-01')
                },
                capacity: {
                    totalSlots: 800,
                    registeredCount: 250
                }
            },
            {
                name: 'Cebu Trail Ultra',
                description: 'Challenging mountain trails in Busay.',
                status: 'active',
                date: new Date('2026-03-15'),
                startTime: '03:00 AM',
                endTime: '06:00 PM',
                location: {
                    venue: 'Busay Highlands',
                    city: 'Cebu City',
                    province: 'Cebu',
                    country: 'Philippines',
                    coordinates: { lat: 10.3546, lng: 123.8851 }
                },
                raceCategories: [
                    {
                        name: '50K Ultra',
                        distanceKm: 50,
                        cutoffTime: 720,
                        gunStartTime: new Date('2026-03-15T03:00:00'),
                        price: 3500,
                        slots: 100,
                        registeredCount: 95
                    }
                ],
                registration: {
                    isOpen: false,
                    opensAt: new Date('2025-10-01'),
                    closesAt: new Date('2026-02-15')
                },
                capacity: {
                    totalSlots: 100,
                    registeredCount: 95
                }
            }
        ];

        // 3. Insert into Database
        await EventModel.insertMany(events);
        
        console.log(`Successfully seeded ${events.length} events!`);
        console.log('--- Seeding Complete ---');

    } catch (error) {
        console.error('Error seeding events:', error);
    }
};

export default seedEvents;