"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { chitSchema, chitIdSchema } from "@/types/chit";
import { sendRedemptionEmail } from "@/emails/redemption";

export async function getChits() {
  const supabase = createAdminClient();

  const { data, error } = await supabase
    .from("love_chits")
    .select("*")
    .order("order_index", { ascending: true });

  if (error) {
    return { data: null, error: "Failed to load chits." };
  }

  return { data, error: null };
}

export async function seedChits(): Promise<{ success: boolean; error: string | null }> {
  const supabase = createAdminClient();

  const seedData = [
    {
      title: "Breakfast Date",
      description: "A cozy morning together with pancakes, coffee, and cuddles.",
      emoji: "🥞",
      theme: "#F472B6",
      illustration: null as string | null,
      order_index: 0,
      gif_url: "/breakfast.gif",
    },
    {
      title: "Movie Night",
      description: "Your favorite snacks, a cozy blanket, and the perfect movie.",
      emoji: "🎬",
      theme: "#C4B5FD",
      illustration: null as string | null,
      order_index: 1,
      gif_url: "https://tenor.com/view/meetquack-quack-love-cute-movie-gif-11740606195218597463",
    },
    {
      title: "Unlimited Hugs",
      description: "No limits, no expiration. Hug anytime, anywhere.",
      emoji: "🤗",
      theme: "#BFDBFE",
      illustration: null as string | null,
      order_index: 2,
      gif_url:
        "https://tenor.com/view/hug-couple-cute-milk-and-mocha-in-love-gif-1685630977016691906",
    },
    {
      title: "Video Call Date",
      description: "Dress up, order the same food, and have a date night on call.",
      emoji: "💻",
      theme: "#F472B6",
      illustration: null as string | null,
      order_index: 14,
      gif_url: "https://tenor.com/view/video-call-date-gif-placeholder",
    },
    {
      title: "Surprise Visit",
      description: "Mumbai to Pune, no warning. Just me, showing up at your door.",
      emoji: "🚆",
      theme: "#C4B5FD",
      illustration: null as string | null,
      order_index: 15,
      gif_url: "https://tenor.com/view/train-surprise-visit-gif-placeholder",
    },
    {
      title: "Good Morning Call",
      description: "The first voice you hear, before either of us gets out of bed.",
      emoji: "☀️",
      theme: "#FED7AA",
      illustration: null as string | null,
      order_index: 16,
      gif_url: "https://tenor.com/view/good-morning-call-gif-placeholder",
    },
    {
      title: "Care Package",
      description: "A box full of little things that remind you of me.",
      emoji: "📦",
      theme: "#BFDBFE",
      illustration: null as string | null,
      order_index: 17,
      gif_url: "https://tenor.com/view/care-package-gif-placeholder",
    },
    {
      title: "Virtual Movie Night",
      description: "Same movie, same time, different cities, synced play button.",
      emoji: "🍿",
      theme: "#34D399",
      illustration: null as string | null,
      order_index: 18,
      gif_url: "https://tenor.com/view/virtual-movie-night-gif-placeholder",
    },
    {
      title: "Countdown to Meeting",
      description: "Redeem this to start a countdown to our next Mumbai-Pune meetup.",
      emoji: "📅",
      theme: "#F472B6",
      illustration: null as string | null,
      order_index: 19,
      gif_url: "https://tenor.com/view/countdown-calendar-gif-placeholder",
    },
    {
      title: "Voice Note Marathon",
      description: "A day of just sending each other silly voice notes instead of texts.",
      emoji: "🎙️",
      theme: "#C4B5FD",
      illustration: null as string | null,
      order_index: 20,
      gif_url: "https://tenor.com/view/voice-note-gif-placeholder",
    },
    {
      title: "Plan Our Next Trip",
      description: "An evening on call planning where we'll go next, just us two.",
      emoji: "🗺️",
      theme: "#BFDBFE",
      illustration: null as string | null,
      order_index: 21,
      gif_url: "https://tenor.com/view/plan-trip-map-gif-placeholder",
    },
    {
      title: "Fall Asleep on Call",
      description: "Talking until one of us dozes off mid-sentence, phone still on.",
      emoji: "😴",
      theme: "#FED7AA",
      illustration: null as string | null,
      order_index: 22,
      gif_url: "https://tenor.com/view/sleepy-call-gif-placeholder",
    },
    {
      title: "Shared Playlist",
      description: "One playlist, both of us adding songs that remind us of the other.",
      emoji: "🎵",
      theme: "#34D399",
      illustration: null as string | null,
      order_index: 23,
      gif_url: "https://tenor.com/view/music-playlist-gif-placeholder",
    },
    {
      title: "Massage",
      description: "A relaxing full-body massage, just for you.",
      emoji: "💆",
      theme: "#FED7AA",
      illustration: null as string | null,
      order_index: 3,
      gif_url: "https://tenor.com/view/chibi-cat-mochi-cat-white-cat-mushy-cat-gif-23262669",
    },
    {
      title: "One Surprise",
      description: "A mystery surprise that will make your heart skip a beat.",
      emoji: "🎁",
      theme: "#F472B6",
      illustration: null as string | null,
      order_index: 4,
      gif_url: "https://tenor.com/view/love-nikki-gif-17927817893805860375",
    },
    {
      title: "Ice Cream Date",
      description: "All the ice cream you can eat, with extra sprinkles.",
      emoji: "🍦",
      theme: "#C4B5FD",
      illustration: null as string | null,
      order_index: 5,
      gif_url: "https://tenor.com/view/lick-ice-cream-icecream-yum-yummy-gif-2344819592722143834",
    },
    {
      title: "Shopping Together",
      description: "A fun shopping spree with your favorite person.",
      emoji: "🛍️",
      theme: "#BFDBFE",
      illustration: null as string | null,
      order_index: 6,
      gif_url: "https://tenor.com/view/bags-happy-peace-pengu-penguin-gif-9934582968680410972",
    },
    {
      title: "Drive Anywhere",
      description: "Pick a direction, and let's go on an adventure.",
      emoji: "🚗",
      theme: "#FED7AA",
      illustration: null as string | null,
      order_index: 7,
      gif_url: "https://tenor.com/view/cat-drive-car-cat-monkey-drift-gif-9837406246035022184",
    },
    {
      title: "Cook Together",
      description: "A delicious meal made with love, together.",
      emoji: "👨‍🍳",
      theme: "#34D399",
      illustration: null as string | null,
      order_index: 8,
      gif_url: "https://tenor.com/view/cooking-gif-1758521498144423665",
    },
    {
      title: "One Free Kiss",
      description: "A kiss on demand, any time, any place.",
      emoji: "💋",
      theme: "#F472B6",
      illustration: null as string | null,
      order_index: 9,
      gif_url: "https://tenor.com/view/spams-hun-gif-9178954397992565836",
    },
    {
      title: "Coffee Date",
      description: "A warm cup of coffee and even warmer conversation.",
      emoji: "☕",
      theme: "#C4B5FD",
      illustration: null as string | null,
      order_index: 10,
      gif_url: "https://tenor.com/view/coffee-gif-22247567",
    },
    {
      title: "Game Night",
      description: "Board games, video games, or just games of love.",
      emoji: "🎮",
      theme: "#BFDBFE",
      illustration: null as string | null,
      order_index: 11,
      gif_url: "https://tenor.com/view/loading-fast-gif-5318451511890509753",
    },
    {
      title: "Sleep Call",
      description: "Falling asleep together on a cozy call.",
      emoji: "🌙",
      theme: "#FED7AA",
      illustration: null as string | null,
      order_index: 12,
      gif_url: "https://tenor.com/view/sleeping-gif-17805505014357642230",
    },
    {
      title: "Custom Surprise",
      description: "You name it, and it's yours.",
      emoji: "✨",
      theme: "#34D399",
      illustration: null as string | null,
      order_index: 13,
      gif_url: "https://tenor.com/view/secret-boss-baby-on-the-phone-gif-7991222",
    },
  ];

  // Validate each chit
  for (const chit of seedData) {
    const parsed = chitSchema.safeParse(chit);
    if (!parsed.success) {
      return { success: false, error: `Validation failed: ${parsed.error.issues[0].message}` };
    }
  }

  const { error } = await supabase.from("love_chits").insert(seedData);

  if (error) {
    return { success: false, error: "Failed to seed chits." };
  }

  return { success: true, error: null };
}

