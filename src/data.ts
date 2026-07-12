export interface FlightInfo {
  airline: string;
  flightNumber: string;
  date: string;
  departureTime: string;
  arrivalTime: string;
  from: string;
  to: string;
}

export interface AccommodationInfo {
  name: string;
  address: string;
  postalCode: string;
  features: string;
  airbnbUrl: string;
  mapUrl: string;
}

export interface StopInfo {
  time?: string;
  tag?: string;
  typeBadge?: { text: string; type: 'opt' | 'book' | 'none' };
  title: string;
  desc: string;
  notes?: string;
  gKey: string; // Key for the image gallery
  cap: string;  // Caption
  links?: { label: string; url: string; isBuy?: boolean }[];
}

export interface DayPlan {
  dayText: string;
  dateText: string;
  title: string;
  desc: string;
  isEven?: boolean;
  stops: StopInfo[];
}

export interface FoodCardInfo {
  name: string;
  desc: string;
  mapUrl?: string;
}

export const TRIP_DATES = {
  text: "9/11(五) — 9/16(三) | 6天5夜 | 星宇航空直飛",
  countdownTarget: "2026-09-11T08:30:00"
};

export const FLIGHTS: FlightInfo[] = [
  {
    airline: "星宇航空",
    flightNumber: "JX820",
    date: "9/11(五)",
    departureTime: "08:30",
    arrivalTime: "12:15",
    from: "桃園 TPE",
    to: "大阪關西 KIX"
  },
  {
    airline: "星宇航空",
    flightNumber: "JX823",
    date: "9/16(三)",
    departureTime: "15:10",
    arrivalTime: "17:05",
    from: "大阪關西 KIX",
    to: "桃園 TPE"
  }
];

export const HOTEL: AccommodationInfo = {
  name: "公寓式飯店 11 道頓堀 4",
  address: "大阪市中央區千日前1丁目4-2 〒542-0074 坂町會館",
  postalCode: "542-0074",
  features: "道頓堀商圈 • 全程 5 晚",
  airbnbUrl: "https://www.airbnb.com.tw/rooms/1448998284221332188",
  mapUrl: "https://maps.app.goo.gl/kXBaAFwbuzVtNFkt6"
};

