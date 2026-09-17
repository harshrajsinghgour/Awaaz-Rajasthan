import "dotenv/config";
import mongoose from "mongoose";
import webpush from "web-push";

const MONGODB_URI = process.env.MONGODB_URI;
const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;
const VAPID_SUBJECT = process.env.VAPID_SUBJECT;
const POLL_MS = Math.max(Number(process.env.PUSH_WORKER_POLL_MS || 30000), 10000);

if (!MONGODB_URI) throw new Error("MONGODB_URI is required for push worker");
if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY || !VAPID_SUBJECT) throw new Error("VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY and VAPID_SUBJECT are required for push worker");

webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

const newsSchema = new mongoose.Schema({
  title: String,
  slug: String,
  excerpt: String,
  category: String,
  location: String,
  image: String,
  status: String,
  breaking: Boolean,
  publishedAt: Date
}, { collection: "news", timestamps: true });

const subscriberSchema = new mongoose.Schema({
  endpoint: { type: String, unique: true },
  subscription: mongoose.Schema.Types.Mixed,
  active: Boolean
}, { collection: "subscribers", timestamps: true });

const deliverySchema = new mongoose.Schema({
  newsId: { type: mongoose.Schema.Types.ObjectId, unique: true },
  sentAt: { type: Date, default: Date.now }
}, { collection: "pushdeliveries", timestamps: true });

const News = mongoose.models.PushNews || mongoose.model("PushNews", newsSchema);
const Subscriber = mongoose.models.PushSubscriber || mongoose.model("PushSubscriber", subscriberSchema);
const Delivery = mongoose.models.PushDelivery || mongoose.model("PushDelivery", deliverySchema);

function newsUrl(news) {
  const value = news.slug || news._id;
  return `/news/${encodeURIComponent(String(value))}`;
}

async function sendToSubscribers(news) {
  const subscribers = await Subscriber.find({ active: true }).lean();
  if (!subscribers.length) return { sent: 0, removed: 0 };

  const payload = JSON.stringify({
    title: "🔴 ब्रेकिंग न्यूज़ — आवाज़ राजस्थान",
    body: String(news.title || "राजस्थान की बड़ी खबर") .slice(0, 180),
    url: newsUrl(news),
    tag: `news-${news._id}`,
    renotify: true
  });

  let sent = 0;
  let removed = 0;
  for (const row of subscribers) {
    try {
      await webpush.sendNotification(row.subscription, payload);
      sent += 1;
    } catch (error) {
      if (error?.statusCode === 404 || error?.statusCode === 410) {
        await Subscriber.updateOne({ _id: row._id }, { $set: { active: false } });
        removed += 1;
      } else {
        console.error("Push delivery failed:", error?.statusCode || error?.message || error);
      }
    }
  }
  return { sent, removed };
}

async function processBreakingNews() {
  const since = new Date(Date.now() - 48 * 60 * 60 * 1000);
  const candidates = await News.find({ status: "published", breaking: true, publishedAt: { $gte: since } })
    .sort({ publishedAt: 1, createdAt: 1 })
    .limit(25)
    .lean();

  for (const news of candidates) {
    const alreadySent = await Delivery.exists({ newsId: news._id });
    if (alreadySent) continue;
    const result = await sendToSubscribers(news);
    await Delivery.create({ newsId: news._id });
    console.log(`Push processed for ${news._id}: sent=${result.sent}, removed=${result.removed}`);
  }
}

async function main() {
  await mongoose.connect(MONGODB_URI);
  console.log(`Awaaz Rajasthan push worker started; polling every ${POLL_MS}ms`);
  let running = false;
  const tick = async () => {
    if (running) return;
    running = true;
    try { await processBreakingNews(); } catch (error) { console.error("Push worker cycle failed:", error); }
    finally { running = false; }
  };
  await tick();
  setInterval(tick, POLL_MS);
}

process.on("SIGTERM", async () => { await mongoose.disconnect().catch(() => {}); process.exit(0); });
process.on("SIGINT", async () => { await mongoose.disconnect().catch(() => {}); process.exit(0); });
main().catch(error => { console.error("Push worker failed to start:", error); process.exit(1); });