export async function redeemChit(
  chitId: string,
): Promise<{ success: boolean; error: string | null }> {
  const parsed = chitIdSchema.safeParse({ id: chitId });
  if (!parsed.success) {
    return { success: false, error: "Invalid chit ID." };
  }

  const supabase = createAdminClient();

  // First check if chit exists and is not already redeemed
  const { data: existing, error: fetchError } = await supabase
    .from("love_chits")
    .select("redeemed, title, description, emoji")
    .eq("id", chitId)
    .single();

  if (fetchError || !existing) {
    return { success: false, error: "Chit not found." };
  }

  if (existing.redeemed) {
    return { success: false, error: "This chit has already been redeemed." };
  }

  const redeemedAt = new Date().toISOString();

  // Mark as redeemed
  const { error: updateError } = await supabase
    .from("love_chits")
    .update({
      redeemed: true,
      redeemed_at: redeemedAt,
    })
    .eq("id", chitId);

  if (updateError) {
    return { success: false, error: "Failed to redeem chit." };
  }

  // Send email notification (fire and forget - don't block the response)
  sendRedemptionEmail({
    chitTitle: existing.title,
    chitEmoji: existing.emoji,
    chitDescription: existing.description,
    redeemedAt,
  }).catch((err) => {
    // Email failure shouldn't block redemption
    console.log("Failed to send redemption email: ", err);
  });

  return { success: true, error: null };
}
