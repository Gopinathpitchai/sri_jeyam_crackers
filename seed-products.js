const fs = require('fs');
const path = require('path');

const DISCOUNT_PERCENT = 83;
const MULTIPLIER = (100 - DISCOUNT_PERCENT) / 100; // 0.17

const categories = [
  { id: 'cat-1', name: 'Flash Sound Crackers', slug: 'flash-sound-crackers', display_order: 1 },
  { id: 'cat-2', name: 'Flower Pots', slug: 'flower-pots', display_order: 2 },
  { id: 'cat-3', name: 'Ground Chakkars', slug: 'ground-chakkars', display_order: 3 },
  { id: 'cat-4', name: 'Adiyal Crackers', slug: 'adiyal-crackers', display_order: 4 },
  { id: 'cat-5', name: 'Bombs', slug: 'bombs', display_order: 5 },
  { id: 'cat-6', name: 'Fountains', slug: 'fountains', display_order: 6 },
  { id: 'cat-7', name: 'Kids Special', slug: 'kids-special', display_order: 7 },
  { id: 'cat-8', name: 'Peacock Special', slug: 'peacock-special', display_order: 8 },
  { id: 'cat-9', name: 'Sparklers', slug: 'sparklers', display_order: 9 },
  { id: 'cat-10', name: 'Wala', slug: 'wala', display_order: 10 },
  { id: 'cat-11', name: 'Bijili', slug: 'bijili', display_order: 11 },
  { id: 'cat-12', name: 'Rockets', slug: 'rockets', display_order: 12 },
  { id: 'cat-13', name: 'Fancy Aerial', slug: 'fancy-aerial', display_order: 13 },
  { id: 'cat-14', name: '2 Inch 3 Piece', slug: '2-inch-3-piece', display_order: 14 },
  { id: 'cat-15', name: '3 Inch Fountain', slug: '3-inch-fountain', display_order: 15 },
  { id: 'cat-16', name: '4 Inch Fountain', slug: '4-inch-fountain', display_order: 16 },
  { id: 'cat-17', name: '4 Inch Tin', slug: '4-inch-tin', display_order: 17 },
  { id: 'cat-18', name: 'Multicolour Shots', slug: 'multicolour-shots', display_order: 18 },
  { id: 'cat-19', name: 'Special Aerial Shots', slug: 'special-aerial-shots', display_order: 19 },
  { id: 'cat-20', name: 'Combo Packs', slug: 'combo-packs', display_order: 20 },
  { id: 'cat-21', name: 'Gift Boxes', slug: 'gift-boxes', display_order: 21 },
];