export const DAYS: DayPlan[] = [
  {
    dayText: "第一日",
    dateText: "DAY 1 ・ 9/11 (五)",
    title: "初抵浪速 — 大阪城與新世界",
    desc: "下午抵達，寄放行李後直奔大阪兩大地標，晚上以鰻魚飯與一蘭拉麵開胃。",
    isEven: false,
    stops: [
      {
        tag: "13:00",
        title: "抵達關西國際機場 → 前往市區",
        desc: "出關後直接搭車進大阪市區。接送三選一：kkday 包車接送(約 NT$350/人)、阿姨友人九人座包車(¥22,000/趟，全家一車最方便)、機場巴士(最省但下車後要拖行李走約一公里)。",
        gKey: "kix",
        cap: "關西國際機場",
        links: [
          { label: "機場地圖", url: "https://maps.app.goo.gl/ZpJRQyfnzmjVWXzE7" },
          { label: "kkday 機場接送", url: "https://www.kkday.com/zh-tw/product/129909-japan-kansai-international-airport-private-transfer-to-osaka-kyoto-nara-kobe-nagoya", isBuy: true }
        ]
      },
      {
        time: "午後・下午茶",
        title: "grenier 北濱店",
        desc: "北濱的人氣甜點店，復古閣樓風裝潢。招牌「布蕾千層酥」點餐後才現填卡士達，表面現烤焦糖脆得像玻璃——放完行李先來份下午茶，替旅程甜甜開場。",
        gKey: "grenier",
        cap: "grenier 招牌布蕾千層酥(示意)",
        links: [{ label: "Google 地圖", url: "https://maps.app.goo.gl/NBChgBaZHpzzJnNb7" }]
      },
      {
        time: "午後・景點",
        title: "大阪城",
        desc: "豐臣秀吉一手打造的天下名城。金色鯱魚與白綠相間的天守閣倒映在護城河上，是大阪最經典的一張明信片，城公園散步也非常舒服。",
        gKey: "castle",
        cap: "大阪城",
        links: [{ label: "Google 地圖", url: "https://maps.app.goo.gl/L75fKBn3ukyBD9ZKA" }]
      },
      {
        time: "傍晚・景點",
        title: "通天閣・新世界",
        desc: "昭和味十足的復古街區，霓虹閃爍、串炸店林立。塔下摸摸福神比利肯的腳底，據說會帶來好運。",
        gKey: "tsutenkaku",
        cap: "通天閣・新世界",
        links: [{ label: "Google 地圖", url: "https://maps.app.goo.gl/5RKJBCWd6EnXRRDg6" }]
      },
      {
        time: "夜間・視體力加碼",
        title: "teamLab Botanical Garden Osaka",
        typeBadge: { text: "Optional", type: "opt" },
        desc: "長居植物園的夜間光影展，燈光藝術與真實植物交織成夢幻夜景，適合當作第一天的浪漫句點。(照片為 teamLab 其他展館的光影實景，大阪場氛圍請見官網)",
        gKey: "teamlab",
        cap: "teamLab 光影展(示意)",
        links: [{ label: "Google 地圖", url: "https://maps.app.goo.gl/JfhCjQVq2TxEvyfr8" }]
      },
      {
        time: "晚餐",
        title: "鰻魚飯 Hozenji Yamakazu",
        desc: "法善寺橫丁旁的鰻魚飯老舖，炭火現烤、外皮焦香內裡軟嫩，醬汁滲進每一粒白飯裡。",
        gKey: "unagi",
        cap: "鰻魚飯",
        links: [{ label: "Google 地圖", url: "https://maps.google.com?q=Hozenji%20Yamakazu,%201%20Chome-1-16%20Namba,%20Chuo%20Ward,%20Osaka,%20542-0076%E6%97%A5%E6%9C%AC&ftid=0x6000e7f7c92fc28b:0xc05cbedded0400e7&hl=zh-Hant-US" }]
      },
      {
        time: "宵夜",
        title: "一蘭拉麵 難波御堂筋店",
        desc: "經典豚骨拉麵、一人一格的「味集中」座位。湯頭濃郁的一碗，是日本第一晚最療癒的收尾。",
        gKey: "ichiran",
        cap: "一蘭拉麵",
        links: [{ label: "Google 地圖", url: "https://maps.app.goo.gl/cZU8D56XfpbDUym87" }]
      }
    ]
  },
  {
    dayText: "第二日",
    dateText: "DAY 2 ・ 9/12 (六)",
    title: "和服巡禮 — 神社與商店街",
    desc: "穿上和服拍美照的一天，從最震撼的獅子神社走到全日本最長的商店街。",
    isEven: true,
    stops: [
      {
        time: "早餐",
        title: "Yawaragi 飯糰",
        desc: "現點現捏的日式飯糰專門店，溫熱的米飯配上滿滿的餡料，元氣滿滿地展開一天。",
        gKey: "onigiri",
        cap: "日式飯糰",
        links: [{ label: "Google 地圖", url: "https://maps.app.goo.gl/KHEWeerr7ko3euac8" }]
      },
      {
        time: "上午・景點",
        title: "難波八阪神社",
        desc: "高 12 公尺的巨大獅子殿張著血盆大口，傳說會把厄運一口吞掉、把福氣吸進來。站在獅口前拍照氣勢十足，是大阪最有記憶點的神社。",
        gKey: "yasaka",
        cap: "難波八阪神社",
        links: [{ label: "Google 地圖", url: "https://maps.app.goo.gl/rMa5WupQppLBdmaB7" }]
      },
      {
        time: "上午〜下午",
        title: "和服體驗 Wargo",
        typeBadge: { text: "需預約", type: "book" },
        desc: "媽媽的心願清單！從上百套花色中挑選、由專人著裝與髮型設計，穿著和服漫步街頭，拍下這趟旅程最美的紀念照。",
        gKey: "kimono",
        cap: "和服體驗",
        links: [
          { label: "Google 地圖", url: "https://maps.app.goo.gl/Abjeyn43cKqr3jLXA" },
          { label: "線上預約", url: "https://kyotokimonorental.com/zh-tw", isBuy: true }
        ]
      },
      {
        time: "午餐",
        title: "千代松 勝豬排蓋飯",
        desc: "酥脆炸豬排淋上滑嫩蛋汁蓋在熱飯上，一口下去滿滿的幸福感，是在地人也排隊的丼飯名店。",
        gKey: "katsudon",
        cap: "豬排蓋飯",
        links: [{ label: "Google 地圖", url: "https://maps.app.goo.gl/r19wst14trF5w8zZ6" }]
      },
      {
        time: "下午・景點",
        title: "大鳥大社",
        desc: "和泉國一之宮、日本武尊白鳥傳說的降落之地。千年古社被茂密的「千種森」環抱，古樸的大鳥造本殿寧靜莊嚴。",
        gKey: "otori",
        cap: "大鳥大社",
        links: [{ label: "Google 地圖", url: "https://maps.app.goo.gl/GSJpno3Qc9goj1mz6" }]
      },
      {
        time: "傍晚",
        title: "天神橋筋商店街(天滿市場)",
        desc: "全長 2.6 公里、號稱全日本最長的商店街，約 800 間店舖從章魚燒、可樂餅吃到藥妝伴手禮，傍晚的天滿市場周邊居酒屋也開始熱鬧起來。",
        gKey: "tenjinbashi",
        cap: "天神橋筋商店街",
        links: [{ label: "Google 地圖", url: "https://maps.app.goo.gl/zRTY2aTD4ZK7rtsi6" }]
      }
    ]
  },
  {
    dayText: "第三日",
    dateText: "DAY 3 ・ 9/13 (日)",
    title: "京都一日遊 — 勝尾寺祈福",
    desc: "古都巡禮加上必勝達摩寺，晚上用黑毛和牛壽喜燒犒賞走了一天的雙腿。",
    isEven: false,
    stops: [
      {
        time: "全日",
        title: "京都一日遊",
        desc: "從大阪出發的一日遊行程(Klook 京都・奈良・嵐山方案)，千本鳥居、古寺與竹林老街，配上一份抹茶甜點，把京都的優雅收進相機裡。",
        gKey: "kyoto",
        cap: "京都(千本鳥居・竹林・清水寺)",
        links: [{ label: "Klook 一日遊行程", url: "https://www.klook.com/zh-TW/activity/142228-kyoto-nara-arashiyama-spring-cherry-blossom-day-tour-from-osaka/", isBuy: true }]
      },
      {
        time: "景點",
        title: "勝尾寺",
        desc: "1300 年歷史的「必勝祈願」名寺，滿山遍野的紅色達摩不倒翁塞滿石燈籠、樹枝與欄杆，壯觀又可愛。買一顆勝達摩寫下願望、點上一眼，願望實現再回來點另一眼。",
        notes: "提醒：勝尾寺位於大阪箕面山區(非京都)，與京都行程同日請留意交通動線",
        gKey: "katsuoji",
        cap: "勝尾寺"
      },
      {
        time: "晚餐",
        title: "壽喜燒(黑毛和牛吃到飽)",
        desc: "願望清單達成！油花如霜降的黑毛和牛在甜醬汁裡輕涮幾秒，裹上生蛋液入口即化——而且是吃到飽方案，盡情吃！",
        gKey: "sukiyaki",
        cap: "黑毛和牛壽喜燒",
        links: [{ label: "Google 地圖", url: "https://maps.app.goo.gl/DZXvpaveBcYGkzgg8" }]
      }
    ]
  },
  {
    dayText: "第四日",
    dateText: "DAY 4 ・ 9/14 (一)",
    title: "環球影城 — 全日玩樂衝刺",
    desc: "從開園玩到閉園的一天，攻略詳見下方「環球影城攻略」專區。",
    isEven: true,
    stops: [
      {
        tag: "全日",
        title: "日本環球影城 USJ",
        desc: "哈利波特魔法世界、超級任天堂世界、小小兵樂園⋯⋯亞洲人氣第一的主題樂園。門票與快速通關於 kkday 購買(快通 5 NT$5,500/快通 4 NT$5,100)。午餐在園區主題餐廳用官方 APP 預約；看完夜間遊行、燈光秀後再心滿意足地搭 JR 回道頓堀。",
        notes: "一入園先開 APP 抽任天堂區入場券(無快通時) → 開園直衝哈利波特禁忌之旅 → 再預約餐廳",
        gKey: "usj",
        cap: "日本環球影城",
        links: [
          { label: "Google 地圖", url: "https://maps.app.goo.gl/AxEBuiAkS6qFmBPh6" },
          { label: "kkday 門票+快通", url: "https://www.kkday.com/zh-tw/product/18618-universal-studios-japan-express-pass-osaka", isBuy: true }
        ]
      }
    ]
  },
  {
    dayText: "第五日",
    dateText: "DAY 5 ・ 9/15 (二)",
    title: "梅田購物日 — 燒肉與壽司收尾",
    desc: "最後採購日，兩餐都是重頭戲：敘敘苑燒肉午餐+銀座職人迴轉壽司。",
    isEven: false,
    stops: [
      {
        time: "早餐",
        title: "飯糰",
        desc: "簡單快速的飯糰早餐，把胃口留給中午的燒肉大餐。",
        gKey: "onigiri",
        cap: "日式飯糰",
        links: [{ label: "Google 地圖", url: "https://maps.app.goo.gl/62WEi4G7RbfYiJK39" }]
      },
      {
        time: "上午〜下午",
        title: "梅田商圈",
        desc: "阪急百貨、LUCUA、Grand Front、地下街⋯⋯大阪最大的購物戰區。藥妝、伴手禮、零食一次補齊，別忘了阪急梅田 B1F 的炸咖哩麵包(口袋清單!)。",
        gKey: "umeda",
        cap: "梅田商圈",
        links: [{ label: "Google 地圖", url: "https://maps.app.goo.gl/uyxa3xdeu8dKq9hY8" }]
      },
      {
        time: "午餐 11:30–14:30",
        title: "敘敘苑 LUCUA 大阪店",
        typeBadge: { text: "商業午餐", type: "book" },
        desc: "日本高級燒肉代名詞，用超值的商業午餐價格享受頂級燒肉套餐——願望清單「燒肉」漂亮達成！",
        notes: "商業午餐供應時間 11:30〜14:30(日本時間)，建議開店就入場",
        gKey: "yakiniku",
        cap: "燒肉",
        links: [{ label: "Google 地圖", url: "https://maps.app.goo.gl/cMd1fjUo1ADw41CP8" }]
      },
      {
        time: "晚餐",
        title: "Kaiten Sushi Ginza Onodera",
        desc: "銀座米其林名店推出的迴轉壽司版本，職人水準的握壽司配上親民價格，替這趟旅程的最後一頓晚餐畫下完美句點。",
        gKey: "sushi",
        cap: "握壽司",
        links: [{ label: "Google 地圖", url: "https://maps.app.goo.gl/HzZLAcHM1wSvk4iT9" }]
      }
    ]
  },
  {
    dayText: "第六日",
    dateText: "DAY 6 ・ 9/16 (三)",
    title: "滿載而歸",
    desc: "上午整理行李，中午前往機場，傍晚回到台灣。",
    isEven: true,
    stops: [
      {
        time: "上午",
        title: "道頓堀最後巡禮・退房",
        desc: "把握最後時光和固力果跑跑人合照一張、補買漏掉的伴手禮，回飯店整理行李退房。",
        gKey: "dotonbori",
        cap: "道頓堀"
      },
      {
        tag: "12:00–13:00",
        title: "前往關西國際機場 → 返台",
        desc: "12:00–13:00 抵達機場辦理報到與退稅，15:10 星宇 JX823 起飛，17:05 降落桃園機場——帶著滿滿的戰利品和回憶回家！",
        gKey: "kix2",
        cap: "關西國際機場",
        links: [{ label: "機場地圖", url: "https://maps.app.goo.gl/ZpJRQyfnzmjVWXzE7" }]
      }
    ]
  }
];

