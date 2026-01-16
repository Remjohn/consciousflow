// Seed script to recreate weekly groceries
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { config } from 'dotenv';

config();

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

async function seedGroceries() {
    console.log('🛒 Seeding weekly groceries...');

    // Insert master grocery item
    const masterResult = await sql`
        INSERT INTO investments (user_id, title, description, price, priority, category, image_url, is_recurring, recurring_interval, status, created_at, updated_at)
        VALUES (1, '🛒 Liste de courses hebdomadaire', 'Weekly groceries - fruits, vegetables, proteins, dairy', '150', 'HIGH', 'GROCERY', 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400', true, 'WEEKLY', 'PENDING', NOW(), NOW())
        RETURNING id
    `;

    const masterId = masterResult[0].id;
    console.log('Created master item with ID:', masterId);

    // Sub-items: Market items
    const marketItems = [
        { title: '🥚 Œufs entiers', quantity: 42, unit_price: '0.20', description: '6/jour' },
        { title: '🍌 Bananes', quantity: 24, unit_price: '0.15', description: '3-4 kg' },
        { title: '🍌 Plantains', quantity: 14, unit_price: '0.50', description: '2/jour' },
        { title: '🍠 Patates douces', quantity: 4, unit_price: '2.00', description: '3-4 kg différentes couleurs' },
        { title: '🫘 Haricots/Lentilles', quantity: 2, unit_price: '3.00', description: '1.5-2 kg' },
        { title: '🥬 Épinards/Kale', quantity: 2, unit_price: '3.00', description: '2 gros sacs 400-600g' },
        { title: '🧅 Oignons', quantity: 3, unit_price: '0.30', description: '2-3 pièces' },
        { title: '🍄 Champignons', quantity: 1, unit_price: '3.00', description: '200-300g' },
        { title: '🫑 Poivrons', quantity: 2, unit_price: '1.00', description: '2 pièces' },
        { title: '🍋 Citrons', quantity: 7, unit_price: '0.30', description: '1/jour' },
        { title: '🫚 Gingembre frais', quantity: 7, unit_price: '0.50', description: '1/jour' }
    ];

    // Sub-items: Supermarket items
    const supermarketItems = [
        { title: '🐟 Sardines en conserve', quantity: 10, unit_price: '1.50', description: '7-10 boîtes huile olive' },
        { title: '🥛 Lait', quantity: 5, unit_price: '1.50', description: '4-6 L' },
        { title: '🥛 Yaourt grec/Skyr', quantity: 2, unit_price: '4.00', description: '1.5-2 kg' },
        { title: '🍞 Pain complet', quantity: 2, unit_price: '2.50', description: '14-28 tranches' },
        { title: '🥜 Beurre de cacahuète', quantity: 1, unit_price: '4.00', description: '500g pot' },
        { title: '🥜 Cacahuètes', quantity: 1, unit_price: '2.50', description: '200-250g snack' },
        { title: '🌾 Flocons d avoine', quantity: 2, unit_price: '2.00', description: '1.5-2 kg' },
        { title: '🍯 Miel', quantity: 1, unit_price: '5.00', description: '500g pot' },
        { title: '🫒 Huile d olive', quantity: 1, unit_price: '6.00', description: '500 ml' },
        { title: '🍫 Cacao en poudre', quantity: 1, unit_price: '3.00', description: 'non sucré' },
        { title: '🌿 Cannelle', quantity: 1, unit_price: '2.00', description: 'petit pot' },
        { title: '🧀 Fromage', quantity: 1, unit_price: '3.00', description: '200-300g optionnel' },
        { title: '🐟 Fish sticks', quantity: 35, unit_price: '0.30', description: '5/jour x 7 jours' }
    ];

    const allItems = [...marketItems, ...supermarketItems];

    for (const item of allItems) {
        const price = (item.quantity * parseFloat(item.unit_price)).toFixed(2);
        await sql`
            INSERT INTO investments (user_id, title, description, price, priority, category, parent_id, quantity, unit_price, status, created_at, updated_at)
            VALUES (1, ${item.title}, ${item.description}, ${price}, 'MEDIUM', 'GROCERY', ${masterId}, ${item.quantity}, ${item.unit_price}, 'PENDING', NOW(), NOW())
        `;
        console.log('  ✓', item.title);
    }

    console.log('✅ Done! Created', allItems.length, 'sub-items under master ID', masterId);
}

seedGroceries().catch(console.error);
