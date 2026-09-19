const fs = require('fs');
const path = require('path');

const categories = [
  { id: 'cat-1', name: 'Sparklers', slug: 'sparklers', display_order: 1 },
  { id: 'cat-2', name: 'Flower Pots', slug: 'flower-pots', display_order: 2 },
  { id: 'cat-3', name: 'Chakkars', slug: 'chakkars', display_order: 3 },
  { id: 'cat-4', name: 'Twinkling Star', slug: 'twinkling-star', display_order: 4 },
  { id: 'cat-5', name: 'Toys', slug: 'toys', display_order: 5 },
  { id: 'cat-6', name: 'Bombs', slug: 'bombs', display_order: 6 },
  { id: 'cat-7', name: 'One Sound Crackers', slug: 'one-sound-crackers', display_order: 7 },
  { id: 'cat-8', name: 'Sound Party', slug: 'sound-party', display_order: 8 },
  { id: 'cat-9', name: 'Bijili', slug: 'bijili', display_order: 9 },
  { id: 'cat-10', name: 'Rockets', slug: 'rockets', display_order: 10 },
  { id: 'cat-11', name: 'Wala', slug: 'wala', display_order: 11 },
  { id: 'cat-12', name: 'Kids Magic', slug: 'kids-magic', display_order: 12 },
  { id: 'cat-13', name: 'New Arrivals', slug: 'new-arrivals', display_order: 13 },
  { id: 'cat-14', name: 'Match Box', slug: 'match-box', display_order: 14 },
  { id: 'cat-15', name: 'Mini Sky Flying', slug: 'mini-sky-flying', display_order: 15 },
  { id: 'cat-16', name: 'Special Sky Wonders', slug: 'special-sky-wonders', display_order: 16 },
  { id: 'cat-17', name: 'Repeating Shots', slug: 'repeating-shots', display_order: 17 },
  { id: 'cat-18', name: 'Special Fountains', slug: 'special-fountains', display_order: 18 },
  { id: 'cat-19', name: 'Gift Boxes', slug: 'gift-boxes', display_order: 19 },
];