export const USJ_RIDES = [
  { no: "01", name: "哈利波特禁忌之旅", tag: "開園首衝" },
  { no: "02", name: "咚奇剛的瘋狂礦車", tag: "快通5指定" },
  { no: "03", name: "好萊塢美夢・乘車遊", tag: "" },
  { no: "04", name: "飛天翼龍", tag: "" },
  { no: "05", name: "大白鯊", tag: "" },
  { no: "06", name: "芙莉蓮(期間限定)", tag: "" },
  { no: "07", name: "小小兵樂園", tag: "" }
];

export const USJ_EXPRESS_MATRIX = {
  headers: ["項目", "快通 5 (Race & Minecart)", "快通 4"],
  rows: [
    { name: "哈利波特園區保證入場", fp5: "●", fp4: "●" },
    { name: "任天堂園區保證入場", fp5: "●", fp4: "●" },
    { name: "哈利波特禁忌之旅", fp5: "●", fp4: "●" },
    { name: "咚奇剛的瘋狂礦車", fp5: "●", fp4: "—" },
    { name: "瑪利歐賽車:庫巴的挑戰書", fp5: "●", fp4: "●" },
    { name: "小小兵瘋狂任務", fp5: "●", fp4: "—" },
    { name: "飛天翼龍", fp5: "●", fp4: "視方案" }
  ]
};

