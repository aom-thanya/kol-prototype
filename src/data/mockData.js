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
    internalStatus: "Example List",
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
    salesOwner: "ซาร่า",
    packageType: ["Rate Card (2 D)"],
    objective: ["Awareness (Reach)", "Interest (Engagement)"],
    objectiveNote: "เป้าหมายหลัก ต้องการให้เกิดยอดขาย เป้าหมายรอง brand awareness",
    gender: ["Female"],
    country: "Thailand",
    province: "Bangkok",
    ageRange: ["25-34", "35-44", "45-64"],
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
    productValue: 390,
    logisticsPerInfluencer: 100,
    travelExpense: 500,

    budgetOptions: [
      {
        id: "opt-1",
        name: "Option A (All Channels)",
        budgetSpending: "300000",
        budgetBoostSpending: "30000",
        estimatedBrandSpending: "15000",
        scopeOfWorks: [
          {
            id: "1",
            contentType: "VDO content (Short Clip)",
            followerReq: "5K - 50K",
            followerReqFrom: "5000",
            followerReqTo: "50000",
            numInfluencers: "15",
            platforms: ["Tiktok"],
            name: "Tiktok Review",
            allocationPercent: 50,
            details: "ครีเอทคอนเท้น ในรูปแบบ Video Short Clip รีวิว สินค้าคนละ 1 SKU (สินค้ามี 5 SKU ลูกค้าต้องการแบ่งรีวิว) ให้เข้ากับไลฟ์สไตล์ของอินฟู และอยากให้อินฟลูเล่าถึงผลลัพธ์หลังการใช้งาน และชูจุดเด่นของสินค้า เช่น ส่วนผสมหลัก + ติดตะกร้า + Affiliate",
            persona: {
              demographic: "18-24 Female, Gen Z Skincare users",
              location: "Bangkok & Metropolitan cities",
              occupation: "University Students, Beauty Bloggers",
              persona: "Energetic, Authentic, Fun storytelling",
              contentCategory: "Skincare, Makeup tutorials",
              storyTelling: "Genuine unboxing and 7-day challenge results"
            },
            serviceScope: {
              buyoutRequired: true, buyoutDuration: ["180 วัน"],
              boostPostRequired: true, boostPostDuration: ["30 วัน"],
              genCodeRequired: true, genCodeDuration: ["30 วัน"],
              tiktokShopRequired: true, tiktokShopDuration: [], // No duration
              addAdsRequired: true, addAdsDuration: [] // No duration
            }
          },
          {
            id: "2",
            contentType: "VDO content (Short Clip)",
            followerReq: "5K - 50K",
            followerReqFrom: "5000",
            followerReqTo: "50000",
            numInfluencers: "10",
            platforms: ["Instagram"],
            name: "IG Reel Review",
            allocationPercent: 30,
            details: "ครีเอทคอนเท้น ในรูปแบบ Video Short Clip รีวิว สินค้าคนละ 1 SKU (สินค้ามี 5 SKU ลูกค้าต้องการแบ่งรีวิว) ให้เข้ากับไลฟ์สไตล์ของอินฟู และอยากให้อินฟลูเล่าถึงผลลัพธ์หลังการใช้งาน และชูจุดเด่นของสินค้า เช่น ส่วนผสมหลัก + Affiliate",
            persona: {
              demographic: "25-34 Female, Modern Working Women",
              location: "Bangkok and major cities (Chiang Mai, Phuket)",
              occupation: "Office workers, Professionals, Freelancers",
              persona: "Elegant, Minimalist, Trustworthy, Aspirational",
              contentCategory: "Premium beauty products, Self-care",
              storyTelling: "Aesthetic morning routine and texture close-ups"
            },
            serviceScope: {
              buyoutRequired: true, buyoutDuration: ["180 วัน"],
              paidPartnershipRequired: true, paidPartnershipDuration: ["30 วัน"],
              boostPostRequired: true, boostPostDuration: [] // No duration
            }
          },
          {
            id: "3",
            contentType: "Photo Album",
            followerReq: "5K - 10K",
            followerReqFrom: "5000",
            followerReqTo: "10000",
            numInfluencers: "5",
            platforms: ["Facebook"],
            name: "Facebook Album Review",
            allocationPercent: 20,
            details: "ครีเอทคอนเท้น ในรูปแบบ Photo Album รีวิว สินค้าคนละ 1 SKU (สินค้ามี 5 SKU ลูกค้าต้องการแบ่งรีวิว) ให้เข้ากับไลฟ์สไตล์ของอินฟู และอยากให้อินฟลูเล่าถึงผลลัพธ์หลังการใช้งาน และชูจุดเด่นของสินค้า เช่น ส่วนผสมหลัก + Affiliate",
            persona: {
              demographic: "30-45 Female, Moms & Families",
              location: "Nationwide Thailand",
              occupation: "Housewives, Full-time moms, Salary workers",
              persona: "Informative, Sincere, Detailed reviewer",
              contentCategory: "Skincare science, Safe ingredients",
              storyTelling: "Detailed step-by-step review with explanation of active ingredients"
            },
            serviceScope: {
              boostPostRequired: true, boostPostDuration: ["30 วัน"]
            }
          }
        ]
      },
      {
        id: "opt-2",
        name: "Option B (TikTok Focus)",
        budgetSpending: "200000",
        budgetBoostSpending: "15000",
        estimatedBrandSpending: "10000",
        scopeOfWorks: [
          {
            id: "1",
            contentType: "VDO content (Short Clip)",
            followerReq: "10K - 50K",
            followerReqFrom: "10000",
            followerReqTo: "50000",
            numInfluencers: "20",
            platforms: ["Tiktok"],
            name: "Tiktok Review",
            allocationPercent: 80,
            details: "เน้นการรีวิวทาง TikTok เป็นหลักเพื่อกระตุ้นยอดขายผ่าน Affiliate และ TikTok Shop",
            persona: {
              demographic: "18-24 Female, Gen Z Skincare users",
              location: "Bangkok & Metropolitan cities",
              occupation: "University Students, Beauty Bloggers",
              persona: "Energetic, Authentic, Fun storytelling",
              contentCategory: "Skincare, Makeup tutorials",
              storyTelling: "Genuine unboxing and 7-day challenge results"
            }
          },
          {
            id: "2",
            contentType: "VDO content (Short Clip)",
            followerReq: "5K - 10K",
            followerReqFrom: "5000",
            followerReqTo: "10000",
            numInfluencers: "5",
            platforms: ["Instagram"],
            name: "IG Reel Review",
            allocationPercent: 20,
            details: "ลง IG Reels เสริมเล็กน้อยเพื่อกระตุ้นภาพลักษณ์ของแบรนด์",
            persona: {
              demographic: "25-34 Female, Modern Working Women",
              location: "Bangkok and major cities (Chiang Mai, Phuket)",
              occupation: "Office workers, Professionals, Freelancers",
              persona: "Elegant, Minimalist, Trustworthy, Aspirational",
              contentCategory: "Premium beauty products, Self-care",
              storyTelling: "Aesthetic morning routine and texture close-ups"
            }
          }
        ]
      }
    ],
    
    // SOW
    scopeOfWorks: [
      {
        id: "1",
        contentType: "VDO content (Short Clip)",
        followerReq: "5K - 50K",
        followerReqFrom: "5000",
        followerReqTo: "50000",
        numInfluencers: "15",
        platforms: ["Tiktok"],
        name: "Tiktok Review",
        details: "ครีเอทคอนเท้น ในรูปแบบ Video Short Clip รีวิว สินค้าคนละ 1 SKU (สินค้ามี 5 SKU ลูกค้าต้องการแบ่งรีวิว) ให้เข้ากับไลฟ์สไตล์ of อินฟู และอยากให้อินฟลูเล่าถึงผลลัพธ์หลังการใช้งาน และชูจุดเด่นของสินค้า เช่น ส่วนผสมหลัก + ติดตะกร้า + Affiliate",
        persona: {
          demographic: "18-24 Female, Gen Z Skincare users",
          location: "Bangkok & Metropolitan cities",
          occupation: "University Students, Beauty Bloggers",
          persona: "Energetic, Authentic, Fun storytelling",
          contentCategory: "Skincare, Makeup tutorials",
          storyTelling: "Genuine unboxing and 7-day challenge results"
        },
        serviceScope: {
          buyoutRequired: true, buyoutDuration: ["180 วัน"],
          boostPostRequired: true, boostPostDuration: ["30 วัน"],
          genCodeRequired: true, genCodeDuration: ["30 วัน"],
          tiktokShopRequired: true, tiktokShopDuration: [], // No duration
          addAdsRequired: true, addAdsDuration: [] // No duration
        }
      },
      {
        id: "2",
        contentType: "VDO content (Short Clip)",
        followerReq: "5K - 50K",
        followerReqFrom: "5000",
        followerReqTo: "50000",
        numInfluencers: "10",
        platforms: ["Instagram"],
        name: "IG Reel Review",
        details: "ครีเอทคอนเท้น ในรูปแบบ Video Short Clip รีวิว สินค้าคนละ 1 SKU (สินค้ามี 5 SKU ลูกค้าต้องการแบ่งรีวิว) ให้เข้ากับไลฟ์สไตล์ของอินฟู และอยากให้อินฟลูเล่าถึงผลลัพธ์หลังการใช้งาน และชูจุดเด่นของสินค้า เช่น ส่วนผสมหลัก + Affiliate",
        persona: {
          demographic: "25-34 Female, Modern Working Women",
          location: "Bangkok and major cities (Chiang Mai, Phuket)",
          occupation: "Office workers, Professionals, Freelancers",
          persona: "Elegant, Minimalist, Trustworthy, Aspirational",
          contentCategory: "Premium beauty products, Self-care",
          storyTelling: "Aesthetic morning routine and texture close-ups"
        },
        serviceScope: {
          buyoutRequired: true, buyoutDuration: ["180 วัน"],
          paidPartnershipRequired: true, paidPartnershipDuration: ["30 วัน"],
          boostPostRequired: true, boostPostDuration: [] // No duration
        }
      },
      {
        id: "3",
        contentType: "Photo Album",
        followerReq: "5K - 10K",
        followerReqFrom: "5000",
        followerReqTo: "10000",
        numInfluencers: "5",
        platforms: ["Facebook"],
        name: "Facebook Album Review",
        details: "ครีเอทคอนเท้น ในรูปแบบ Photo Album รีวิว สินค้าคนละ 1 SKU (สินค้ามี 5 SKU ลูกค้าต้องการแบ่งรีวิว) ให้เข้ากับไลฟ์สไตล์ของอินฟู และอยากให้อินฟลูเล่าถึงผลลัพธ์หลังการใช้งาน และชูจุดเด่นของสินค้า เช่น ส่วนผสมหลัก + Affiliate",
        persona: {
          demographic: "30-45 Female, Moms & Families",
          location: "Nationwide Thailand",
          occupation: "Housewives, Full-time moms, Salary workers",
          persona: "Informative, Sincere, Detailed reviewer",
          contentCategory: "Skincare science, Safe ingredients",
          storyTelling: "Detailed step-by-step review with explanation of active ingredients"
        },
        serviceScope: {
          boostPostRequired: true, boostPostDuration: ["30 วัน"]
        }
      }
    ],

    // Service Scope
    buyoutRequired: true,
    buyoutDuration: ["180 วัน", "365 วัน", "Permanent"],
    boostRequired: true,
    boostDuration: ["30 วัน"],
    addAdsRequired: false,
    addAdsDuration: [],
    paidPartnershipRequired: false,
    paidPartnershipDuration: [],
    genCodeRequired: true,
    genCodeDuration: ["30 วัน"],
    tiktokShopRequired: false,
    tiktokShopDuration: [],
    crossPostingRequired: false,
    crossPostingDuration: [],

    // Brand Support & Condition
    brandSupportType: "Brand Sponsor",
    brandSupportTypeOther: "",
    productReceiveMethod: "Sponsor สินค้า (Buddy Review จัดส่ง)",
    reimbursement: "",
    requireTravel: "ไม่ต้อง",
    reviewerTravelExpense: "",
    onSiteType: "",
    eventDuration: "",
    locationDetails: "",
    buddyReviewSupport: "",
    condition: `แบรนด์ สามารถเลือก Influencer ได้ 1 ครั้ง
แบรนด์ เป็นผู้ตรวจ Draft Content  โดยสามารถตรวจได้ 2 ครั้ง
แบรนด์ ต้อง Sponsor Product
Buddy Review เป็นผู้ประสานงานกับ Influencer
รบกวนเช็ค รายละเอียด Condition ของ KOL รวมถึงราคา Boost Post / Boost fee
แปะ Link ของ Platform ที่นำเสนอทุกช่องทาง`,
    
    createdAt: "2025-01-09",
    
    groupTrackers: {
      "Tiktok Review": {
        influencers: [
          {
            id: "inf-1",
            accountName: "@baifernbah",
            accountLink: "https://tiktok.com/@baifernbah",
            follower: "5.2M",
            channel: "TikTok",
            contact: "Line: @baifern_work",
            rawCost: "250000",
            creditTerm: "30",
            paymentType: "บริษัท",
            services: {
              "buyoutRequired_6 เดือน": { status: "รับ", price: "50000", note: "" },
              "boostRequired_30 days": { status: "รับ", price: "20000", note: "" },
              "genCodeRequired_30 days": { status: "รับ", price: "10000", note: "" },
              "Affiliate": { status: "ไม่รับ", price: "", note: "" }
            },
            scopeOfWork: "1",
            condition: "1. แก้ไขดราฟได้สูงสุดกี่ครั้ง = 2\n2. ใส่ # สูงสุดได้กี่อัน = 3\n3. ใส่ Text/AW/Logo ในชิ้นงานได้หรือไม่ = ได้\n4. ระยะเวลาทำ Script/Idea  = 3 วัน\n5. ระยะเวลาทำ Draft = 5 วัน\n6. ลบโพสต์หรือไม่ = ไม่ลบ",
            brandSupports: { "Sponsor สินค้า": "ส่งขวดใหญ่ 50ml" },
            detail: "เหมาะกับกลุ่มเป้าหมายผู้หญิงวัยทำงาน",
            note: "",
            contactStatus: "Selected"
          },
          {
            id: "inf-2",
            accountName: "@mimi_healthy",
            accountLink: "https://tiktok.com/@mimi_healthy",
            follower: "450K",
            channel: "TikTok",
            contact: "mimi.healthy@gmail.com",
            rawCost: "35000",
            creditTerm: "30",
            paymentType: "บุคคล",
            services: {
              "buyoutRequired_6 เดือน": { status: "รับ", price: "5000", note: "" },
              "boostRequired_30 days": { status: "รับ", price: "3000", note: "" },
              "genCodeRequired_30 days": { status: "รับ", price: "2000", note: "" },
              "Affiliate": { status: "รับ", price: "10%", note: "" }
            },
            scopeOfWork: "1",
            condition: "1. แก้ไขดราฟได้สูงสุดกี่ครั้ง = 2\n2. ใส่ # สูงสุดได้กี่อัน = 3\n3. ใส่ Text/AW/Logo ในชิ้นงานได้หรือไม่ = ได้\n4. ระยะเวลาทำ Script/Idea  = 2 วัน\n5. ระยะเวลาทำ Draft = 4 วัน\n6. ลบโพสต์หรือไม่ = ไม่ลบ",
            brandSupports: { "Sponsor สินค้า": "ส่งขนาดทดลอง 5 ชิ้น" },
            detail: "แนวสายสุขภาพ เล่าเรื่องเก่ง",
            note: "",
            contactStatus: "Rejected"
          },
          {
            id: "inf-3",
            accountName: "@ice_beautyy",
            accountLink: "https://tiktok.com/@ice_beautyy",
            follower: "820K",
            channel: "TikTok",
            contact: "081-234-5678",
            rawCost: "60000",
            creditTerm: "30",
            paymentType: "บุคคล",
            services: {
              "buyoutRequired_6 เดือน": { status: "รับ", price: "10000", note: "" },
              "boostRequired_30 days": { status: "รับ", price: "5000", note: "" },
              "genCodeRequired_30 days": { status: "รับ", price: "3000", note: "" },
              "Affiliate": { status: "ไม่รับ", price: "", note: "" }
            },
            scopeOfWork: "1",
            condition: "1. แก้ไขดราฟได้สูงสุดกี่ครั้ง = 1\n2. ใส่ # สูงสุดได้กี่อัน = 2\n3. ใส่ Text/AW/Logo ในชิ้นงานได้หรือไม่ = ไม่ได้\n4. ระยะเวลาทำ Script/Idea  = 2 วัน\n5. ระยะเวลาทำ Draft = 3 วัน\n6. ลบโพสต์หรือไม่ = ไม่ลบ",
            brandSupports: { "Sponsor สินค้า": "ส่งขวดใหญ่ 50ml" },
            detail: "บิวตี้บล็อกเกอร์ยอดนิยมช่วงนี้",
            note: "",
            contactStatus: ""
          }
        ]
      },
      "IG Reel Review": {
        influencers: [
          {
            id: "inf-4",
            accountName: "@pearypie",
            accountLink: "https://instagram.com/pearypie",
            follower: "1.5M",
            channel: "Instagram",
            contact: "work.pearypie@gmail.com",
            rawCost: "180000",
            creditTerm: "45",
            paymentType: "บริษัท",
            services: {
              "buyoutRequired_6 เดือน": { status: "รับ", price: "30000", note: "" },
              "boostRequired_30 days": { status: "รับ", price: "15000", note: "" },
              "genCodeRequired_30 days": { status: "รับ", price: "8000", note: "" }
            },
            scopeOfWork: "2",
            condition: "1. แก้ไขดราฟได้สูงสุดกี่ครั้ง = 2\n2. ใส่ # สูงสุดได้กี่อัน = 3\n3. ใส่ Text/AW/Logo ในชิ้นงานได้หรือไม่ = ได้\n4. ระยะเวลาทำ Script/Idea  = 3 วัน\n5. ระยะเวลาทำ Draft = 5 วัน\n6. ลบโพสต์หรือไม่ = ไม่ลบ",
            brandSupports: { "Sponsor สินค้า": "ส่งขวดใหญ่ 50ml" },
            detail: "ภาพสวย พรีเมียมมาก",
            note: "",
            contactStatus: "Selected"
          }
        ]
      }
    }
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
    salesOwner: "ไนซ์",
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
  },
  {
    id: "BRD-2193",
    internalStatus: "Assign Planner/Buyer",
    version: 1,
    campaignName: "Mega Bangna Event",
    customerId: "CUST-001",
    brand: "Mega Bangna",
    product: "Event details at Mega Bangna",
    clientStatus: "New",
    customerType: "Key Account",
    salesOwner: "ข้าว",
    packageType: ["Rate Card KPI (1.5 D)"],
    objective: ["Awareness (Reach)"],
    objectiveNote: "",
    gender: ["Male", "Female"],
    country: "Thailand",
    province: "Bangkok",
    ageRange: "18 - 45",
    campaignStartDate: "2025-06-01",
    campaignEndDate: "2025-06-15",
    platform: ["Instagram", "Tiktok"],
    createdAt: "2025-05-10"
  },
  {
    id: "BRD-3001",
    internalStatus: "Assign Planner/Buyer",
    version: 1,
    campaignName: "Srichand Summer Collection",
    customerId: "CUST-002",
    brand: "Srichand",
    product: "เครื่องสำอางคอลเลคชันใหม่สำหรับหน้าร้อน กันน้ำกันเหงื่อ ติดทนนาน",
    clientStatus: "New",
    customerType: "Non-Key Account",
    salesOwner: "เอก",
    packageType: ["Ratecard KPI"],
    objective: ["Trust (Post)"],
    objectiveNote: "เน้นรีวิวจากบิวตี้บล็อกเกอร์ให้เกิดความมั่นใจในสินค้า",
    gender: ["Female"],
    country: "Thailand",
    province: "Bangkok",
    ageRange: "18 - 35",
    campaignStartDate: "2025-07-01",
    campaignEndDate: "2025-07-31",
    platform: ["Tiktok"],
    createdAt: "2025-06-01"
  },
  {
    id: "BRD-3002",
    internalStatus: "Draft",
    version: 1,
    campaignName: "Unilever Pure Drink Launch",
    customerId: "CUST-003",
    brand: "Unilever",
    product: "เครื่องดื่มชาเขียวเพื่อสุขภาพสูตรไม่มีน้ำตาล",
    clientStatus: "New",
    customerType: "Key Account",
    salesOwner: "ซาร่า",
    packageType: ["Standard KPI"],
    objective: ["Awareness (Reach)"],
    objectiveNote: "สร้างการรับรู้ในกลุ่มคนทำงานรักสุขภาพ",
    gender: ["Male", "Female"],
    country: "Thailand",
    province: "Bangkok",
    ageRange: "20 - 45",
    campaignStartDate: "2025-08-01",
    campaignEndDate: "2025-08-31",
    platform: ["Instagram", "Facebook"],
    createdAt: "2025-06-05",
    productValue: 200,
    logisticsPerInfluencer: 0,
    travelExpense: 0,
    budgetOptions: [
      {
        id: "opt-1",
        name: "Option A (TikTok Focus)",
        totalBudget: "15000",
        totalBoostAds: "0",
        totalOtherServices: "0",
        scopeOfWorks: [
          { id: "sow-1", name: "All in TikTok 10,000 - 50,000", platforms: ["TikTok"], followerReq: "10K - 50K", allocationPercent: 100 }
        ]
      },
      {
        id: "opt-2",
        name: "Option B (TikTok + Instagram)",
        totalBudget: "30000",
        totalBoostAds: "2000",
        totalOtherServices: "1000",
        scopeOfWorks: [
          { id: "sow-2", name: "All in TikTok 10,000 - 50,000", platforms: ["TikTok"], followerReq: "10K - 50K", allocationPercent: 50 },
          { id: "sow-3", name: "All in Instagram 10,000 - 50,000", platforms: ["Instagram"], followerReq: "10K - 50K", allocationPercent: 50 }
        ]
      }
    ]
  }
];
