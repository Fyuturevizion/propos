export const AREA_GUIDES: Record<string, {
  name_en: string;
  name_th: string;
  tagline_en: string;
  tagline_th: string;
  description_en: string;
  description_th: string;
  highlights: string[];
  avgPriceSqm: string;
  propertyTypes: string[];
}> = {
  bangtao: {
    name_en: "Bang Tao",
    name_th: "บางเทา",
    tagline_en: "Beachfront luxury meets local charm",
    tagline_th: "หรูหราริมชายหาดผสมผสานเสน่ห์ท้องถิ่น",
    description_en:
      "Bang Tao is one of Phuket's longest beaches, stretching 6km along the west coast. Home to the prestigious Laguna complex, it offers a perfect blend of luxury resort living and authentic Thai village life. The area is popular with expats and investors alike, offering everything from beachfront villas to modern condominiums.",
    description_th:
      "บางเทาเป็นหนึ่งในชายหาดที่ยาวที่สุดของภูเก็ต ยาว 6 กม. ตามแนวชายฝั่งตะวันตก เป็นที่ตั้งของคอมเพล็กซ์ลากูน่าที่มีชื่อเสียง มอบทั้งการพักผ่อนหรูหราและวิถีชีวิตท้องถิ่นแท้ๆ",
    highlights: ["Laguna Phuket Resort Complex", "6km Sandy Beach", "Catch Beach Club", "Boat Avenue Shopping", "Blue Tree Water Park"],
    avgPriceSqm: "฿120,000 - ฿250,000",
    propertyTypes: ["villa", "condo"],
  },
  surin: {
    name_en: "Surin",
    name_th: "สุรินทร์",
    tagline_en: "The Millionaire's Mile",
    tagline_th: "ถนนนายล้าน",
    description_en:
      "Known as the 'Millionaire's Mile', Surin Beach is one of Phuket's most exclusive addresses. The area features high-end villas perched on headlands with panoramic ocean views, boutique shopping, and some of the island's finest restaurants. A favourite among discerning buyers seeking privacy and prestige.",
    description_th:
      "ขึ้นชื่อว่า 'ถนนนายล้าน' หาดสุรินทร์เป็นหนึ่งในทำเลพิเศษที่สุดของภูเก็ต มีวิลล่าหรูตั้งอยู่บนหัวแหลมพร้อมวิวทะเลพาโนรามา",
    highlights: ["Panoramic Ocean Views", "Boutique Shopping", "Upscale Dining", "Private Beach Access", "Twin Palms Resort"],
    avgPriceSqm: "฿180,000 - ฿400,000",
    propertyTypes: ["villa", "condo"],
  },
  rawai: {
    name_en: "Rawai",
    name_th: "ราไวย์",
    tagline_en: "Southern charm and sea gypsy heritage",
    tagline_th: "เสน่ห์ทางใต้และมรดกชาวเล",
    description_en:
      "Located at Phuket's southern tip, Rawai offers a more relaxed, local lifestyle with stunning views of nearby islands. Famous for its sea gypsy village, seafood markets, and as a departure point for island-hopping. The area is popular with long-term residents and offers excellent value properties.",
    description_th:
      "ตั้งอยู่ปลายใต้สุดของภูเก็ต ราไวย์มีวิถีชีวิตท้องถิ่นผ่อนคลาย วิวเกาะสวยงาม ขึ้นชื่อเรื่องหมู่บ้านชาวเลและตลาดอาหารทะเล",
    highlights: ["Sea Gypsy Village", "Island-Hopping Hub", "Seafood Markets", "Promthep Cape", "Nai Harn Beach Nearby"],
    avgPriceSqm: "฿70,000 - ฿150,000",
    propertyTypes: ["villa", "condo", "townhouse"],
  },
  kamala: {
    name_en: "Kamala",
    name_th: "กมลา",
    tagline_en: "Peaceful beach town with a family feel",
    tagline_th: "เมืองชายหาดที่เงียบสงบเหมาะกับครอบครัว",
    description_en:
      "Kamala offers a quieter alternative to bustling Patong while still being close to all amenities. The beach is pristine and family-friendly, with a strong local community. The area has seen significant development with luxury villas on the hillsides offering spectacular sunset views over the Andaman Sea.",
    description_th:
      "กมลาเป็นทางเลือกที่เงียบสงบกว่าป่าตอง แต่ยังใกล้สิ่งอำนวยความสะดวกครบครัน หาดสะอาดเหมาะกับครอบครัว",
    highlights: ["Quiet Sandy Beach", "Fantasea Theme Park", "Sunset Hill Views", "Local Restaurants", "Family-Friendly Atmosphere"],
    avgPriceSqm: "฿90,000 - ฿200,000",
    propertyTypes: ["villa", "condo"],
  },
  kata: {
    name_en: "Kata",
    name_th: "กะตะ",
    tagline_en: "Surf, sun, and sophisticated living",
    tagline_th: "โต้คลื่น อาบแดด และการใช้ชีวิตที่มีระดับ",
    description_en:
      "Kata is a vibrant beach town known for its excellent surf conditions, lively dining scene, and stunning viewpoints. Divided into Kata Beach and Kata Noi, the area offers a great mix of holiday rentals and permanent residences. Popular with both tourists and long-term expats.",
    description_th:
      "กะตะเป็นเมืองชายหาดที่มีชีวิตชีวา ขึ้นชื่อเรื่องโต้คลื่น ร้านอาหาร และจุดชมวิวที่สวยงาม",
    highlights: ["Surfing Beach", "Kata Viewpoint", "Dining Scene", "Dino Park Mini Golf", "Beach Clubs"],
    avgPriceSqm: "฿100,000 - ฿220,000",
    propertyTypes: ["villa", "condo", "apartment"],
  },
  cherngtalay: {
    name_en: "Cherng Talay",
    name_th: "เชิงทะเล",
    tagline_en: "The heart of Phuket's luxury lifestyle",
    tagline_th: "ศูนย์กลางไลฟ์สไตล์หรูของภูเก็ต",
    description_en:
      "Cherng Talay is the beating heart of Phuket's luxury lifestyle scene. Home to Boat Avenue, Porto de Phuket, and the iconic Laguna area, it's where upscale living meets tropical paradise. The area boasts world-class dining, shopping, and some of the island's most sought-after properties.",
    description_th:
      "เชิงทะเลเป็นศูนย์กลางไลฟ์สไตล์หรูของภูเก็ต ที่ตั้งของโบทอเวนิว ปอร์โตเดภูเก็ต และพื้นที่ลากูน่า",
    highlights: ["Boat Avenue", "Porto de Phuket", "Laguna Golf Course", "HeadStart International School", "Robinson Lifestyle"],
    avgPriceSqm: "฿130,000 - ฿280,000",
    propertyTypes: ["villa", "condo", "townhouse"],
  },
  patong: {
    name_en: "Patong",
    name_th: "ป่าตอง",
    tagline_en: "The vibrant heart of Phuket",
    tagline_th: "หัวใจที่มีชีวิตชีวาของภูเก็ต",
    description_en:
      "Patong is Phuket's most famous beach destination, known for its energetic nightlife, endless shopping, and 3.5km crescent of golden sand. While tourist-focused, it offers excellent investment opportunities with high rental yields. The area is rapidly modernizing with new luxury developments alongside its famous entertainment district.",
    description_th:
      "ป่าตองเป็นจุดหมายปลายทางชายหาดที่มีชื่อเสียงที่สุดของภูเก็ต ขึ้นชื่อเรื่องไนท์ไลฟ์ ช้อปปิ้ง และหาดทรายยาว 3.5 กม.",
    highlights: ["3.5km Beach", "Bangla Road Nightlife", "Jungceylon Mall", "High Rental Yields", "Water Sports"],
    avgPriceSqm: "฿100,000 - ฿250,000",
    propertyTypes: ["condo", "apartment", "villa"],
  },
  naiharn: {
    name_en: "Nai Harn",
    name_th: "ในหาน",
    tagline_en: "Phuket's best-kept secret beach",
    tagline_th: "ชายหาดที่เป็นความลับที่สุดของภูเก็ต",
    description_en:
      "Nai Harn is a peaceful area around one of Phuket's most beautiful beaches. Popular with the yachting community and long-term expats, it offers a tranquil lifestyle with lush green hills, a freshwater lake, and excellent restaurants. Properties here tend to hold their value well.",
    description_th:
      "ในหานเป็นพื้นที่สงบรอบหนึ่งในชายหาดที่สวยที่สุดของภูเก็ต เป็นที่นิยมของชาวเรือยอชท์และชาวต่างชาติที่อยู่ระยะยาว",
    highlights: ["Pristine Beach", "Yachting Community", "Nai Harn Lake", "Viewpoint Restaurants", "Peaceful Atmosphere"],
    avgPriceSqm: "฿80,000 - ฿180,000",
    propertyTypes: ["villa", "condo"],
  },
  laguna: {
    name_en: "Laguna",
    name_th: "ลากูน่า",
    tagline_en: "Asia's premier integrated resort destination",
    tagline_th: "จุดหมายปลายทางรีสอร์ทแบบครบวงจรอันดับหนึ่งของเอเชีย",
    description_en:
      "Laguna Phuket is an award-winning integrated resort complex spanning 1,000 acres. It features luxury hotels, a championship golf course, a spa, and exclusive residential developments. Properties within Laguna command premium prices and offer resort-style living with world-class amenities and 24/7 security.",
    description_th:
      "ลากูน่าภูเก็ตเป็นคอมเพล็กซ์รีสอร์ทครบวงจรบนพื้นที่ 1,000 ไร่ มีโรงแรมหรู สนามกอล์ฟ สปา และที่อยู่อาศัยพิเศษ",
    highlights: ["Banyan Tree Resort", "18-Hole Golf Course", "Laguna Park", "Canal Living", "24/7 Security"],
    avgPriceSqm: "฿150,000 - ฿350,000",
    propertyTypes: ["villa", "condo"],
  },
  karon: {
    name_en: "Karon",
    name_th: "กะรน",
    tagline_en: "Wide beaches and relaxed sophistication",
    tagline_th: "ชายหาดกว้างและความสะดวกสบาย",
    description_en:
      "Karon offers one of Phuket's widest and longest beaches, with a more relaxed atmosphere than neighboring Patong. The area features excellent viewpoints like Karon Viewpoint, diverse dining options, and a growing number of quality property developments. Great for investors seeking rental income with a quieter setting.",
    description_th:
      "กะรนมีหนึ่งในชายหาดที่กว้างและยาวที่สุดของภูเก็ต บรรยากาศผ่อนคลายกว่าป่าตองข้างเคียง",
    highlights: ["Long Wide Beach", "Karon Viewpoint", "Dino Park", "Wat Suwan Khiri Wong", "Diverse Dining"],
    avgPriceSqm: "฿85,000 - ฿180,000",
    propertyTypes: ["villa", "condo"],
  },
  sisunthon: {
    name_en: "Si Sunthon",
    name_th: "ศรีสุนทร",
    tagline_en: "Authentic Phuket away from the crowds",
    tagline_th: "ภูเก็ตแท้ๆ ห่างจากความแออัด",
    description_en:
      "Si Sunthon offers a glimpse into authentic Phuket life, away from the tourist crowds. This peaceful area features rubber plantations, local markets, and traditional Sino-Portuguese architecture. Properties here offer excellent value and a genuine Thai lifestyle while still being within easy reach of the beaches.",
    description_th:
      "ศรีสุนทรให้ความรู้สึกถึงภูเก็ตแท้ๆ ห่างจากนักท่องเที่ยว มีสวนยาง ตลาดท้องถิ่น และสถาปัตยกรรมจีน-โปรตุเกส",
    highlights: ["Local Markets", "Sino-Portuguese Architecture", "Peaceful Environment", "Rubber Plantations", "Great Value Properties"],
    avgPriceSqm: "฿50,000 - ฿120,000",
    propertyTypes: ["villa", "land", "townhouse"],
  },
  thalang: {
    name_en: "Thalang",
    name_th: "ถลาง",
    tagline_en: "Historic heartland with investment potential",
    tagline_th: "ดินแดนประวัติศาสตร์ที่มีศักยภาพการลงทุน",
    description_en:
      "Thalang is Phuket's historic district, home to the Heroines Monument and ancient temples. The area is rapidly developing with new infrastructure while maintaining its cultural heritage. Large land plots make it attractive for developers and investors looking for bigger projects at lower per-square-meter costs.",
    description_th:
      "ถลางเป็นอำเภอเก่าแก่ของภูเก็ต ที่ตั้งของอนุสาวรีย์วีรสตรีและวัดโบราณ กำลังพัฒนาอย่างรวดเร็ว",
    highlights: ["Heroines Monument", "Wat Phra Thong", "Large Land Plots", "New Infrastructure", "Cultural Heritage"],
    avgPriceSqm: "฿40,000 - ฿100,000",
    propertyTypes: ["land", "villa"],
  },
  phukettown: {
    name_en: "Phuket Town",
    name_th: "เมืองภูเก็ต",
    tagline_en: "Cultural hub with colonial charm",
    tagline_th: "ศูนย์กลางวัฒนธรรมที่มีเสน่ห์ยุคอาณานิคม",
    description_en:
      "Phuket Town is the island's capital and cultural heart, famous for its beautifully preserved Sino-Portuguese old town, vibrant street art, and burgeoning food scene. The area offers unique renovated shophouses, modern condominiums, and is experiencing a renaissance as Phuket's creative and culinary center.",
    description_th:
      "เมืองภูเก็ตเป็นเมืองหลวงและศูนย์กลางวัฒนธรรมของเกาะ ขึ้นชื่อเรื่องเมืองเก่าจีน-โปรตุเกสที่อนุรักษ์ไว้อย่างสวยงาม",
    highlights: ["Old Town Heritage", "Sunday Walking Street", "Street Art Scene", "Boutique Cafes", "Weekend Market"],
    avgPriceSqm: "฿60,000 - ฿150,000",
    propertyTypes: ["condo", "townhouse", "apartment"],
  },
};