export const POCKET_FOODS: FoodCardInfo[] = [
  { name: "甲賀流章魚燒", desc: "大阪章魚燒名店，外酥內嫩的靈魂小吃", mapUrl: "https://maps.app.goo.gl/8HSvWj7GMgTzitNJ7" },
  { name: "炸串", desc: "新世界名物，記得「醬汁禁止二次沾」的規矩！", mapUrl: "https://maps.app.goo.gl/FsmSCtTn98um39Rc6" },
  { name: "炸和牛吐司", desc: "酥脆吐司夾住粉嫩和牛排的奢華小點", mapUrl: "https://share.google/dN6QqJL79OnWVicPW" },
  { name: "Curry Pan no Hi 炸咖哩麵包", desc: "阪急梅田總店 B1F・大阪市北區角田町8-7" },
  {
    name: "afternoon 千層蛋糕 / HARBS",
    desc: "兩大千層蛋糕擇一(或都吃)",
    mapUrl: "https://share.google/uXhrdl6Wn2amZHpB2" // we'll merge links visually in component
  },
  { name: "Mel Coffee Roasters", desc: "大阪人氣自家烘焙咖啡，外帶散步剛剛好" },
  { name: "L'ESCAMOTEUR BAR", desc: "京都魔術主題酒吧，京都日的夜間彩蛋", mapUrl: "https://share.google/PQU5uv73HJXiWh5VW" },
  { name: "Cinquecento", desc: "心齋橋人氣酒吧，一杯 ¥500 起輕鬆小酌", mapUrl: "https://share.google/bR6KSM2yBPW2MUFUP" },
  { name: "壽喜燒(候補店)", desc: "若 Day 3 沒吃過癮，還可以再來一輪", mapUrl: "https://maps.app.goo.gl/VvkF1xZyKxvnqTvZA" }
];