const rawItems = [
  // 1. SPARKLERS
  { sno: 1, name: '7 CM Electric Sparklers (7 CM கம்பி மத்தாப்பு)', category: 'Sparklers', pack_size: 'Box', original_price: 32, discount_percent: 75, offer_price: 8 },
  { sno: 2, name: '7 CM Colour Sparklers (7 CM கம்பி மத்தாப்பு)', category: 'Sparklers', pack_size: 'Box', original_price: 52, discount_percent: 75, offer_price: 13 },
  { sno: 3, name: '7 CM Green Sparklers (7 cm கிரீன் மத்தாப்பு)', category: 'Sparklers', pack_size: 'Box', original_price: 60, discount_percent: 75, offer_price: 15 },
  { sno: 4, name: '7 CM Red Sparklers (7 cm சிகப்பு கம்பிமத்தாப்பு)', category: 'Sparklers', pack_size: 'Box', original_price: 72, discount_percent: 75, offer_price: 18 },
  { sno: 5, name: '10 CM Electric Sparklers (10 cm எலெக்ட்ரிக் கம்பிமத்தாப்பு)', category: 'Sparklers', pack_size: 'Box', original_price: 72, discount_percent: 75, offer_price: 18 },
  { sno: 6, name: '10 Colour Sparklers (10 cm கலர் கம்பிமத்தாப்பு)', category: 'Sparklers', pack_size: 'Box', original_price: 88, discount_percent: 75, offer_price: 22 },
  { sno: 7, name: '10 CM Green Sparklers (10 cm கிரீன் கம்பிமத்தாப்பு)', category: 'Sparklers', pack_size: 'Box', original_price: 100, discount_percent: 75, offer_price: 25 },
  { sno: 8, name: '10 CM Red Sparklers (10 cm சிகப்பு கம்பிமத்தாப்பு)', category: 'Sparklers', pack_size: 'Box', original_price: 116, discount_percent: 75, offer_price: 29 },
  { sno: 9, name: '15 CM Electric Sparklers (15 cm எலெக்ட்ரிக் கம்பிமத்தாப்பு)', category: 'Sparklers', pack_size: 'Box', original_price: 172, discount_percent: 75, offer_price: 43 },
  { sno: 10, name: '15 CM Colour Sparklers (15 cm கலர் கம்பிமத்தாப்பு)', category: 'Sparklers', pack_size: 'Box', original_price: 192, discount_percent: 75, offer_price: 48 },
  { sno: 11, name: '15 CM Green Sparklers (15 cm கிரீன் கம்பிமத்தாப்பு)', category: 'Sparklers', pack_size: 'Box', original_price: 220, discount_percent: 75, offer_price: 55 },
  { sno: 12, name: '15 CM Star Drops Sparklers', category: 'Sparklers', pack_size: 'Box', original_price: 256, discount_percent: 75, offer_price: 64 },
  { sno: 13, name: '30 CM Star Drops Sparklers (30 cm ஸ்டார் டிராப்)', category: 'Sparklers', pack_size: 'Box', original_price: 256, discount_percent: 75, offer_price: 64 },
  { sno: 14, name: '15 CM Red Sparklers (15 cm சிகப்பு கம்பிமத்தாப்பு)', category: 'Sparklers', pack_size: 'Box', original_price: 248, discount_percent: 75, offer_price: 62 },
  { sno: 15, name: '30 CM Electric Sparklers (5 Pcs)', category: 'Sparklers', pack_size: 'Box', original_price: 172, discount_percent: 75, offer_price: 43 },
  { sno: 16, name: '30 CM Colour Sparklers (5 Pcs)', category: 'Sparklers', pack_size: 'Box', original_price: 192, discount_percent: 75, offer_price: 48 },
  { sno: 17, name: '30 CM Green Sparklers (5 Pcs)', category: 'Sparklers', pack_size: 'Box', original_price: 220, discount_percent: 75, offer_price: 55 },
  { sno: 18, name: '30 CM Red Sparklers (5 Pcs)', category: 'Sparklers', pack_size: 'Box', original_price: 248, discount_percent: 75, offer_price: 62 },
  { sno: 19, name: '15 CM Multi Colour Sparklers (10 Pcs)', category: 'Sparklers', pack_size: 'Box', original_price: 256, discount_percent: 75, offer_price: 64 },
  { sno: 20, name: '30 Multi Colour Sparklers (5 Pcs)', category: 'Sparklers', pack_size: 'Box', original_price: 256, discount_percent: 75, offer_price: 64 },
  { sno: 21, name: '50 CM Electric Sparklers (5 Pcs)', category: 'Sparklers', pack_size: 'Box', original_price: 704, discount_percent: 75, offer_price: 176 },
  { sno: 22, name: '50 CM Colour Sparklers (5 Pcs)', category: 'Sparklers', pack_size: 'Box', original_price: 816, discount_percent: 75, offer_price: 204 },
  { sno: 23, name: '50 CM Multicolour Sparklers (5 Pcs)', category: 'Sparklers', pack_size: 'Box', original_price: 924, discount_percent: 75, offer_price: 231 },
  { sno: 24, name: 'Rotating Sparklers (1 Pc)', category: 'Sparklers', pack_size: 'Box', original_price: 840, discount_percent: 75, offer_price: 210 },

  // 2. FLOWER POTS (10 PCS)
  { sno: 26, name: 'Flower Pots Big (ஃபிளவர் பாட்ஸ் பிக்)', category: 'Flower Pots', pack_size: 'Box (10 Pcs)', original_price: 320, discount_percent: 75, offer_price: 80 },
  { sno: 27, name: 'Flower Pots Special (ஃபிளவர் பாட்ஸ் ஸ்பெஷல்)', category: 'Flower Pots', pack_size: 'Box (10 Pcs)', original_price: 396, discount_percent: 75, offer_price: 99 },
  { sno: 30, name: 'Colour Koti (கலர் கோட்டி)', category: 'Flower Pots', pack_size: 'Box (10 Pcs)', original_price: 892, discount_percent: 75, offer_price: 223 },
  { sno: 31, name: 'Gypsy (5 Pcs) (ஜிப்ஸி)', category: 'Flower Pots', pack_size: 'Box (5 Pcs)', original_price: 752, discount_percent: 75, offer_price: 188 },
  { sno: 32, name: 'Colour Koti Special - Pot Girl', category: 'Flower Pots', pack_size: 'Box', original_price: 1180, discount_percent: 75, offer_price: 295 },

  // 3. CHAKKARS
  { sno: 33, name: 'Ground Chakkar Big (தரை சக்கரம் பெரியது)', category: 'Chakkars', pack_size: 'Box (10 Pcs)', original_price: 160, discount_percent: 75, offer_price: 40 },
  { sno: 34, name: 'Ground Chakkar Special (தரை சக்கரம் ஸ்பெஷல்)', category: 'Chakkars', pack_size: 'Box (10 Pcs)', original_price: 456, discount_percent: 75, offer_price: 114 },
  { sno: 35, name: 'Ground Chakkar Ashoka (10 Pcs)', category: 'Chakkars', pack_size: 'Box (10 Pcs)', original_price: 336, discount_percent: 75, offer_price: 84 },
  { sno: 36, name: 'Ground Chakkar Deluxe', category: 'Chakkars', pack_size: 'Box', original_price: 760, discount_percent: 75, offer_price: 190 },
  { sno: 37, name: 'Cute Prime (10 Pcs) (கியூட் பிரைம்)', category: 'Chakkars', pack_size: 'Box (10 Pcs)', original_price: 792, discount_percent: 75, offer_price: 198 },
  { sno: 38, name: 'Disco Wheel (5 Pcs) (டிஸ்கோ வீல்)', category: 'Chakkars', pack_size: 'Box (5 Pcs)', original_price: 248, discount_percent: 75, offer_price: 62 },
  { sno: 39, name: 'Lotus Wheel (5 Pcs) (லோட்டஸ் வீல்)', category: 'Chakkars', pack_size: 'Box (5 Pcs)', original_price: 740, discount_percent: 75, offer_price: 185 },
  { sno: 40, name: 'Classic Wheel (5 Pcs) (கிளாசிக் வீல்)', category: 'Chakkars', pack_size: 'Box (5 Pcs)', original_price: 480, discount_percent: 75, offer_price: 120 },
  { sno: 41, name: 'Zodiac Chakkar (5 Pcs) (ஜோடியக் சக்கர்)', category: 'Chakkars', pack_size: 'Box (5 Pcs)', original_price: 940, discount_percent: 75, offer_price: 235 },
  { sno: 42, name: 'Krishna Chakkar (கிருஷ்ணா சக்கர்)', category: 'Chakkars', pack_size: 'Box', original_price: 860, discount_percent: 75, offer_price: 215 },
  { sno: 43, name: 'Krack Jack Wheel (3 Pcs) (கிராக் ஜாக் வீல்)', category: 'Chakkars', pack_size: 'Box (3 Pcs)', original_price: 1140, discount_percent: 75, offer_price: 285 },
  { sno: 45, name: 'Ring Ring Wheel (ரிங் ரிங் வீல்)', category: 'Chakkars', pack_size: 'Box', original_price: 972, discount_percent: 75, offer_price: 243 },
  { sno: 46, name: 'Whistling Dixie (விசிலிங்க் டிக்ஸ்சீ)', category: 'Chakkars', pack_size: 'Box', original_price: 512, discount_percent: 75, offer_price: 128 },
  { sno: 47, name: 'Recycle Wheel (ரீசைக்கிள் வீல்)', category: 'Chakkars', pack_size: 'Box', original_price: 880, discount_percent: 75, offer_price: 220 },
  { sno: 48, name: '4*4 Wheel (4*4 வீல்)', category: 'Chakkars', pack_size: 'Box', original_price: 648, discount_percent: 75, offer_price: 162 },
  { sno: 49, name: 'Avengers Wheel (அவென்ஜர்ஸ் வீல்)', category: 'Chakkars', pack_size: 'Box', original_price: 584, discount_percent: 75, offer_price: 146 },

  // 4. TWINKLING STAR (10 PCS)
  { sno: 50, name: '1.5" Twinkling Star (1.5 சாட்டை)', category: 'Twinkling Star', pack_size: 'Box (10 Pcs)', original_price: 116, discount_percent: 75, offer_price: 29 },
  { sno: 51, name: '4" Twinkling Star (4" சாட்டை)', category: 'Twinkling Star', pack_size: 'Box (10 Pcs)', original_price: 236, discount_percent: 75, offer_price: 59 },

  // 5. TOYS
  { sno: 52, name: 'Assorted Cartoon (கார்ட்டூன்)', category: 'Toys', pack_size: 'Box', original_price: 96, discount_percent: 75, offer_price: 24 },
  { sno: 53, name: 'Snake Cartoon (பாம்பு கார்ட்டூன்)', category: 'Toys', pack_size: 'Box', original_price: 108, discount_percent: 75, offer_price: 27 },

  // 6. BOMBS (10 PCS)
  { sno: 54, name: 'Ultra Bomb (அல்ட்ரா பாம்)', category: 'Bombs', pack_size: 'Box (10 Pcs)', original_price: 820, discount_percent: 75, offer_price: 205 },
  { sno: 55, name: 'Bullet Bomb (புல்லட் பாம்)', category: 'Bombs', pack_size: 'Box (10 Pcs)', original_price: 140, discount_percent: 75, offer_price: 35 },
  { sno: 56, name: 'Hydro Bomb (ஹைட்ரோ பாம்)', category: 'Bombs', pack_size: 'Box (10 Pcs)', original_price: 388, discount_percent: 75, offer_price: 97 },
  { sno: 57, name: 'Classic Bomb (கிளாசிக் பாம்)', category: 'Bombs', pack_size: 'Box (10 Pcs)', original_price: 490, discount_percent: 75, offer_price: 123 },
  { sno: 58, name: 'Digital Bomb (டிஜிட்டல் பாம்)', category: 'Bombs', pack_size: 'Box (10 Pcs)', original_price: 1120, discount_percent: 75, offer_price: 280 },
  { sno: 59, name: 'King of King Bomb (கிங் ஆஃப் கிங்)', category: 'Bombs', pack_size: 'Box (10 Pcs)', original_price: 416, discount_percent: 75, offer_price: 104 },
  { sno: 60, name: 'Agni Bomb (அக்னி பாம்)', category: 'Bombs', pack_size: 'Box (10 Pcs)', original_price: 840, discount_percent: 75, offer_price: 210 },

  // 7. ONE SOUND CRACKERS (5 PCS / PKT)
  { sno: 61, name: '2.75 Kuruvi Crackers (2.75 குருவி வெடி)', category: 'One Sound Crackers', pack_size: 'Pkt (5 Pcs)', original_price: 24, discount_percent: 75, offer_price: 6 },
  { sno: 62, name: '3.5" Lakshmi Sound Crackers (3.5" லக்ஷ்மி வெடி)', category: 'One Sound Crackers', pack_size: 'Pkt (5 Pcs)', original_price: 40, discount_percent: 75, offer_price: 10 },
  { sno: 63, name: '4" Mickey Mouse Sound Crackers (4" மிக்கி மவுஸ் வெடி)', category: 'One Sound Crackers', pack_size: 'Pkt (5 Pcs)', original_price: 72, discount_percent: 75, offer_price: 18 },
  { sno: 64, name: '4" Lakshmi Deluxe (4" லக்ஷ்மி வெடி)', category: 'One Sound Crackers', pack_size: 'Pkt (5 Pcs)', original_price: 100, discount_percent: 75, offer_price: 25 },
  { sno: 65, name: '5" Jallikattu Crackers (5" ஜல்லிக்கட்டு)', category: 'One Sound Crackers', pack_size: 'Pkt (5 Pcs)', original_price: 220, discount_percent: 75, offer_price: 55 },
  { sno: 66, name: '5" Elephant Special (5" யானை ஸ்பெஷல்)', category: 'One Sound Crackers', pack_size: 'Pkt (5 Pcs)', original_price: 280, discount_percent: 75, offer_price: 70 },
  { sno: 67, name: '6" Lion King One Sound (6" லயன் கிங்)', category: 'One Sound Crackers', pack_size: 'Pkt (5 Pcs)', original_price: 304, discount_percent: 75, offer_price: 76 },
  { sno: 68, name: '6" Jurassic One Sound (6" ஜூராசிக்)', category: 'One Sound Crackers', pack_size: 'Pkt (5 Pcs)', original_price: 304, discount_percent: 75, offer_price: 76 },
  { sno: 69, name: 'Two Sound Crackers (டூ சவுண்டு)', category: 'One Sound Crackers', pack_size: 'Pkt (5 Pcs)', original_price: 152, discount_percent: 75, offer_price: 38 },
  { sno: 70, name: 'Gold Lakshmi Crackers (கோல்டு லக்ஷ்மி)', category: 'One Sound Crackers', pack_size: 'Pkt (5 Pcs)', original_price: 132, discount_percent: 75, offer_price: 33 },

  // 8. SOUND PARTY
  { sno: 71, name: '1/4 KG Adiyal (1/4 KG அடியாள்)', category: 'Sound Party', pack_size: 'Pcs', original_price: 184, discount_percent: 75, offer_price: 46 },
  { sno: 72, name: '1/2 KG Adiyal (1/2 KG அடியாள்)', category: 'Sound Party', pack_size: 'Pcs', original_price: 368, discount_percent: 75, offer_price: 92 },
  { sno: 73, name: '1 KG Adiyal (1 KG அடியாள்)', category: 'Sound Party', pack_size: 'Pcs', original_price: 736, discount_percent: 75, offer_price: 184 },
  { sno: 74, name: 'Avathar (10 Pcs) (அவதார்)', category: 'Sound Party', pack_size: 'Box (10 Pcs)', original_price: 1040, discount_percent: 75, offer_price: 260 },
  { sno: 75, name: 'Colour Paper Bomb (கலர் பேப்பர் பாம்)', category: 'Sound Party', pack_size: 'Pcs', original_price: 240, discount_percent: 75, offer_price: 60 },
  { sno: 76, name: 'Hacker Bomb (10 Pcs) (ஹேக்கர் பாம்)', category: 'Sound Party', pack_size: 'Box (10 Pcs)', original_price: 1500, discount_percent: 75, offer_price: 375 },

  // 9. BIJILI
  { sno: 77, name: 'Red Bijili Crackers (50 Pcs) (ரெட் பிஜிலி)', category: 'Bijili', pack_size: 'Pkt (50 Pcs)', original_price: 68, discount_percent: 75, offer_price: 17 },
  { sno: 78, name: 'Red Bijili Crackers (100 Pcs) (ரெட் பிஜிலி)', category: 'Bijili', pack_size: 'Pkt (100 Pcs)', original_price: 156, discount_percent: 75, offer_price: 39 },
  { sno: 79, name: 'Stripped Bijili (50 Pcs)', category: 'Bijili', pack_size: 'Pkt (50 Pcs)', original_price: 76, discount_percent: 75, offer_price: 19 },
  { sno: 80, name: 'Stripped Bijili Crackers (100 Pcs)', category: 'Bijili', pack_size: 'Pkt (100 Pcs)', original_price: 196, discount_percent: 75, offer_price: 49 },

  // 10. ROCKETS (10 PCS)
  { sno: 81, name: 'Baby Rocket (பேபி ராக்கெட்)', category: 'Rockets', pack_size: 'Box (10 Pcs)', original_price: 136, discount_percent: 75, offer_price: 34 },
  { sno: 82, name: 'Rocket Bomb', category: 'Rockets', pack_size: 'Box (10 Pcs)', original_price: 260, discount_percent: 75, offer_price: 65 },
  { sno: 83, name: 'Lunik Express Rocket', category: 'Rockets', pack_size: 'Box (10 Pcs)', original_price: 504, discount_percent: 75, offer_price: 126 },
  { sno: 84, name: 'Whistling Rocket', category: 'Rockets', pack_size: 'Box (10 Pcs)', original_price: 536, discount_percent: 75, offer_price: 134 },

  // 11. WALA
  { sno: 85, name: '28 Chorsa', category: 'Wala', pack_size: 'Pkt', original_price: 60, discount_percent: 75, offer_price: 15 },
  { sno: 86, name: '100 Wala', category: 'Wala', pack_size: 'Pkt', original_price: 152, discount_percent: 75, offer_price: 38 },
  { sno: 87, name: 'Magic Whip', category: 'Wala', pack_size: 'Box', original_price: 720, discount_percent: 75, offer_price: 180 },
  { sno: 88, name: '90 Watts', category: 'Wala', pack_size: 'Box', original_price: 600, discount_percent: 75, offer_price: 150 },
  { sno: 89, name: 'Shin Chan', category: 'Wala', pack_size: 'Box', original_price: 460, discount_percent: 75, offer_price: 115 },
  { sno: 90, name: '1000 Wala Budget', category: 'Wala', pack_size: 'Box', original_price: 640, discount_percent: 75, offer_price: 160 },
  { sno: 91, name: '1000 Wala Premium', category: 'Wala', pack_size: 'Box', original_price: 1480, discount_percent: 75, offer_price: 370 },
  { sno: 92, name: '2000 Wala Budget', category: 'Wala', pack_size: 'Box', original_price: 1280, discount_percent: 75, offer_price: 320 },
  { sno: 93, name: '2000 Wala Premium', category: 'Wala', pack_size: 'Box', original_price: 2960, discount_percent: 75, offer_price: 740 },
  { sno: 94, name: '5000 Wala Budget', category: 'Wala', pack_size: 'Box', original_price: 3400, discount_percent: 75, offer_price: 850 },
  { sno: 95, name: '5000 Wala Premium', category: 'Wala', pack_size: 'Box', original_price: 7600, discount_percent: 75, offer_price: 1900 },
  { sno: 96, name: '10000 Wala Budget', category: 'Wala', pack_size: 'Box', original_price: 6800, discount_percent: 75, offer_price: 1700 },
  { sno: 97, name: '10000 Wala Premium', category: 'Wala', pack_size: 'Box', original_price: 15200, discount_percent: 75, offer_price: 3800 },

  // 12. KIDS MAGIC
  { sno: 98, name: 'Money Bank', category: 'Kids Magic', pack_size: 'Box', original_price: 560, discount_percent: 75, offer_price: 140 },
  { sno: 99, name: 'Sound Marriage', category: 'Kids Magic', pack_size: 'Box', original_price: 648, discount_percent: 75, offer_price: 162 },
  { sno: 100, name: 'Black Money', category: 'Kids Magic', pack_size: 'Box', original_price: 960, discount_percent: 75, offer_price: 240 },
  { sno: 101, name: 'Money Magic Show Big', category: 'Kids Magic', pack_size: 'Box', original_price: 920, discount_percent: 75, offer_price: 230 },
  { sno: 102, name: 'Fire Egg', category: 'Kids Magic', pack_size: 'Box', original_price: 765, discount_percent: 75, offer_price: 191 },
  { sno: 103, name: 'Emu Egg', category: 'Kids Magic', pack_size: 'Box', original_price: 720, discount_percent: 75, offer_price: 180 },
  { sno: 104, name: 'Oyy Oru Selfi (3 Pcs)', category: 'Kids Magic', pack_size: 'Box (3 Pcs)', original_price: 196, discount_percent: 75, offer_price: 49 },
  { sno: 105, name: 'Snake Tablet 90s Kids', category: 'Kids Magic', pack_size: 'Box', original_price: 120, discount_percent: 75, offer_price: 30 },
  { sno: 106, name: 'Helicopter (5 Pcs)', category: 'Kids Magic', pack_size: 'Box (5 Pcs)', original_price: 316, discount_percent: 75, offer_price: 79 },
  { sno: 107, name: 'Colour Changing Butterfly', category: 'Kids Magic', pack_size: 'Box', original_price: 380, discount_percent: 75, offer_price: 95 },
  { sno: 108, name: 'Spinner (10 Pcs)', category: 'Kids Magic', pack_size: 'Box (10 Pcs)', original_price: 472, discount_percent: 75, offer_price: 118 },
  { sno: 109, name: 'Photo Flash (5 Pcs)', category: 'Kids Magic', pack_size: 'Box (5 Pcs)', original_price: 220, discount_percent: 75, offer_price: 55 },
  { sno: 110, name: 'Colour Smoke', category: 'Kids Magic', pack_size: 'Box', original_price: 460, discount_percent: 75, offer_price: 115 },
  { sno: 111, name: 'Zee Boom Baa (10 Pcs)', category: 'Kids Magic', pack_size: 'Box (10 Pcs)', original_price: 32, discount_percent: 75, offer_price: 8 },
  { sno: 112, name: 'Colour Stone (10 Pcs)', category: 'Kids Magic', pack_size: 'Box (10 Pcs)', original_price: 40, discount_percent: 75, offer_price: 10 },
  { sno: 113, name: 'Spyder', category: 'Kids Magic', pack_size: 'Box', original_price: 648, discount_percent: 75, offer_price: 162 },
  { sno: 114, name: 'Drone', category: 'Kids Magic', pack_size: 'Box', original_price: 680, discount_percent: 75, offer_price: 170 },
  { sno: 115, name: 'Baby Corn', category: 'Kids Magic', pack_size: 'Box', original_price: 832, discount_percent: 75, offer_price: 208 },
  { sno: 116, name: 'Popcorn', category: 'Kids Magic', pack_size: 'Box', original_price: 832, discount_percent: 75, offer_price: 208 },
  { sno: 117, name: 'Pink Panther (Pink Colour) 1 Pc', category: 'Kids Magic', pack_size: 'Box (1 Pc)', original_price: 840, discount_percent: 75, offer_price: 210 },
  { sno: 118, name: 'Lemon Tree Fountain 1 Pc', category: 'Kids Magic', pack_size: 'Box (1 Pc)', original_price: 560, discount_percent: 75, offer_price: 140 },
  { sno: 119, name: 'Lookup (5 Pcs)', category: 'Kids Magic', pack_size: 'Box (5 Pcs)', original_price: 680, discount_percent: 75, offer_price: 170 },
  { sno: 120, name: 'Pops Mix', category: 'Kids Magic', pack_size: 'Box', original_price: 384, discount_percent: 75, offer_price: 96 },
  { sno: 121, name: 'Cylinder Bomb 1 Pc', category: 'Kids Magic', pack_size: 'Box (1 Pc)', original_price: 700, discount_percent: 75, offer_price: 175 },

  // 13. NEW ARRIVALS
  { sno: 125, name: 'Popeye Fountain', category: 'New Arrivals', pack_size: 'Box', original_price: 696, discount_percent: 75, offer_price: 174 },
  { sno: 126, name: 'Dexter Fountain', category: 'New Arrivals', pack_size: 'Box', original_price: 696, discount_percent: 75, offer_price: 174 },
  { sno: 127, name: 'Bus', category: 'New Arrivals', pack_size: 'Box', original_price: 784, discount_percent: 75, offer_price: 196 },
  { sno: 128, name: 'Jelly Bean Candle', category: 'New Arrivals', pack_size: 'Box', original_price: 320, discount_percent: 75, offer_price: 80 },
  { sno: 129, name: 'Pistol Gun 5G', category: 'New Arrivals', pack_size: 'Box', original_price: 888, discount_percent: 75, offer_price: 222 },
  { sno: 130, name: 'Pistol Gun Small (5 Pcs)', category: 'New Arrivals', pack_size: 'Box (5 Pcs)', original_price: 848, discount_percent: 75, offer_price: 212 },
  { sno: 131, name: 'Dora Singer', category: 'New Arrivals', pack_size: 'Box', original_price: 576, discount_percent: 75, offer_price: 144 },
  { sno: 132, name: 'Paw Patrol Fountain (5 Pcs)', category: 'New Arrivals', pack_size: 'Box (5 Pcs)', original_price: 512, discount_percent: 75, offer_price: 128 },
  { sno: 134, name: 'Thor (Hammer)', category: 'New Arrivals', pack_size: 'Box', original_price: 760, discount_percent: 75, offer_price: 190 },

  // 14. MATCH BOX
  { sno: 135, name: 'Seven Up Match Box', category: 'Match Box', pack_size: 'Box', original_price: 780, discount_percent: 75, offer_price: 195 },
  { sno: 136, name: 'Super Deluxe Match Box', category: 'Match Box', pack_size: 'Box', original_price: 360, discount_percent: 75, offer_price: 90 },
  { sno: 137, name: 'VIP Match Box', category: 'Match Box', pack_size: 'Box', original_price: 1040, discount_percent: 75, offer_price: 260 },

  // 15. MINI SKY FLYING
  { sno: 138, name: 'Chotta Fancy', category: 'Mini Sky Flying', pack_size: 'Box', original_price: 192, discount_percent: 75, offer_price: 48 },
  { sno: 139, name: 'Yoga Chotta', category: 'Mini Sky Flying', pack_size: 'Box', original_price: 760, discount_percent: 75, offer_price: 190 },
  { sno: 140, name: 'Seven Shot (One Time)', category: 'Mini Sky Flying', pack_size: 'Box', original_price: 392, discount_percent: 75, offer_price: 98 },
  { sno: 141, name: 'Sky Shot', category: 'Mini Sky Flying', pack_size: 'Box', original_price: 292, discount_percent: 75, offer_price: 73 },
  { sno: 141.1, name: 'Astro Boy (5 Nos)', category: 'Mini Sky Flying', pack_size: 'Box (5 Pcs)', original_price: 600, discount_percent: 75, offer_price: 150 },
  { sno: 142, name: 'Natiya Chotta', category: 'Mini Sky Flying', pack_size: 'Box', original_price: 760, discount_percent: 75, offer_price: 190 },
  { sno: 143, name: 'Mantra Chotta', category: 'Mini Sky Flying', pack_size: 'Box', original_price: 760, discount_percent: 75, offer_price: 190 },

  // 16. SPECIAL SKY WONDERS
  { sno: 144, name: '2" Pipe 3 Pcs Window Series', category: 'Special Sky Wonders', pack_size: 'Box (3 Pcs)', original_price: 1440, discount_percent: 75, offer_price: 360 },
  { sno: 145, name: 'Spanka 4 in 1 Function (3 Pcs)', category: 'Special Sky Wonders', pack_size: 'Box (3 Pcs)', original_price: 2600, discount_percent: 75, offer_price: 650 },
  { sno: 146, name: '2.5" Fancy Pipes', category: 'Special Sky Wonders', pack_size: 'Box', original_price: 560, discount_percent: 75, offer_price: 140 },
  { sno: 147, name: '3.5" Fancy Avengers Series', category: 'Special Sky Wonders', pack_size: 'Box', original_price: 1360, discount_percent: 75, offer_price: 340 },
  { sno: 149, name: '2.5" Pipe Three Step (3 Pcs) Budget', category: 'Special Sky Wonders', pack_size: 'Box (3 Pcs)', original_price: 1520, discount_percent: 75, offer_price: 380 },
  { sno: 150, name: '2.5" Pipe Three Step (3 Pcs) Premium', category: 'Special Sky Wonders', pack_size: 'Box (3 Pcs)', original_price: 2240, discount_percent: 75, offer_price: 560 },
  { sno: 151, name: '3.5" Wedding Series 7 Step', category: 'Special Sky Wonders', pack_size: 'Box', original_price: 1608, discount_percent: 75, offer_price: 402 },
  { sno: 152, name: '3.5" Pipe 2 Pcs (Budget)', category: 'Special Sky Wonders', pack_size: 'Box (2 Pcs)', original_price: 2376, discount_percent: 75, offer_price: 594 },
  { sno: 153, name: 'Nayagara Falls (1 Pc)', category: 'Special Sky Wonders', pack_size: 'Box (1 Pc)', original_price: 1400, discount_percent: 75, offer_price: 350 },
  { sno: 154, name: '4.5" Pipe Niger Spl Edition', category: 'Special Sky Wonders', pack_size: 'Box', original_price: 1800, discount_percent: 75, offer_price: 450 },
  { sno: 155, name: '74 MM Double Ball', category: 'Special Sky Wonders', pack_size: 'Box', original_price: 1700, discount_percent: 75, offer_price: 425 },
  { sno: 156, name: '3.5" Pipe 2 Pcs Premium', category: 'Special Sky Wonders', pack_size: 'Box (2 Pcs)', original_price: 2400, discount_percent: 75, offer_price: 600 },
  { sno: 157, name: '3.5" Pipe Premium', category: 'Special Sky Wonders', pack_size: 'Box', original_price: 1500, discount_percent: 75, offer_price: 375 },
  { sno: 158, name: '4" Pipe Premium', category: 'Special Sky Wonders', pack_size: 'Box', original_price: 1700, discount_percent: 75, offer_price: 425 },
  { sno: 159, name: '4.5" Pipe Special Elite', category: 'Special Sky Wonders', pack_size: 'Box', original_price: 1600, discount_percent: 75, offer_price: 400 },
  { sno: 160, name: '4.5" Pipe 2 Pcs Elite', category: 'Special Sky Wonders', pack_size: 'Box (2 Pcs)', original_price: 4160, discount_percent: 75, offer_price: 1040 },

  // 17. REPEATING SHOTS
  { sno: 161, name: '15 Shots Multicolours', category: 'Repeating Shots', pack_size: 'Box', original_price: 1100, discount_percent: 75, offer_price: 275 },
  { sno: 162, name: '12 Shots Rider', category: 'Repeating Shots', pack_size: 'Box', original_price: 720, discount_percent: 75, offer_price: 180 },
  { sno: 163, name: '30 Shot Multi Colours', category: 'Repeating Shots', pack_size: 'Box', original_price: 1540, discount_percent: 75, offer_price: 385 },
  { sno: 164, name: '60 Shots Multicolours', category: 'Repeating Shots', pack_size: 'Box', original_price: 3080, discount_percent: 75, offer_price: 770 },
  { sno: 165, name: '120 Shots Multicolours', category: 'Repeating Shots', pack_size: 'Box', original_price: 6160, discount_percent: 75, offer_price: 1540 },
  { sno: 166, name: '240 Multi Shots', category: 'Repeating Shots', pack_size: 'Box', original_price: 12320, discount_percent: 75, offer_price: 3080 },
  { sno: 167, name: '12 Shot Red & Green', category: 'Repeating Shots', pack_size: 'Box', original_price: 892, discount_percent: 75, offer_price: 223 },
  { sno: 168, name: '10 Shots Premium', category: 'Repeating Shots', pack_size: 'Box', original_price: 900, discount_percent: 75, offer_price: 225 },
  { sno: 169, name: 'Speed 30 Premium', category: 'Repeating Shots', pack_size: 'Box', original_price: 1900, discount_percent: 75, offer_price: 475 },
  { sno: 170, name: '60 Shots Premium', category: 'Repeating Shots', pack_size: 'Box', original_price: 3800, discount_percent: 75, offer_price: 950 },
  { sno: 171, name: '120 Shots Brand', category: 'Repeating Shots', pack_size: 'Box', original_price: 7200, discount_percent: 75, offer_price: 1800 },
  { sno: 172, name: '240 Multi Shots Premium', category: 'Repeating Shots', pack_size: 'Box', original_price: 18880, discount_percent: 75, offer_price: 4720 },
  { sno: 173, name: 'Volcano 30 Crackling With Colour', category: 'Repeating Shots', pack_size: 'Box', original_price: 2560, discount_percent: 75, offer_price: 640 },
  { sno: 174, name: 'Art of India Setout (20 Shots)', category: 'Repeating Shots', pack_size: 'Box', original_price: 14000, discount_percent: 75, offer_price: 3500 },
  { sno: 175, name: 'Rang Chakkar Wheel Function (10 Shots)', category: 'Repeating Shots', pack_size: 'Box', original_price: 1396, discount_percent: 75, offer_price: 349 },
  { sno: 176, name: '12 + 12 Shots', category: 'Repeating Shots', pack_size: 'Box', original_price: 880, discount_percent: 75, offer_price: 220 },
  { sno: 177, name: 'Caribbean Night 10*10 Shots', category: 'Repeating Shots', pack_size: 'Box', original_price: 15000, discount_percent: 75, offer_price: 3750 },
  { sno: 178, name: 'Cocktail Setout (40 Shots)', category: 'Repeating Shots', pack_size: 'Box', original_price: 11900, discount_percent: 75, offer_price: 2975 },
  { sno: 179, name: 'Whistle Ready 49 Shots', category: 'Repeating Shots', pack_size: 'Box', original_price: 752, discount_percent: 75, offer_price: 188 },
  { sno: 179.1, name: 'Whizzling 25 Shots', category: 'Repeating Shots', pack_size: 'Box', original_price: 4500, discount_percent: 75, offer_price: 1125 },

  // 18. SPECIAL FOUNTAINS
  { sno: 180, name: 'Peacock Feather', category: 'Special Fountains', pack_size: 'Box', original_price: 544, discount_percent: 75, offer_price: 136 },
  { sno: 181, name: 'Asrafi Gold', category: 'Special Fountains', pack_size: 'Box', original_price: 520, discount_percent: 75, offer_price: 130 },
  { sno: 182, name: 'Snow Fountain', category: 'Special Fountains', pack_size: 'Box', original_price: 600, discount_percent: 75, offer_price: 150 },
  { sno: 183, name: 'Fusion Fountain', category: 'Special Fountains', pack_size: 'Box', original_price: 600, discount_percent: 75, offer_price: 150 },
  { sno: 184, name: 'Tri Colour Premium', category: 'Special Fountains', pack_size: 'Box', original_price: 1100, discount_percent: 75, offer_price: 275 },
  { sno: 185, name: 'Bad Boy', category: 'Special Fountains', pack_size: 'Box', original_price: 1735, discount_percent: 75, offer_price: 434 },
  { sno: 186, name: 'Autumn Rain (1 Pc)', category: 'Special Fountains', pack_size: 'Tin (1 Pc)', original_price: 640, discount_percent: 75, offer_price: 160 },
  { sno: 187, name: 'Winter Rain (1 Pc)', category: 'Special Fountains', pack_size: 'Tin (1 Pc)', original_price: 640, discount_percent: 75, offer_price: 160 },
  { sno: 188, name: 'Festival Celebration Fountain (3 Pcs)', category: 'Special Fountains', pack_size: 'Box (3 Pcs)', original_price: 1400, discount_percent: 75, offer_price: 350 },
  { sno: 189, name: 'Tricolour Fountain (Budget)', category: 'Special Fountains', pack_size: 'Box', original_price: 780, discount_percent: 75, offer_price: 195 },
  { sno: 190, name: '2 Pcs Fountain 6 Variety', category: 'Special Fountains', pack_size: 'Box (2 Pcs)', original_price: 784, discount_percent: 75, offer_price: 196 },
  { sno: 191, name: 'Crash Shower (5 Pcs)', category: 'Special Fountains', pack_size: 'Box (5 Pcs)', original_price: 264, discount_percent: 75, offer_price: 66 },
  { sno: 192, name: 'Tin Fountain (1 Pc)', category: 'Special Fountains', pack_size: 'Box (1 Pc)', original_price: 276, discount_percent: 75, offer_price: 69 },
  { sno: 193, name: 'Karaoke Night (1 Pc)', category: 'Special Fountains', pack_size: 'Box (1 Pc)', original_price: 600, discount_percent: 75, offer_price: 150 },
  { sno: 194, name: 'Jazz Music (1 Pc)', category: 'Special Fountains', pack_size: 'Box (1 Pc)', original_price: 600, discount_percent: 75, offer_price: 150 },
  { sno: 195, name: 'Dr.Pepper (1 Pc)', category: 'Special Fountains', pack_size: 'Box (1 Pc)', original_price: 600, discount_percent: 75, offer_price: 150 },
  { sno: 196, name: 'Big Bang (1 Pc)', category: 'Special Fountains', pack_size: 'Box (1 Pc)', original_price: 600, discount_percent: 75, offer_price: 150 },
  { sno: 197, name: 'Red Apple (5 Pcs)', category: 'Special Fountains', pack_size: 'Box (5 Pcs)', original_price: 784, discount_percent: 75, offer_price: 196 },
  { sno: 198, name: 'Carnival Funfair (5 Pcs)', category: 'Special Fountains', pack_size: 'Box (5 Pcs)', original_price: 784, discount_percent: 75, offer_price: 196 },
  { sno: 199, name: 'Mr.Big (5 Pcs)', category: 'Special Fountains', pack_size: 'Box (5 Pcs)', original_price: 784, discount_percent: 75, offer_price: 196 },
  { sno: 200, name: 'Tooty Frooty (5 Pcs)', category: 'Special Fountains', pack_size: 'Box (5 Pcs)', original_price: 784, discount_percent: 75, offer_price: 196 },
  { sno: 201, name: 'Bingo Music (5 Pcs)', category: 'Special Fountains', pack_size: 'Box (5 Pcs)', original_price: 784, discount_percent: 75, offer_price: 196 },
  { sno: 202, name: 'Bubbles Multi Colour (5 Pcs)', category: 'Special Fountains', pack_size: 'Box (5 Pcs)', original_price: 856, discount_percent: 75, offer_price: 214 },
  { sno: 203, name: 'Water Queen', category: 'Special Fountains', pack_size: 'Box', original_price: 816, discount_percent: 75, offer_price: 204 },
  { sno: 204, name: 'Madurai Malli', category: 'Special Fountains', pack_size: 'Box', original_price: 840, discount_percent: 75, offer_price: 210 },
  { sno: 205, name: 'Magic Gold (5 Pcs)', category: 'Special Fountains', pack_size: 'Box (5 Pcs)', original_price: 472, discount_percent: 75, offer_price: 118 },
  { sno: 206, name: 'Bada Peacock Starvell Brand', category: 'Special Fountains', pack_size: 'Box', original_price: 1296, discount_percent: 75, offer_price: 324 },
  { sno: 207, name: 'Bada Pink Peacock', category: 'Special Fountains', pack_size: 'Box', original_price: 1760, discount_percent: 75, offer_price: 440 },
  { sno: 208, name: 'Golden Peacock', category: 'Special Fountains', pack_size: 'Box', original_price: 880, discount_percent: 75, offer_price: 220 },
  { sno: 209, name: 'Crackling Peacock', category: 'Special Fountains', pack_size: 'Box', original_price: 880, discount_percent: 75, offer_price: 220 },
  { sno: 210, name: 'Red & Green Peacock', category: 'Special Fountains', pack_size: 'Box', original_price: 880, discount_percent: 75, offer_price: 220 },
  { sno: 211, name: 'Magic Feather Peacock Success', category: 'Special Fountains', pack_size: 'Box', original_price: 456, discount_percent: 75, offer_price: 114 },
  { sno: 212, name: 'Peacock 3 Face Thirumala', category: 'Special Fountains', pack_size: 'Box', original_price: 696, discount_percent: 75, offer_price: 174 },

  // 19. GIFT BOXES (Combo packs)
  { sno: 213, name: '25 Items Special Gift Box', category: 'Gift Boxes', pack_size: 'Box (25 Items)', original_price: 760, discount_percent: 50, offer_price: 380 },
  { sno: 214, name: '30 Items Kutty Japan Gift Box', category: 'Gift Boxes', pack_size: 'Box (30 Items)', original_price: 900, discount_percent: 50, offer_price: 450 },
  { sno: 215, name: '35 Items Indian Soldiers Gift Box', category: 'Gift Boxes', pack_size: 'Box (35 Items)', original_price: 1200, discount_percent: 50, offer_price: 600 },
  { sno: 216, name: '40 Items Miracle Gift Box', category: 'Gift Boxes', pack_size: 'Box (40 Items)', original_price: 1480, discount_percent: 50, offer_price: 740 },
  { sno: 217, name: '50 Items Ravanan (Best Packing Award)', category: 'Gift Boxes', pack_size: 'Box (50 Items)', original_price: 1950, discount_percent: 50, offer_price: 975 },
  { sno: 1001, name: '3000 Mega Diwali Combo Pack', category: 'Gift Boxes', pack_size: 'Combo Box', original_price: 5999, discount_percent: 50, offer_price: 2999 },
  { sno: 1002, name: '5000 Royal Family Combo Pack', category: 'Gift Boxes', pack_size: 'Combo Box', original_price: 9999, discount_percent: 50, offer_price: 4999 },
  { sno: 1003, name: '7500 Grand Celebrations Combo Pack', category: 'Gift Boxes', pack_size: 'Combo Box', original_price: 14999, discount_percent: 50, offer_price: 7499 },
  { sno: 1004, name: 'Thala Diwali Ultra VIP Combo Pack', category: 'Gift Boxes', pack_size: 'Mega Box', original_price: 19999, discount_percent: 50, offer_price: 9999 },
];

const products = rawItems.map((item, index) => ({
  id: `prod-${item.sno || index + 1}`,
  name: item.name,
  category: item.category,
  pack_size: item.pack_size,
  original_price: item.original_price,
  discount_percent: item.discount_percent || 75,
  offer_price: item.offer_price,
  description: `Genuine Sivakasi fireworks item. Packing: ${item.pack_size}. Safe & vibrant celebrations.`,
  image_url: '',
  in_stock: true,
  created_at: new Date().toISOString()
}));

const storePath = path.join(__dirname, 'server', 'data', 'store.json');
let currentStore = {};
try {
  currentStore = JSON.parse(fs.readFileSync(storePath, 'utf8'));
} catch (e) {
  currentStore = {};
}

currentStore.categories = categories;
currentStore.products = products;
currentStore.payment_details = {
  gpay_phonepe: '6380115587',
  upi_id: '6380115587@upi'
};

fs.writeFileSync(storePath, JSON.stringify(currentStore, null, 2), 'utf8');
console.log(`Successfully populated ${products.length} cracker products and ${categories.length} categories into store.json!`);
