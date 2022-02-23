export const renderEmojis = (text: string): string => {
  if (typeof text !== "string") return text;

  for (let emoji of emojis) {
    text = text.replace(emoji.code, emoji.emoji);
  }
  return text;
};

const emojis = [
  {
    emoji: "🎨",
    entity: "&#x1f3a8;",
    code: ":art:",
  },
  {
    emoji: "⚡️",
    entity: "&#x26a1;",
    code: ":zap:",
  },
  {
    emoji: "🔥",
    entity: "&#x1f525;",
    code: ":fire:",
  },
  {
    emoji: "🐛",
    entity: "&#x1f41b;",
    code: ":bug:",
  },
  {
    emoji: "🚑️",
    entity: "&#128657;",
    code: ":ambulance:",
  },
  {
    emoji: "✨",
    entity: "&#x2728;",
    code: ":sparkles:",
  },
  {
    emoji: "📝",
    entity: "&#x1f4dd;",
    code: ":memo:",
  },
  {
    emoji: "🚀",
    entity: "&#x1f680;",
    code: ":rocket:",
  },
  {
    emoji: "💄",
    entity: "&#ff99cc;",
    code: ":lipstick:",
  },
  {
    emoji: "🎉",
    entity: "&#127881;",
    code: ":tada:",
  },
  {
    emoji: "✅",
    entity: "&#x2705;",
    code: ":white_check_mark:",
  },
  {
    emoji: "🔒️",
    entity: "&#x1f512;",
    code: ":lock:",
  },
  {
    emoji: "🔐",
    entity: "&#x1f510;",
    code: ":closed_lock_with_key:",
  },
  {
    emoji: "🔖",
    entity: "&#x1f516;",
    code: ":bookmark:",
  },
  {
    emoji: "🚨",
    entity: "&#x1f6a8;",
    code: ":rotating_light:",
  },
  {
    emoji: "🚧",
    entity: "&#x1f6a7;",
    code: ":construction:",
  },
  {
    emoji: "💚",
    entity: "&#x1f49a;",
    code: ":green_heart:",
  },
  {
    emoji: "⬇️",
    entity: "⬇️",
    code: ":arrow_down:",
  },
  {
    emoji: "⬆️",
    entity: "⬆️",
    code: ":arrow_up:",
  },
  {
    emoji: "📌",
    entity: "&#x1F4CC;",
    code: ":pushpin:",
  },
  {
    emoji: "👷",
    entity: "&#x1f477;",
    code: ":construction_worker:",
  },
  {
    emoji: "📈",
    entity: "&#x1F4C8;",
    code: ":chart_with_upwards_trend:",
  },
  {
    emoji: "♻️",
    entity: "&#x2672;",
    code: ":recycle:",
  },
  {
    emoji: "➕",
    entity: "&#10133;",
    code: ":heavy_plus_sign:",
  },
  {
    emoji: "➖",
    entity: "&#10134;",
    code: ":heavy_minus_sign:",
  },
  {
    emoji: "🔧",
    entity: "&#x1f527;",
    code: ":wrench:",
  },
  {
    emoji: "🔨",
    entity: "&#128296;",
    code: ":hammer:",
  },
  {
    emoji: "🌐",
    entity: "&#127760;",
    code: ":globe_with_meridians:",
  },
  {
    emoji: "✏️",
    entity: "&#59161;",
    code: ":pencil2:",
  },
  {
    emoji: "💩",
    entity: "&#58613;",
    code: ":poop:",
  },
  {
    emoji: "⏪️",
    entity: "&#9194;",
    code: ":rewind:",
  },
  {
    emoji: "🔀",
    entity: "&#128256;",
    code: ":twisted_rightwards_arrows:",
  },
  {
    emoji: "📦️",
    entity: "&#1F4E6;",
    code: ":package:",
  },
  {
    emoji: "👽️",
    entity: "&#1F47D;",
    code: ":alien:",
  },
  {
    emoji: "🚚",
    entity: "&#1F69A;",
    code: ":truck:",
  },
  {
    emoji: "📄",
    entity: "&#1F4C4;",
    code: ":page_facing_up:",
  },
  {
    emoji: "💥",
    entity: "&#x1f4a5;",
    code: ":boom:",
    semver: "major",
  },
  {
    emoji: "🍱",
    entity: "&#1F371",
    code: ":bento:",
  },
  {
    emoji: "♿️",
    entity: "&#9855;",
    code: ":wheelchair:",
  },
  {
    emoji: "💡",
    entity: "&#128161;",
    code: ":bulb:",
  },
  {
    emoji: "🍻",
    entity: "&#x1f37b;",
    code: ":beers:",
  },
  {
    emoji: "💬",
    entity: "&#128172;",
    code: ":speech_balloon:",
  },
  {
    emoji: "🗃️",
    entity: "&#128451;",
    code: ":card_file_box:",
  },
  {
    emoji: "🔊",
    entity: "&#128266;",
    code: ":loud_sound:",
  },
  {
    emoji: "🔇",
    entity: "&#128263;",
    code: ":mute:",
  },
  {
    emoji: "👥",
    entity: "&#128101;",
    code: ":busts_in_silhouette:",
  },
  {
    emoji: "🚸",
    entity: "&#128696;",
    code: ":children_crossing:",
  },
  {
    emoji: "🏗️",
    entity: "&#1f3d7;",
    code: ":building_construction:",
  },
  {
    emoji: "📱",
    entity: "&#128241;",
    code: ":iphone:",
  },
  {
    emoji: "🤡",
    entity: "&#129313;",
    code: ":clown_face:",
  },
  {
    emoji: "🥚",
    entity: "&#129370;",
    code: ":egg:",
  },
  {
    emoji: "🙈",
    entity: "&#8bdfe7;",
    code: ":see_no_evil:",
  },
  {
    emoji: "📸",
    entity: "&#128248;",
    code: ":camera_flash:",
  },
  {
    emoji: "⚗️",
    entity: "&#128248;",
    code: ":alembic:",
  },
  {
    emoji: "🔍️",
    entity: "&#128269;",
    code: ":mag:",
  },
  {
    emoji: "🏷️",
    entity: "&#127991;",
    code: ":label:",
  },
  {
    emoji: "🌱",
    entity: "&#127793;",
    code: ":seedling:",
  },
  {
    emoji: "🚩",
    entity: "&#x1F6A9;",
    code: ":triangular_flag_on_post:",
  },
  {
    emoji: "🥅",
    entity: "&#x1F945;",
    code: ":goal_net:",
  },
  {
    emoji: "💫",
    entity: "&#x1f4ab;",
    code: ":dizzy:",
  },
  {
    emoji: "🗑️",
    entity: "&#x1F5D1;",
    code: ":wastebasket:",
  },
  {
    emoji: "🛂",
    entity: "&#x1F6C2;",
    code: ":passport_control:",
    description:
      "Work on code related to authorization, roles and permissions.",
  },
  {
    emoji: "🩹",
    entity: "&#x1FA79;",
    code: ":adhesive_bandage:",
  },
  {
    emoji: "🧐",
    entity: "&#x1F9D0;",
    code: ":monocle_face:",
  },
  {
    emoji: "⚰️",
    entity: "&#x26B0;",
    code: ":coffin:",
  },
  {
    emoji: "🧪",
    entity: "&#x1F9EA;",
    code: ":test_tube:",
  },
  {
    emoji: "👔",
    entity: "&#128084;",
    code: ":necktie:",
  },
  {
    emoji: "🩺",
    entity: "&#x1FA7A;",
    code: ":stethoscope:",
  },
  {
    emoji: "🧱",
    entity: "&#x1f9f1;",
    code: ":bricks:",
  },
  {
    emoji: "🧑‍💻",
    entity: "&#129489;&#8205;&#128187;",
    code: ":technologist:",
  },
];