export const WISHLIST_ITEMS = [
  { id: "w-1", text: "和牛壽喜燒", done: true },
  { id: "w-2", text: "燒肉(敘敘苑)", done: true },
  { id: "w-3", text: "媽媽的和服寫真", done: true },
  { id: "w-4", text: "壽司", done: false },
  { id: "w-5", text: "抹茶", done: false }
];

// Gallery images mapping
export const WIKIMEDIA_GALLERY: Record<string, string[]> = {
  kix: [
    "Kansai International Airport01n4272.jpg",
    "Kansai International Airport Terminal.JPG",
    "Kansai International Airport Departures.JPG"
  ],
  kix2: [
    "Kansai International Airport Departures.JPG",
    "Kansai International Airport Terminal.JPG",
    "Kansai International Airport01n4272.jpg"
  ],
  grenier: [
    "/src/assets/images/grenier_millefeuille_1783831387237.jpg",
    "/src/assets/images/grenier_interior_1783831407059.jpg"
  ],
  castle: [
    "Osaka Castle 02bs3200.jpg",
    "Osaka Castle 01bs3200.jpg",
    "Osaka Castle and pond.jpg",
    "Osaka jo Castle.jpg"
  ],
  tsutenkaku: [
    "View of Tsutenkaku Tower at night.jpg",
    "Tsutenkaku and Shinsekai at night 20110122.jpg",
    "Shinsekai e tsutenkaku.JPG",
    "Tsutenkaku Tower, Shinsekai (44147478362).jpg"
  ],
  teamlab: [
    "At teamLab Planets (48277798316).jpg",
    "Photos at teamlab planets tokyo.jpg",
    "TEAM LAB univers k.jpg",
    "TeamLab Borderless Azabudai Hills.jpg"
  ],
  unagi: [
    "Unadon at an unagi restaurant in Tsukiji by ayustety.jpg",
    "2008-06-07 close-up of unajyuu (heavy eel) on rice.jpg",
    "Eel bowl, bowl of eel and rice; 2013.jpg"
  ],
  ichiran: [
    "Ichiran Ramen.JPG",
    "Ichiran ramenin in Dotonbori, Osaka.JPG",
    "Bar counter of Ichiran ramen by skyseeker in Yokohama.jpg"
  ],
  onigiri: [
    "Japanese rice balls (onigiri).jpg"
  ],
  yasaka: [
    "Namba-Yasaka-Shrine-lions head theater.jpg",
    "Namba-Yasaka-Shrine-entrance with the lions head theater visible in the background.jpg",
    "Front of the Haiden at Namba Yasaka Jinja in Osaka.jpg",
    "Omikuji at Namba Yasaka Jinja, Osaka.jpg"
  ],
  kimono: [
    "Kimono ladies by MissionControl in Pontocho, Kyoto.jpg",
    "Kimono lady at Gion, Kyoto.jpg",
    "2018-05-29 Walking on Kyoto Street.jpg"
  ],
  katsudon: [
    "Katsudon of Fuji-soba.jpg",
    "TareKatsudon Matsuriya.jpg",
    "Katsudon and soba set by shibainu.jpg"
  ],
  otori: [
    "Otori-taisha.jpg",
    "Ōtori-taisha, Worship Hall 001.jpg"
  ],
  tenjinbashi: [
    "Tenjimbashi2 Mall at Night in 201411.JPG",
    "Ôsaka - Tenjin-bashi-suji Shôten-gai.jpg"
  ],
  kyoto: [
    "FushimiInariTorii.jpg",
    "Torii path with lantern at Fushimi Inari Taisha Shrine, Kyoto, Japan.jpg",
    "Bamboo wood Kyoto 2024 2.jpg",
    "A310 Japan Kyoto Kiyomizu Dera Temple (4763808769).jpg"
  ],
  katsuoji: [
    "勝尾寺山門.jpg",
    "勝尾寺奉納棚.jpg",
    "Katsuoji-daruma.jpg",
    "Katuozi01.jpg"
  ],
  sukiyaki: [
    "Sukiyaki 01.jpg",
    "本日の黒毛和牛は (34501934661).jpg",
    "Yamagata Beef for Yakiniku.jpg"
  ],
  usj: [
    "Universal Studios Japan entrance.jpg",
    "Universal Japan.JPG"
  ],
  umeda: [
    "Umeda Sky Building seen from Lucua 202508.jpg",
    "Osaka Umeda Sky Building 1.jpg",
    "Umeda Sky Building from Grand Green Osaka 20250831.jpg"
  ],
  yakiniku: [
    "Yakiniku 002.jpg",
    "Gyu-kaku yakiniku restaurant (20).jpg",
    "Yamagata Beef for Yakiniku.jpg"
  ],
  sushi: [
    "Nigiri Sushi (26478725732).jpg",
    "Nigiri Sushi (26478732232).jpg",
    "Salmon nigiri sushi.jpg"
  ],
  dotonbori: [
    "Glico Man sign, Dotonbori.JPG",
    "The famous Glico-man sign (6453154613).jpg",
    "Dotonbori, Osaka, at night, November 2016.jpg",
    "Neon sign of Dotonbori daytime.JPG"
  ]
};

export const WIKIMEDIA_BASE = "https://commons.wikimedia.org/wiki/Special:FilePath/";

export function getWikimediaUrl(fileName: string, width = 600): string {
  if (
    fileName.startsWith("/src/") ||
    fileName.startsWith("src/") ||
    fileName.startsWith("/assets/") ||
    fileName.startsWith("http://") ||
    fileName.startsWith("https://")
  ) {
    return fileName;
  }
  return `${WIKIMEDIA_BASE}${encodeURIComponent(fileName)}?width=${width}`;
}
