/**
 * Database Seed Script
 * Run: npx ts-node scripts/seed.ts
 * Or:  node -r ts-node/register scripts/seed.ts
 */

import mongoose from "mongoose";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI!;

const videoSchema = new mongoose.Schema({
  title: String, description: String, slug: String,
  thumbnail: String, videoUrl: String, hlsUrl: String,
  duration: Number, views: Number, likes: Number, dislikes: Number,
  category: String, tags: [String], gameTitle: String,
  developer: String, publisher: String, platform: [String],
  trailerType: String, status: String, isFeatured: Boolean,
  isTrending: Boolean, downloadUrl: String, resolution: String,
  uploadedBy: mongoose.Schema.Types.ObjectId,
  commentCount: Number, trendingScore: Number,
}, { timestamps: true });

const userSchema = new mongoose.Schema({
  name: String, email: String, password: String,
  image: String, role: String, provider: String,
  watchHistory: [], likedVideos: [], isActive: Boolean,
}, { timestamps: true });

const DEMO_THUMBNAILS = [
  "https://images.igdb.com/igdb/image/upload/t_screenshot_big/sc73y2.jpg",
  "https://images.igdb.com/igdb/image/upload/t_screenshot_big/sc6c43.jpg",
  "https://images.igdb.com/igdb/image/upload/t_screenshot_big/sc6c44.jpg",
  "https://images.igdb.com/igdb/image/upload/t_screenshot_big/sczme.jpg",
];

const DEMO_VIDEOS = [
  {
    title: "God of War Ragnarök — Cinematic Launch Trailer",
    description: "Kratos and Atreus must journey to each of the Nine Realms in search of answers as Asgardian forces prepare for a prophesied battle.",
    gameTitle: "God of War Ragnarök",
    category: "action",
    trailerType: "launch",
    developer: "Santa Monica Studio",
    publisher: "Sony Interactive Entertainment",
    platform: ["PS5", "PS4"],
    isFeatured: true,
    trendingScore: 95,
    views: 2400000,
    likes: 89000,
  },
  {
    title: "Spider-Man 2 — Official Gameplay Reveal",
    description: "Peter Parker and Miles Morales return for an exciting new adventure in the next Marvel's Spider-Man game for PS5.",
    gameTitle: "Marvel's Spider-Man 2",
    category: "action",
    trailerType: "gameplay",
    developer: "Insomniac Games",
    publisher: "Sony Interactive Entertainment",
    platform: ["PS5"],
    isFeatured: true,
    trendingScore: 88,
    views: 5800000,
    likes: 210000,
  },
  {
    title: "Elden Ring — Cinematic Teaser Trailer",
    description: "FromSoftware and George R.R. Martin present a vast, cruel and painterly world.",
    gameTitle: "Elden Ring",
    category: "rpg",
    trailerType: "cinematic",
    developer: "FromSoftware",
    publisher: "Bandai Namco",
    platform: ["PS5", "PS4", "PC", "Xbox"],
    isTrending: true,
    trendingScore: 72,
    views: 8200000,
    likes: 320000,
  },
  {
    title: "Gran Turismo 7 — State of Play Announcement",
    description: "The pinnacle of driving simulation returns. Gran Turismo 7 brings together the very best features of the franchise.",
    gameTitle: "Gran Turismo 7",
    category: "racing",
    trailerType: "announcement",
    developer: "Polyphony Digital",
    publisher: "Sony Interactive Entertainment",
    platform: ["PS5", "PS4"],
    isTrending: true,
    trendingScore: 61,
    views: 1200000,
    likes: 45000,
  },
  {
    title: "Demon's Souls — PS5 Remake Reveal",
    description: "A complete remake of the PlayStation classic — rebuilt from the ground up. A brutal world awaits.",
    gameTitle: "Demon's Souls",
    category: "rpg",
    trailerType: "announcement",
    developer: "Bluepoint Games",
    publisher: "Sony Interactive Entertainment",
    platform: ["PS5"],
    trendingScore: 55,
    views: 3400000,
    likes: 130000,
  },
  {
    title: "Returnal — Accolades Trailer",
    description: "The critically acclaimed PS5 exclusive. An ever-changing world. A cycle of death and resurrection.",
    gameTitle: "Returnal",
    category: "shooter",
    trailerType: "launch",
    developer: "Housemarque",
    publisher: "Sony Interactive Entertainment",
    platform: ["PS5"],
    trendingScore: 48,
    views: 890000,
    likes: 32000,
  },
  {
    title: "Ghostwire Tokyo — Gameplay Walkthrough",
    description: "Tokyo's population has vanished and deadly supernatural forces stalk the streets.",
    gameTitle: "Ghostwire: Tokyo",
    category: "action",
    trailerType: "gameplay",
    developer: "Tango Gameworks",
    publisher: "Bethesda Softworks",
    platform: ["PS5"],
    trendingScore: 42,
    views: 670000,
    likes: 24000,
  },
  {
    title: "Horizon Forbidden West — Launch Trailer",
    description: "Aloy must brave the Forbidden West — a majestic but dangerous frontier filled with new enemies.",
    gameTitle: "Horizon Forbidden West",
    category: "adventure",
    trailerType: "launch",
    developer: "Guerrilla Games",
    publisher: "Sony Interactive Entertainment",
    platform: ["PS5", "PS4"],
    isFeatured: true,
    trendingScore: 78,
    views: 4100000,
    likes: 156000,
  },
];

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    const User = mongoose.models.User || mongoose.model("User", userSchema);
    const Video = mongoose.models.Video || mongoose.model("Video", videoSchema);

    // Create admin user
    let admin = await User.findOne({ email: "admin@ps5trailers.com" });
    if (!admin) {
      admin = await User.create({
        name: "PS5 Admin",
        email: "admin@ps5trailers.com",
        password: "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBTuqLYO1JZIJq", // "admin123456"
        role: "admin",
        provider: "credentials",
        isActive: true,
        image: null,
        watchHistory: [],
        likedVideos: [],
      });
      console.log("✅ Admin user created: admin@ps5trailers.com / admin123456");
    }

    // Create videos
    for (const [i, videoData] of DEMO_VIDEOS.entries()) {
      const slug = videoData.gameTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + videoData.trailerType;
      const exists = await Video.findOne({ slug });
      if (!exists) {
        const thumbnail = DEMO_THUMBNAILS[i % DEMO_THUMBNAILS.length];
        await Video.create({
          ...videoData,
          slug,
          thumbnail,
          videoUrl: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
          hlsUrl: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
          duration: Math.floor(Math.random() * 180) + 60,
          status: "published",
          uploadedBy: admin._id,
          resolution: "1080p",
          commentCount: Math.floor(Math.random() * 500),
          downloadUrl: null,
          tags: [videoData.category, "ps5", "trailer", videoData.gameTitle.toLowerCase().split(" ")[0]],
          dislikes: Math.floor((videoData.likes || 0) * 0.03),
          lastTrendingUpdate: new Date(),
        });
        console.log(`✅ Created: ${videoData.title}`);
      } else {
        console.log(`⏭️  Skipped (exists): ${videoData.title}`);
      }
    }

    console.log("\n🎉 Seed complete!");
    console.log("👤 Admin login: admin@ps5trailers.com / admin123456");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  }
}

seed();
