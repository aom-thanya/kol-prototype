const fs = require('fs');

let content = fs.readFileSync('src/data/mockData.js', 'utf8');
const index = content.indexOf('export const briefsSeed = [');
if (index === -1) {
  console.log('Could not find briefsSeed array');
  process.exit(1);
}

const before = content.substring(0, index + 'export const briefsSeed = '.length);
const arrayStr = content.substring(index + 'export const briefsSeed = '.length).trim().replace(/;$/, '');

let briefs;
try {
  briefs = eval('(' + arrayStr + ')');
} catch (e) {
  console.log('Parse error:', e.message);
  process.exit(1);
}

briefs.forEach(brief => {
  if (brief.internalStatus === 'Rate Card List' || brief.id === 'BRD-2193' || brief.id === 'BRD-3001' || brief.id === 'BRD-2D-MOCK' || brief.id === 'BRD-KPI-MOCK') {
    
    // Ensure we have budgetOptions with scopeOfWorks
    if (!brief.budgetOptions) {
      const sows = [];
      if (brief.groups) {
        brief.groups.forEach(g => {
          if (g.sows && g.sows.length > 0) {
            const sow = g.sows[0];
            const followerParts = (sow.followerReq || '').replace(/K/g, '000').split(' - ');
            const newSow = {
              id: sow.id || `sow_${Date.now()}_${Math.random()}`,
              name: g.name,
              platforms: sow.platforms || ['TikTok'],
              followerReqFrom: followerParts[0] ? followerParts[0].trim() : '',
              followerReqTo: followerParts[1] ? followerParts[1].trim() : '',
              numInfluencers: sow.numInfluencers || '1',
              contentType: ['Video (1-3 min)'],
              persona: {
                demographic: g.pillars?.Demographic || g.pillars?.demographic || [],
                location: g.pillars?.Location || g.pillars?.location || [],
                occupation: g.pillars?.Occupation || g.pillars?.occupation || [],
                persona: g.pillars?.Persona || g.pillars?.persona || [],
                contentCategory: g.pillars?.ContentCategory || g.pillars?.contentCategory || [],
                storyTelling: g.pillars?.StoryTelling || g.pillars?.storyTelling || []
              },
              serviceScope: {},
              brandSupportType: 'No Sponsor'
            };
            sows.push(newSow);
          }
        });
      }

      if (sows.length === 0) {
        sows.push({
          id: `sow_default_${Date.now()}`,
          name: "Standard Scope",
          platforms: ["TikTok"],
          followerReqFrom: "10000",
          followerReqTo: "50000",
          numInfluencers: "5",
          contentType: ["Video (1-3 min)"],
          persona: {
            demographic: ["18-35 Unisex"],
            location: ["Bangkok"],
            occupation: [],
            persona: [],
            contentCategory: [],
            storyTelling: []
          },
          serviceScope: {},
          brandSupportType: "No Sponsor"
        });
      }

      brief.budgetOptions = [
        {
          id: `opt_${Date.now()}`,
          name: "Option 1",
          totalBudget: "100000",
          totalBoostAds: "0",
          totalOtherServices: "0",
          scopeOfWorks: sows
        }
      ];
    }
    
    // Now map budgetOptions[0].scopeOfWorks to groups
    if (brief.budgetOptions && brief.budgetOptions[0] && brief.budgetOptions[0].scopeOfWorks) {
      brief.groups = brief.budgetOptions[0].scopeOfWorks.map((sow, idx) => {
        // Find old questions if any
        let oldQuestions = [];
        if (brief.groups) {
          const oldGrp = brief.groups.find(og => og.name === sow.name);
          if (oldGrp && oldGrp.questions) oldQuestions = oldGrp.questions;
        }
        
        const getArray = (val) => Array.isArray(val) ? val : (val ? [val] : []);
        
        return {
          id: `group_${sow.id}`,
          name: sow.name || `Group ${idx + 1}`,
          pillars: {
            demographic: getArray(sow.persona?.demographic),
            location: getArray(sow.persona?.location),
            occupation: getArray(sow.persona?.occupation),
            persona: getArray(sow.persona?.persona),
            contentCategory: getArray(sow.persona?.contentCategory),
            storyTelling: getArray(sow.persona?.storyTelling)
          },
          questions: oldQuestions,
          sows: [sow]
        };
      });

      // Also update groupTrackers to use new group ids
      if (brief.groupTrackers) {
        const newTrackers = {};
        brief.groups.forEach(g => {
          // Find matching tracker by old name or id
          const oldKey = Object.keys(brief.groupTrackers).find(k => 
            k === g.name || k === g.id || (brief.groupTrackers[k] && brief.groupTrackers[k].name === g.name)
          );
          if (oldKey) {
            const trackerData = brief.groupTrackers[oldKey];
            // update influencer sow id to match new sow id
            if (trackerData.influencers) {
               trackerData.influencers = trackerData.influencers.map(inf => {
                 return { ...inf, scopeOfWork: g.sows[0].id };
               });
            }
            newTrackers[g.id] = trackerData;
          } else {
            newTrackers[g.id] = { influencers: [] };
          }
        });
        brief.groupTrackers = newTrackers;
      }
    }
  }
});

const newContent = before + JSON.stringify(briefs, null, 2) + ';\n';
fs.writeFileSync('src/data/mockData.js', newContent);
console.log('Done');
