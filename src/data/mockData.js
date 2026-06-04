export const customersSeed = [
  {
    id: "CUST-001",
    name: "L'Oréal Thailand",
    image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=160&q=80",
    type: "Key Account",
    createdAt: "2025-01-05"
  },
  {
    id: "CUST-002",
    name: "Srichand",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=160&q=80",
    type: "Non-Key Account",
    createdAt: "2025-02-12"
  },
  {
    id: "CUST-003",
    name: "Unilever",
    image: "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&w=160&q=80",
    type: "Key Account",
    createdAt: "2025-03-20"
  }
];

export const briefsSeed = [
  {
    id: "NRP202501020",
    internalStatus: "Assign Planner/Buyer",
    version: 1,
    activityLog: [{
      date: new Date().toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      action: "Sales submitted Brief V1",
      details: "Initial submission to traffic."
    }],
    campaignName: "L'Oréal Revitalift Launch Q2",
    customerId: "CUST-001",
    brand: "L'Oréal Paris",
    product: "เป็น Skincare ใหม่ ภายใต้แบรนด์ XXX ค่ะ โดยจะ launch สินค้าในช่วง April 2025 ค่ะ มีสินค้าทั้งหมด 5 SKU : Cleanser / ครีมกันแดด / serum ผลัดเซลล์ผิว / serum booster เพิ่มความกระจ่างใส / Moisturizer สินค้าราคาขายเริ่มที่ 390++",
    clientStatus: "New",
    customerType: "Key Account",
    salesOwner: "พี่ bankie",
    packageType: ["Rate Card (2 D)"],
    objective: ["Awareness (Reach)", "Interest (Engagement)"],
    objectiveNote: "เป้าหมายหลัก ต้องการให้เกิดยอดขาย เป้าหมายรอง brand awareness",
    gender: ["Female"],
    country: "Thailand",
    province: "Bangkok",
    ageRange: "25 ++ ขึ้นไป",
    infContent: "General, Lifestyle",
    infPersona: "สนุกสนาน, เป็นกันเอง",
    infOccupation: "พนักงานออฟฟิศ, ฟรีแลนซ์",
    campaignStartDate: "2025-04-01",
    campaignEndDate: "2025-04-30",
    platform: ["Instagram", "Tiktok", "Facebook"],
    otherPlatform: "",
    
    // Budget
    standardBudget: "300,000",
    includeVAT: "Excl. VAT",
    boostPostBudget: "รวมในแพคเกจ",
    addAdsBudget: "",
    pickUpFee: "",
    buyingValue: "",
    
    // SOW
    scopeOfWorks: [
      {
        id: "1",
        contentType: "VDO content (Short Clip)",
        followerReq: "5K or above (10 คน), 10K or above (5 คน)",
        numInfluencers: "15",
        platforms: ["Tiktok"],
        name: "Tiktok Review",
        details: "ครีเอทคอนเท้น ในรูปแบบ Video Short Clip รีวิว สินค้าคนละ 1 SKU (สินค้ามี 5 SKU ลูกค้าต้องการแบ่งรีวิว) ให้เข้ากับไลฟ์สไตล์ของอินฟู และอยากให้อินฟลูเล่าถึงผลลัพธ์หลังการใช้งาน และชูจุดเด่นของสินค้า เช่น ส่วนผสมหลัก + ติดตะกร้า + Affiliate"
      },
      {
        id: "2",
        contentType: "VDO content (Short Clip)",
        followerReq: "5K or above (7 คน), 10K or above (3 คน)",
        numInfluencers: "10",
        platforms: ["Instagram"],
        name: "IG Reel Review",
        details: "ครีเอทคอนเท้น ในรูปแบบ Video Short Clip รีวิว สินค้าคนละ 1 SKU (สินค้ามี 5 SKU ลูกค้าต้องการแบ่งรีวิว) ให้เข้ากับไลฟ์สไตล์ของอินฟู และอยากให้อินฟลูเล่าถึงผลลัพธ์หลังการใช้งาน และชูจุดเด่นของสินค้า เช่น ส่วนผสมหลัก + Affiliate"
      },
      {
        id: "3",
        contentType: "Photo Album",
        followerReq: "5K or above (5 คน)",
        numInfluencers: "5",
        platforms: ["Facebook"],
        name: "Facebook Album Review",
        details: "ครีเอทคอนเท้น ในรูปแบบ Photo Album รีวิว สินค้าคนละ 1 SKU (สินค้ามี 5 SKU ลูกค้าต้องการแบ่งรีวิว) ให้เข้ากับไลฟ์สไตล์ของอินฟู และอยากให้อินฟลูเล่าถึงผลลัพธ์หลังการใช้งาน และชูจุดเด่นของสินค้า เช่น ส่วนผสมหลัก + Affiliate"
      }
    ],

    // Service Scope
    buyoutRequired: true,
    buyoutDuration: ["6 เดือน", "12 เดือน", "ถาวร"],
    boostRequired: true,
    boostDuration: ["30 days"],
    addAdsRequired: false,
    addAdsDuration: [],
    paidPartnershipRequired: false,
    paidPartnershipDuration: [],
    genCodeRequired: true,
    genCodeDuration: ["30 days"],
    tiktokShopRequired: false,
    tiktokShopDuration: [],
    crossPostingRequired: false,
    crossPostingDuration: [],

    // Brand Support & Condition
    brandSupport: ["Sponsor สินค้า"],
    influencerBuyValue: "",
    influencerPickupLocation: "",
    condition: `แบรนด์ สามารถเลือก Influencer ได้ 1 ครั้ง
แบรนด์ เป็นผู้ตรวจ Draft Content  โดยสามารถตรวจได้ 2 ครั้ง
แบรนด์ ต้อง Sponsor Product
Buddy Review เป็นผู้ประสานงานกับ Influencer
รบกวนเช็ค รายละเอียด Condition ของ KOL รวมถึงราคา Boost Post / Boost fee
แปะ Link ของ Platform ที่นำเสนอทุกช่องทาง`,
    
    createdAt: "2025-01-09",
  },
  {
    id: "NRP202501021",
    internalStatus: "Draft",
    version: 1,
    campaignName: "Launch Food Festival",
    customerId: "CUST-002",
    brand: "TasteBite",
    product: "ขนมขบเคี้ยวรสใหม่",
    clientStatus: "New",
    customerType: "Non-Key Account",
    salesOwner: "พี่ bankie",
    packageType: ["Standard (1 D)"],
    objective: ["Awareness (Reach)"],
    objectiveNote: "เน้นสร้าง awareness ให้คนรู้จักรสชาติใหม่",
    gender: ["Male", "Female"],
    country: "Thailand",
    province: "Bangkok",
    ageRange: "18 - 35 ปี",
    infContent: "Foodie, Cafe Hopper",
    infPersona: "วัยรุ่นชอบลองของใหม่",
    infOccupation: "นักศึกษา, พนักงานบริษัท",
    campaignStartDate: "2025-05-01",
    campaignEndDate: "2025-05-15",
    platform: ["Tiktok", "Facebook"],
    otherPlatform: "",
    
    // Budget
    budgetSpending: "150,000",
    budgetBoostSpending: "50,000",
    vat: "Incl. VAT",
    budgetCondition: "Net",
    estimatedBrandSpending: "200,000",
    budgetPerInfluencer: "10,000",
    expectedNumInfluencers: "10",
    expectedReach: "1M",
    
    // SOW
    scopeOfWorks: [
      {
        id: "1",
        contentType: "VDO content (Short Clip)",
        followerReq: "100K or above",
        numInfluencers: "5",
        platforms: ["Tiktok"],
        name: "Tiktok Challenge",
        details: "ทำคลิปสั้นเต้นประกอบเพลง พร้อมกินขนมโชว์"
      }
    ],

    // Service Scope
    buyoutRequired: false,
    buyoutDuration: [],
    boostRequired: true,
    boostDuration: ["15 days"],
    addAdsRequired: false,
    addAdsDuration: [],
    paidPartnershipRequired: false,
    paidPartnershipDuration: [],
    genCodeRequired: false,
    genCodeDuration: [],
    tiktokShopRequired: true,
    tiktokShopDuration: ["30 days"],
    crossPostingRequired: false,
    crossPostingDuration: [],

    // Brand Support & Condition
    brandSupport: ["Sponsor สินค้า"],
    influencerBuyValue: "",
    influencerPickupLocation: "จัดส่งให้ถึงบ้าน",
    condition: `ต้องแปะตะกร้า Tiktok Shop
แบรนด์ตรวจคลิปได้ 1 ครั้ง`,
    
    createdAt: "2025-01-10",
  }
];
