export const cumulativeEmotions = {
  admiration: { frequency: 0, intensity: 0, comments: [] },
  amusement: { frequency: 0, intensity: 0, comments: [] },
  anger: { frequency: 0, intensity: 0, comments: [] },
  annoyance: { frequency: 0, intensity: 0, comments: [] },
  approval: { frequency: 0, intensity: 0, comments: [] },
  caring: { frequency: 0, intensity: 0, comments: [] },
  confusion: { frequency: 0, intensity: 0, comments: [] },
  curiosity: { frequency: 0, intensity: 0, comments: [] },
  desire: { frequency: 0, intensity: 0, comments: [] },
  disappointment: { frequency: 0, intensity: 0, comments: [] },
  disapproval: { frequency: 0, intensity: 0, comments: [] },
  disgust: { frequency: 0, intensity: 0, comments: [] },
  embarrassment: { frequency: 0, intensity: 0, comments: [] },
  excitement: { frequency: 0, intensity: 0, comments: [] },
  fear: { frequency: 0, intensity: 0, comments: [] },
  gratitude: { frequency: 0, intensity: 0, comments: [] },
  grief: { frequency: 0, intensity: 0, comments: [] },
  joy: { frequency: 0, intensity: 0, comments: [] },
  love: { frequency: 0, intensity: 0, comments: [] },
  nervousness: { frequency: 0, intensity: 0, comments: [] },
  optimism: { frequency: 0, intensity: 0, comments: [] },
  pride: { frequency: 0, intensity: 0, comments: [] },
  relief: { frequency: 0, intensity: 0, comments: [] },
  remorse: { frequency: 0, intensity: 0, comments: [] },
  sadness: { frequency: 0, intensity: 0, comments: [] },
  surprise: { frequency: 0, intensity: 0, comments: [] },
  neutral: { frequency: 0, intensity: 0, comments: [] },
  realization: { frequency: 0, intensity: 0, comments: [] },
};

export const allEmotions = [
  "admiration",
  "amusement",
  "anger",
  "annoyance",
  "approval",
  "caring",
  "confusion",
  "curiosity",
  "desire",
  "disappointment",
  "disapproval",
  "disgust",
  "embarrassment",
  "excitement",
  "fear",
  "gratitude",
  "grief",
  "joy",
  "love",
  "nervousness",
  "optimism",
  "pride",
  "relief",
  "remorse",
  "sadness",
  "surprise",
  "neutral",
  "realization",
];
export const sleep = (duration)=>{
        return new Promise((resolve)=>{
            setTimeout(resolve,duration)
        })
}