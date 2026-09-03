// Google Gemini integration for the Travel Companion chat and the itinerary
// generator. Requires VITE_GEMINI_API_KEY. When no key is configured, both
// functions fall back to a local, rule-based generator so the product stays
// fully functional in a demo environment — this mirrors how a real app
// would degrade gracefully rather than showing a dead feature.

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const MODEL = 'gemini-2.0-flash';
const BASE_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`;

async function callGemini(payload) {
  const res = await fetch(`${BASE_URL}?key=${API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error('Gemini request failed');
  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Empty Gemini response');
  return text;
}

// ---------- Travel Companion chat ----------

export async function askCompanion({ destination, history, question }) {
  if (!API_KEY) {
    return localChatFallback(destination, question);
  }

  const systemPrompt = destination
    ? `You are the WANDER Travel Companion, a warm, concise travel expert embedded in a premium travel app. The traveller is currently looking at ${destination.name}, ${destination.country}. Description: ${destination.description}. Notable places: ${destination.places.map((p) => p.name).join(', ')}. Best time to visit: ${destination.bestTime}. Keep answers practical, specific to this destination, and under 120 words. Use plain sentences, no markdown headers.`
    : `You are the WANDER Travel Companion, a warm, concise travel expert embedded in a premium travel app. Keep answers practical and under 120 words. Use plain sentences, no markdown headers.`;

  try {
    const contents = [
      ...history.map((m) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      })),
      { role: 'user', parts: [{ text: question }] },
    ];

    const text = await callGemini({
      system_instruction: { parts: [{ text: systemPrompt }] },
      contents,
      generationConfig: { temperature: 0.7, maxOutputTokens: 300 },
    });
    return text.trim();
  } catch (err) {
    return localChatFallback(destination, question);
  }
}

function localChatFallback(destination, question) {
  const q = question.toLowerCase();
  const name = destination?.name ?? 'your destination';

  if (!destination) {
    return `I can help once you pick a destination — try opening a destination page and asking me something specific, like the best time to visit or what to see in a few days.`;
  }
  if (q.includes('day') || q.includes('long')) {
    return `Most first-time visitors give ${name} three to four days — enough time to see the highlights (${destination.places.slice(0, 2).map((p) => p.name).join(' and ')}) without rushing between them.`;
  }
  if (q.includes('month') || q.includes('when') || q.includes('season') || q.includes('weather')) {
    return `The best window for ${name} is ${destination.bestTime.toLowerCase()} ${destination.climate}`;
  }
  if (q.includes('food') || q.includes('eat')) {
    return `${name} rewards wandering into smaller, local spots rather than the first restaurant you see near a landmark — ask your accommodation for a neighbourhood recommendation, not a tourist-strip one.`;
  }
  if (q.includes('first') || q.includes('beginner') || q.includes('new')) {
    return `${name} is a solid choice for a first visit — it's well signposted, and highlights like ${destination.places[0]?.name} are easy to reach without much planning.`;
  }
  return `${name} is best explored slowly. Start with ${destination.places[0]?.name}, then build the rest of your day around whichever neighbourhood you land in — it rewards a loose plan more than a packed one.`;
}

// ---------- Itinerary generation ----------

const STYLE_COPY = {
  'Slow & Scenic': 'unhurried pacing, one or two anchor activities a day, and time built in to simply sit somewhere beautiful',
  'Culture': 'museums, historic sites, and local traditions, with context given for each stop',
  'Adventure': 'active, outdoor-oriented days with a physical or adrenaline-driven anchor activity',
  'Food': 'meals as the anchor of each day, with markets, local specialities, and a mix of casual and sit-down spots',
  'Romantic': 'quieter, scenic moments for two, with an emphasis on sunset views and intimate dinners',
  'First-time Explorer': 'the essential highlights, paced so a first-time visitor sees the most without feeling rushed',
};

export async function generateItinerary({ destination, days, style }) {
  if (!API_KEY) {
    return localItineraryFallback({ destination, days, style });
  }

  const prompt = `Create a ${days}-day travel itinerary for ${destination.name}, ${destination.country} in a "${style}" travel style (${STYLE_COPY[style] ?? style}).
Known notable places to optionally include: ${destination.places.map((p) => p.name).join(', ')}.
Respond with ONLY valid JSON, no markdown fences, no commentary, matching exactly this shape:
{
  "days": [
    {
      "day": 1,
      "title": "short 2-5 word theme for the day",
      "activities": [
        { "time": "09:00", "title": "short activity name", "description": "one sentence, specific to ${destination.name}", "category": "Food|Landmark|Culture|Nature|Adventure|Rest" }
      ]
    }
  ]
}
Each day should have 4-6 activities spanning morning to evening. Keep descriptions concrete and under 20 words each.`;

  try {
    const text = await callGemini({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.6, maxOutputTokens: 2048, responseMimeType: 'application/json' },
    });
    const cleaned = text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleaned);
    if (!parsed?.days?.length) throw new Error('Malformed itinerary');
    return parsed.days;
  } catch (err) {
    return localItineraryFallback({ destination, days, style });
  }
}

const TIME_SLOTS = ['08:30', '10:30', '13:00', '15:30', '18:00', '20:00'];
const DAY_THEMES = [
  'Arrival & First Impressions',
  'Landmarks & Local Life',
  'Culture & Discovery',
  'Nature & Slower Pace',
  'Hidden Corners',
  'Food & Neighbourhoods',
  'One Last Look',
];

function localItineraryFallback({ destination, days, style }) {
  const places = destination.places;
  const result = [];

  for (let d = 0; d < days; d++) {
    const activities = [];
    const place = places[d % places.length];
    const secondPlace = places[(d + 1) % places.length];

    activities.push({
      time: TIME_SLOTS[0],
      title: d === 0 ? 'Settle in with breakfast' : 'Breakfast near your stay',
      description: `Ease into the day with coffee and something local before heading out.`,
      category: 'Food',
    });
    activities.push({
      time: TIME_SLOTS[1],
      title: `Visit ${place.name}`,
      description: place.description,
      category: place.category === 'Landmark' ? 'Landmark' : place.category,
    });
    activities.push({
      time: TIME_SLOTS[2],
      title: 'Local lunch',
      description: `Pause for a midday meal — look for where locals are actually eating, not just the closest option.`,
      category: 'Food',
    });
    activities.push({
      time: TIME_SLOTS[3],
      title: `Explore ${secondPlace.name}`,
      description: secondPlace.description,
      category: secondPlace.category,
    });
    if (style === 'Adventure') {
      activities.push({ time: TIME_SLOTS[4], title: 'Outdoor activity', description: `An active session to close out the afternoon — hiking, water, or open air, depending on ${destination.name}'s terrain.`, category: 'Adventure' });
    } else if (style === 'Romantic') {
      activities.push({ time: TIME_SLOTS[4], title: 'Sunset viewpoint', description: `Find a quiet spot to watch the light change over ${destination.name}.`, category: 'Nature' });
    } else {
      activities.push({ time: TIME_SLOTS[4], title: 'Wander without a plan', description: `Leave the rest of the afternoon open — the best finds in ${destination.name} are rarely scheduled.`, category: 'Rest' });
    }
    activities.push({
      time: TIME_SLOTS[5],
      title: 'Dinner',
      description: `Close the day with a meal that matches how the day felt — casual after an active day, sit-down after a slow one.`,
      category: 'Food',
    });

    result.push({
      day: d + 1,
      title: DAY_THEMES[d % DAY_THEMES.length],
      activities,
    });
  }

  return result;
}