const rawProducts = [
  // FLASH SOUND CRACKERS (1 - 8)
  { code: 1, name: "2 3/4' Kuruvi", category: "Flash Sound Crackers", pack_size: "PKT", original_price: 80, image_url: "" },
  { code: 2, name: "3 1/2' Lakshmi", category: "Flash Sound Crackers", pack_size: "PKT", original_price: 150, image_url: "" },
  { code: 3, name: "4' Lakshmi", category: "Flash Sound Crackers", pack_size: "PKT", original_price: 200, image_url: "" },
  { code: 4, name: "4' Deluxe Lakshmi", category: "Flash Sound Crackers", pack_size: "PKT", original_price: 300, image_url: "" },
  { code: 5, name: "4' Gold Lakshmi", category: "Flash Sound Crackers", pack_size: "PKT", original_price: 370, image_url: "" },
  { code: 6, name: "5' Jallikattu", category: "Flash Sound Crackers", pack_size: "PKT", original_price: 370, image_url: "" },
  { code: 7, name: "2' Sound", category: "Flash Sound Crackers", pack_size: "PKT", original_price: 350, image_url: "" },
  { code: 8, name: "3' Sound", category: "Flash Sound Crackers", pack_size: "PKT", original_price: 370, image_url: "" },

  // FLOWER POTS OF AK (9 - 15)
  { code: 9, name: "Flower Pots Small (10pcs)", category: "Flower Pots", pack_size: "BOX", original_price: 560, image_url: "/images/flower_pots.jpg" },
  { code: 10, name: "Flower Pots Big (10pcs)", category: "Flower Pots", pack_size: "BOX", original_price: 700, image_url: "/images/flower_pots.jpg" },
  { code: 11, name: "Flower Pots Asoka (10pcs)", category: "Flower Pots", pack_size: "BOX", original_price: 1100, image_url: "/images/flower_pots.jpg" },
  { code: 12, name: "Flower Pots Deluxe (5pcs)", category: "Flower Pots", pack_size: "BOX", original_price: 1550, image_url: "/images/flower_pots.jpg" },
  { code: 13, name: "Colour Koti Gold Deluxe (10pcs)", category: "Flower Pots", pack_size: "BOX", original_price: 2250, image_url: "/images/flower_pots.jpg" },
  { code: 14, name: "Flower Pots Super Deluxe (2pcs)", category: "Flower Pots", pack_size: "BOX", original_price: 1050, image_url: "/images/flower_pots.jpg" },
  { code: 15, name: "Mega Lucky Deluxe (10pcs)", category: "Flower Pots", pack_size: "BOX", original_price: 4100, image_url: "/images/flower_pots.jpg" },

  // GROUND CHAKKAR (16 - 20)
  { code: 16, name: "Ground Chakkar Big (10pcs)", category: "Ground Chakkars", pack_size: "BOX", original_price: 450, image_url: "/images/chakkars.jpg" },
  { code: 17, name: "Ground Chakkar Mega Big", category: "Ground Chakkars", pack_size: "BOX", original_price: 7500, image_url: "/images/chakkars.jpg" },
  { code: 18, name: "Ground Chakkar Specials (10Pcs)", category: "Ground Chakkars", pack_size: "BOX", original_price: 770, image_url: "/images/chakkars.jpg" },
  { code: 19, name: "Ground Chakkar Deluxe (10pcs)", category: "Ground Chakkars", pack_size: "BOX", original_price: 1200, image_url: "/images/chakkars.jpg" },
  { code: 20, name: "Ground Chakkar Spinner (10pc)", category: "Ground Chakkars", pack_size: "BOX", original_price: 1100, image_url: "/images/chakkars.jpg" },

  // ADIYAL OF AK (21 - 23)
  { code: 21, name: "1/4 Papper Bomb", category: "Adiyal Crackers", pack_size: "BOX", original_price: 650, image_url: "/images/bombs.jpg" },
  { code: 22, name: "1/2 Papper Bomb", category: "Adiyal Crackers", pack_size: "BOX", original_price: 1300, image_url: "/images/bombs.jpg" },
  { code: 23, name: "1Kg Papper Bomb", category: "Adiyal Crackers", pack_size: "BOX", original_price: 2600, image_url: "/images/bombs.jpg" },

  // BOMB OF AK (24 - 28)
  { code: 24, name: "Hydro Bomb (10pcs)", category: "Bombs", pack_size: "BOX", original_price: 1000, image_url: "/images/bombs.jpg" },
  { code: 25, name: "Titan Bomb (10pcs)", category: "Bombs", pack_size: "BOX", original_price: 2350, image_url: "/images/bombs.jpg" },
  { code: 26, name: "555 Bomb (10pcs)", category: "Bombs", pack_size: "BOX", original_price: 750, image_url: "/images/bombs.jpg" },
  { code: 27, name: "Digital Bomb (10pcs)", category: "Bombs", pack_size: "BOX", original_price: 1900, image_url: "/images/bombs.jpg" },
  { code: 28, name: "Bullet Bomb (10pcs)", category: "Bombs", pack_size: "BOX", original_price: 260, image_url: "/images/bombs.jpg" },

  // FOUNTAIN OF AK (29 - 34)
  { code: 29, name: "Kutralam", category: "Fountains", pack_size: "BOX", original_price: 1000, image_url: "" },
  { code: 30, name: "Silver Jewellery", category: "Fountains", pack_size: "BOX", original_price: 1550, image_url: "" },
  { code: 31, name: "Tri Colour Fountain", category: "Fountains", pack_size: "BOX", original_price: 2000, image_url: "" },
  { code: 32, name: "Mega Magic", category: "Fountains", pack_size: "BOX", original_price: 2250, image_url: "" },
  { code: 33, name: "Siren", category: "Fountains", pack_size: "BOX", original_price: 2250, image_url: "" },
  { code: 34, name: "Singing Pop", category: "Fountains", pack_size: "BOX", original_price: 950, image_url: "" },

  // KIDS SPECIAL OF AK (35 - 57)
  { code: 35, name: "Drone", category: "Kids Special", pack_size: "BOX", original_price: 1350, image_url: "" },
  { code: 36, name: "4X4 Wheel", category: "Kids Special", pack_size: "BOX", original_price: 1400, image_url: "" },
  { code: 37, name: "Kulfi", category: "Kids Special", pack_size: "BOX", original_price: 1200, image_url: "" },
  { code: 38, name: "Bat and Ball", category: "Kids Special", pack_size: "BOX", original_price: 1850, image_url: "" },
  { code: 39, name: "Cylinder", category: "Kids Special", pack_size: "BOX", original_price: 3200, image_url: "" },
  { code: 40, name: "Kng Fu Panda", category: "Kids Special", pack_size: "BOX", original_price: 1400, image_url: "" },
  { code: 41, name: "Bambaram", category: "Kids Special", pack_size: "BOX", original_price: 1000, image_url: "" },
  { code: 42, name: "Helicopter", category: "Kids Special", pack_size: "BOX", original_price: 1050, image_url: "" },
  { code: 43, name: "Buttery Fly", category: "Kids Special", pack_size: "BOX", original_price: 1000, image_url: "" },
  { code: 44, name: "Moving Car", category: "Kids Special", pack_size: "BOX", original_price: 1600, image_url: "" },
  { code: 45, name: "Ostrich Egg", category: "Kids Special", pack_size: "BOX", original_price: 1600, image_url: "" },
  { code: 46, name: "Kinder Joy", category: "Kids Special", pack_size: "BOX", original_price: 1800, image_url: "" },
  { code: 47, name: "Water Queen", category: "Kids Special", pack_size: "BOX", original_price: 1300, image_url: "" },
  { code: 48, name: "Holi Bingo", category: "Kids Special", pack_size: "BOX", original_price: 1600, image_url: "" },
  { code: 49, name: "Holi Colour", category: "Kids Special", pack_size: "BOX", original_price: 1600, image_url: "" },
  { code: 50, name: "Snow Flakes", category: "Kids Special", pack_size: "BOX", original_price: 2200, image_url: "" },
  { code: 51, name: "Kitkat", category: "Kids Special", pack_size: "BOX", original_price: 450, image_url: "" },
  { code: 52, name: "Mottu Bottulu", category: "Kids Special", pack_size: "BOX", original_price: 900, image_url: "" },
  { code: 53, name: "Hand Shower", category: "Kids Special", pack_size: "BOX", original_price: 1800, image_url: "" },
  { code: 54, name: "Money Bank", category: "Kids Special", pack_size: "BOX", original_price: 1000, image_url: "" },
  { code: 55, name: "Selfie Stick", category: "Kids Special", pack_size: "BOX", original_price: 1600, image_url: "" },
  { code: 56, name: "Colour Smoke", category: "Kids Special", pack_size: "BOX", original_price: 1500, image_url: "" },
  { code: 57, name: "Photo Flash", category: "Kids Special", pack_size: "BOX", original_price: 1500, image_url: "" },

  // PEACOCK (58 - 61)
  { code: 58, name: "Peacock Colour", category: "Peacock Special", pack_size: "BOX", original_price: 1300, image_url: "" },
  { code: 59, name: "Peacock Magic", category: "Peacock Special", pack_size: "BOX", original_price: 1300, image_url: "" },
  { code: 60, name: "Peacock Colour Magic", category: "Peacock Special", pack_size: "BOX", original_price: 1450, image_url: "" },
  { code: 61, name: "Peacock Bada", category: "Peacock Special", pack_size: "BOX", original_price: 2000, image_url: "" },

  // SPARKLERS OF AK (62 - 80)
  { code: 62, name: "7CM Electric Sparklers", category: "Sparklers", pack_size: "BOX", original_price: 80, image_url: "/images/sparklers.jpg" },
  { code: 63, name: "7CM Colour Sparklers", category: "Sparklers", pack_size: "BOX", original_price: 100, image_url: "/images/sparklers.jpg" },
  { code: 64, name: "7CM Grassy Sparklers", category: "Sparklers", pack_size: "BOX", original_price: 110, image_url: "/images/sparklers.jpg" },
  { code: 65, name: "7CM Red Sparklers", category: "Sparklers", pack_size: "BOX", original_price: 110, image_url: "/images/sparklers.jpg" },
  { code: 66, name: "10CM Colour Sparklers", category: "Sparklers", pack_size: "BOX", original_price: 200, image_url: "/images/sparklers.jpg" },
  { code: 67, name: "10CM Grassy Sparklers", category: "Sparklers", pack_size: "BOX", original_price: 220, image_url: "/images/sparklers.jpg" },
  { code: 68, name: "10CM Red Sparklers", category: "Sparklers", pack_size: "BOX", original_price: 220, image_url: "/images/sparklers.jpg" },
  { code: 69, name: "15CM Color Sparklers", category: "Sparklers", pack_size: "BOX", original_price: 460, image_url: "/images/sparklers.jpg" },
  { code: 70, name: "15CM Red Sparklers", category: "Sparklers", pack_size: "BOX", original_price: 480, image_url: "/images/sparklers.jpg" },
  { code: 71, name: "30CM Electric Sparklers", category: "Sparklers", pack_size: "BOX", original_price: 480, image_url: "/images/sparklers.jpg" },
  { code: 72, name: "30CM Colour Sparklers", category: "Sparklers", pack_size: "BOX", original_price: 500, image_url: "/images/sparklers.jpg" },
  { code: 73, name: "30CM Grassy Sparklers", category: "Sparklers", pack_size: "BOX", original_price: 540, image_url: "/images/sparklers.jpg" },
  { code: 74, name: "30CM Red Sparklers", category: "Sparklers", pack_size: "BOX", original_price: 540, image_url: "/images/sparklers.jpg" },
  { code: 75, name: "50CM Electric Sparklers", category: "Sparklers", pack_size: "BOX", original_price: 1500, image_url: "/images/sparklers.jpg" },
  { code: 76, name: "50CM Colour Sparklers", category: "Sparklers", pack_size: "BOX", original_price: 1700, image_url: "/images/sparklers.jpg" },
  { code: 77, name: "50CM Grassy Sparklers", category: "Sparklers", pack_size: "BOX", original_price: 1700, image_url: "/images/sparklers.jpg" },
  { code: 78, name: "70CM Electric Sparklers", category: "Sparklers", pack_size: "BOX", original_price: 1900, image_url: "/images/sparklers.jpg" },
  { code: 79, name: "70CM Colour Sparklers", category: "Sparklers", pack_size: "BOX", original_price: 2000, image_url: "/images/sparklers.jpg" },
  { code: 80, name: "Dancing Umbrella", category: "Sparklers", pack_size: "BOX", original_price: 2300, image_url: "" },

  // WALA SPECIAL OF AK (81 - 85)
  { code: 81, name: "100 Wala (Full count)", category: "Wala", pack_size: "BOX", original_price: 950, image_url: "" },
  { code: 82, name: "1000 Wala (Full count)", category: "Wala", pack_size: "BOX", original_price: 2700, image_url: "" },
  { code: 83, name: "2000 Wala (Full count)", category: "Wala", pack_size: "BOX", original_price: 5400, image_url: "" },
  { code: 84, name: "5000 Wala (Full count)", category: "Wala", pack_size: "BOX", original_price: 17000, image_url: "" },
  { code: 85, name: "10,000 Wala (Full count)", category: "Wala", pack_size: "BOX", original_price: 32000, image_url: "" },

  // BIJILI OF AK (86 - 87)
  { code: 86, name: "Gold Bijili (50 pcs)", category: "Bijili", pack_size: "1 PKT", original_price: 140, image_url: "" },
  { code: 87, name: "Gold Bijili (100 pcs)", category: "Bijili", pack_size: "1 PKT", original_price: 220, image_url: "" },

  // ROCKET OF AIK (88 - 89)
  { code: 88, name: "Rocket Bomb", category: "Rockets", pack_size: "BOX", original_price: 1000, image_url: "/images/rockets.jpg" },
  { code: 89, name: "Whistling Rocket", category: "Rockets", pack_size: "BOX", original_price: 1500, image_url: "/images/rockets.jpg" },

  // FANCY OF AIK (90 - 92)
  { code: 90, name: "Chotta Fancy", category: "Fancy Aerial", pack_size: "BOX", original_price: 600, image_url: "" },
  { code: 91, name: "3 Piece Fancy", category: "Fancy Aerial", pack_size: "BOX", original_price: 2200, image_url: "" },
  { code: 92, name: "Sunny Guys", category: "Fancy Aerial", pack_size: "BOX", original_price: 3300, image_url: "" },

  // 2 Inch 3 Piece (93 - 95)
  { code: 93, name: "Enjoy the Night", category: "2 Inch 3 Piece", pack_size: "BOX", original_price: 2200, image_url: "" },
  { code: 94, name: "Cool Boys", category: "2 Inch 3 Piece", pack_size: "BOX", original_price: 2200, image_url: "" },
  { code: 95, name: "Cool Dude", category: "2 Inch 3 Piece", pack_size: "BOX", original_price: 2200, image_url: "" },

  // 3 Inch FOUNTAIN (96 - 98)
  { code: 96, name: "Flamezone", category: "3 Inch Fountain", pack_size: "1PCS", original_price: 2300, image_url: "" },
  { code: 97, name: "Blues", category: "3 Inch Fountain", pack_size: "1PCS", original_price: 2300, image_url: "" },
  { code: 98, name: "Blazzers", category: "3 Inch Fountain", pack_size: "1PCS", original_price: 2300, image_url: "" },

  // 4 Inch FOUNTAIN (99 - 101)
  { code: 99, name: "Paris", category: "4 Inch Fountain", pack_size: "1 PCS", original_price: 2900, image_url: "" },
  { code: 100, name: "Tokyo", category: "4 Inch Fountain", pack_size: "1 PCS", original_price: 2900, image_url: "" },
  { code: 101, name: "Venise", category: "4 Inch Fountain", pack_size: "1 PCS", original_price: 2900, image_url: "" },

  // 4 Inch TIN (102 - 105)
  { code: 102, name: "Jack Daniels", category: "4 Inch Tin", pack_size: "BOX", original_price: 3600, image_url: "" },
  { code: 103, name: "Powers Gold Label", category: "4 Inch Tin", pack_size: "BOX", original_price: 3600, image_url: "" },
  { code: 104, name: "Signature", category: "4 Inch Tin", pack_size: "BOX", original_price: 3600, image_url: "" },
  { code: 105, name: "Blue Label", category: "4 Inch Tin", pack_size: "BOX", original_price: 3600, image_url: "" },

  // MULTICOLOUR SHORTS (106 - 115)
  { code: 106, name: "12 Shot Raider", category: "Multicolour Shots", pack_size: "BOX", original_price: 1250, image_url: "/images/repeating_shots.jpg" },
  { code: 107, name: "Rainbow Light (12 Shot)", category: "Multicolour Shots", pack_size: "BOX", original_price: 600, image_url: "/images/repeating_shots.jpg" },
  { code: 108, name: "15 Multi Colour Shot", category: "Multicolour Shots", pack_size: "BOX", original_price: 2300, image_url: "/images/repeating_shots.jpg" },
  { code: 109, name: "25 Multi Colour Shot", category: "Multicolour Shots", pack_size: "BOX", original_price: 3100, image_url: "/images/repeating_shots.jpg" },
  { code: 110, name: "30 Shot Raider", category: "Multicolour Shots", pack_size: "BOX", original_price: 3800, image_url: "/images/repeating_shots.jpg" },
  { code: 111, name: "30 Shot Multi Colour", category: "Multicolour Shots", pack_size: "BOX", original_price: 3900, image_url: "/images/repeating_shots.jpg" },
  { code: 112, name: "60 Shot (Colour Light)", category: "Multicolour Shots", pack_size: "BOX", original_price: 7800, image_url: "/images/repeating_shots.jpg" },
  { code: 113, name: "60 Shot (Bonza)", category: "Multicolour Shots", pack_size: "BOX", original_price: 7800, image_url: "/images/repeating_shots.jpg" },
  { code: 114, name: "120 Shot Multicolour", category: "Multicolour Shots", pack_size: "BOX", original_price: 15600, image_url: "/images/repeating_shots.jpg" },
  { code: 115, name: "240 Shot Multi Colour", category: "Multicolour Shots", pack_size: "BOX", original_price: 31200, image_url: "/images/repeating_shots.jpg" },

  // AK SPECIAL SHORTS (116 - 120)
  { code: 116, name: "Double Shot Ball", category: "Special Aerial Shots", pack_size: "BOX", original_price: 3200, image_url: "/images/repeating_shots.jpg" },
  { code: 117, name: "Triple Shot Ball", category: "Special Aerial Shots", pack_size: "BOX", original_price: 3800, image_url: "/images/repeating_shots.jpg" },
  { code: 118, name: "10X10 Subah Vila", category: "Special Aerial Shots", pack_size: "BOX", original_price: 32000, image_url: "/images/repeating_shots.jpg" },
  { code: 119, name: "10X10 Weave", category: "Special Aerial Shots", pack_size: "BOX", original_price: 32000, image_url: "/images/repeating_shots.jpg" },
  { code: 120, name: "3X10 Shadi Ki Rangoli", category: "Special Aerial Shots", pack_size: "BOX", original_price: 27000, image_url: "/images/repeating_shots.jpg" },

  // COMBO PACKS (121 - 123)
  { code: 121, name: "3000 COMBO", category: "Combo Packs", pack_size: "BOX", original_price: 30000, image_url: "" },
  { code: 122, name: "5000 COMBO", category: "Combo Packs", pack_size: "BOX", original_price: 50000, image_url: "" },
  { code: 123, name: "7500 COMBO", category: "Combo Packs", pack_size: "BOX", original_price: 75000, image_url: "" },

  // GIFT BOX PRICE LIST (124 - 130)
  { code: 124, name: "FERRARI 20 ITEMS", category: "Gift Boxes", pack_size: "20 ITEMS", original_price: 2200, image_url: "" },
  { code: 125, name: "LAMBOGHINI 25 ITEMS", category: "Gift Boxes", pack_size: "25 ITEMS", original_price: 3100, image_url: "" },
  { code: 126, name: "AUDI 30 ITEMS", category: "Gift Boxes", pack_size: "30 ITEMS", original_price: 3800, image_url: "" },
  { code: 127, name: "BMW 35 ITEMS", category: "Gift Boxes", pack_size: "35 ITEMS", original_price: 5100, image_url: "" },
  { code: 128, name: "JAGUAR 40 ITEMS", category: "Gift Boxes", pack_size: "40 ITEMS", original_price: 5900, image_url: "" },
  { code: 129, name: "THALAM 50 ITEMS", category: "Gift Boxes", pack_size: "50 ITEMS", original_price: 7250, image_url: "" },
  { code: 130, name: "VIP 60 ITEMS", category: "Gift Boxes", pack_size: "60 ITEMS", original_price: 9500, image_url: "" }
];

const products = rawProducts.map(p => {
  const orig = Number(p.original_price);
  const offer = Math.round(orig * MULTIPLIER);
  return {
    id: `prod-${p.code}`,
    name: p.name,
    category: p.category,
    pack_size: p.pack_size,
    original_price: orig,
    offer_price: offer,
    discount_percent: DISCOUNT_PERCENT,
    description: `Genuine Sivakasi fireworks item. Packing: ${p.pack_size}. Safe & vibrant celebrations.`,
    image_url: p.image_url || '',
    in_stock: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
});

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
currentStore.site_settings = {
  id: 'default',
  shop_name: 'SRI JEYAM CRACKERS',
  phone1: '6380115587',
  phone2: '6380115587',
  whatsapp_number: '6380115587',
  offer_title: 'DIWALI SPECIAL OFFER - 83% OFF',
  discount_percent: DISCOUNT_PERCENT,
  tagline: 'Celebrate Diwali with More Crackers & More Savings! HAPPY DIWALI!',
  min_order_amount: 500
};

fs.writeFileSync(storePath, JSON.stringify(currentStore, null, 2), 'utf8');
console.log(`Successfully populated ${products.length} cracker products and ${categories.length} categories into store.json!`);
