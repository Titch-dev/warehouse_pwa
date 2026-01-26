export const openingTimes = {
    0: { start: "12:00", end: "21:00" }, // Sunday
    1: { start: "12:00", end: "00:00" }, // Monday
    2: { start: "12:00", end: "00:00" }, // Tuesday
    3: { start: "12:00", end: "02:00" }, // Wednesday
    4: { start: "12:00", end: "00:00" }, // Thursday
    5: { start: "12:00", end: "02:00" }, // Friday
    6: { start: "12:00", end: "02:00" }, // Saturday
}

export const events = [
    {
        id: 1,
        title: "Karaoke",
        description: `Get ready to hit the stage and belt out your favorite 
        tunes at our Karaoke Night! Whether you're a shower singer 
        or a rockstar in the making, this is your chance to shine. 
        Grab a mic, enjoy awesome drinks, and vibe with a crowd that 
        loves a good time. No judgment—just pure fun!`,
        start: "2025-12-05T19:00:00Z",
        end: "2025-12-05T22:00:00Z",
        price: 0,
        img: '/assets/events/karaoke_event.png',
        alt: "Karaoke poster"
    },
    {
        id: 2,
        title: "Fashionistas",
        description: `Strut your style and own the night at Fashionista—the 
        ultimate fusion of fashion and beats. Join the city’s trendsetters 
        and dance to the electrifying sounds of DJ Jayytentacion, spinning 
        everything from hip-hop to house. Dress to impress, vibe hard, and 
        let your fit speak louder than words. `,
        start: "2025-12-10T10:00:00Z",
        end: "2025-12-10T23:30:00Z",
        price: 0,
        img: '/assets/events/fashionista_event.png',
        alt: "Fashionista poster"
    },
    {
        id: 3,
        title: "Comedy Night",
        description: `Ready for a night of nonstop laughs? Join us for Comedy 
        Night, where the punchlines are sharp and the vibes are unmatched. 
        Featuring the hilarious Kwanda Radebe, the quick-witted Liam Whitcher, 
        and a killer lineup of rising stars, this is your midweek serotonin 
        boost – good drinks, great jokes, and even better company.`,
        start: "2025-12-14T19:00:00Z",
        end: "2025-12-14T23:00:00Z",
        price: 60,
        img: '/assets/events/comedy_night_event.png',
        alt: "Comedy night poster"
    },
    {
        id: 4,
        title: "Ladies' Night",
        description: `This Friday, grab your girls and get ready to turn up 
        the glam at Ladies' Night! We’re serving up signature cocktails, 
        smooth beats, and an electric atmosphere made for dancing, laughing, 
        and letting loose. Whether you're celebrating something or just need 
        a night out, this is your perfect excuse!`,
        start: "2025-12-22T19:00:00Z",
        end: "2025-12-22T01:00:00Z",
        price: 0,
        img: '/assets/events/ladies_night_event.png',
        alt: "Ladies' night poster"
    },

]

// Warehouse specials image

export const specialsDrink = [
    {
        id: 4,
        img: '/assets/specials/drink/tuesday.webp',
        title: 'Tequila Tuesday!',
        day: 'Tuesday',
        offers: [
            {
                offer: '2 x Cactus Jacks',
                price: 25
            },
            {
                offer: '2 x Jose Cuervos',
                price: 47
            }
        ]
    },
    {
        id: 5,
        img: '/assets/specials/drink/wednesday.webp',
        title: 'Wednesday Combo',
        day: 'Wednesday',
        offers: [
            {
                offer: '1 Craft Beer & 1 Sng On Tap Cocktail',
                price: 60
            },
            {
                offer: '1 Craft Beer & 1 Dbl On Tap Cocktail',
                price: 70
            }
        ]
    },
    {
        id: 6,
        img: '/assets/specials/drink/thursday.webp',
        title: 'Thirsty Thursdays',
        day: 'Thursday',
        offers: [
            {
                offer: 'Double Cocktail',
                price: 40
            },
            {
                offer: '4 x Jager Bombs',
                price: 125
            },
            {
                offer: '2 x Blowjobs',
                price: 40
            },
            {
                offer: '2 x Dirty Rascals',
                price: 40
            }
        ]
    },
    {
        id: 7,
        img: '/assets/specials/drink/saturday.webp',
        title: 'Student Night',
        day: 'Saturday',
        offers: [
            {
                offer: '10 x Sours',
                price: 99
            },
            {
                offer: '4 x Jager Bombs',
                price: 130
            },
            {
                offer: '4 x Hog Bombs',
                price: 115
            },
            {
                offer: 'Dble On Tap Cocktail',
                price: 36
            }
        ]
    },
    
]

export const specialsFood= [
    {
        id: 1,
        img: '/assets/specials/food/tuesday.webp',
        title: "Twos days Tuesdays",
        day: 'Tuesday',
        offers: [
            {
                offer: 'Get a 2nd side for free when ordering any main with a side',
                price: ''
            }
        ]
    },
    {
        id: 2,
        img: '/assets/specials/food/wednesday.webp',
        title: "Stackin' Wednesdays",
        day: 'Wednesday',
        offers: [
            {
                offer: 'Any beef burger gets an extra stack for free',
                price: ''
            }
        ]
    },
    {
        id: 3,
        img: '/assets/specials/food/thursday.webp',
        title: 'Rib Tickler',
        day: 'Thursday',
        offers: [
            {
                offer: 'One free OTD drink with any rib order',
                price: ''
            }
        ]
    },
]

export const galleryList = [
  {id:1, src: "/assets/gallery/wh_gal_1.png"},
  {id:2, src: "/assets/gallery/wh_gal_2.png"},
  {id:3, src: "/assets/gallery/wh_gal_3.png"},
  {id:4, src: "/assets/gallery/wh_gal_4.png"},
  {id:5, src: "/assets/gallery/wh_gal_5.png"},
  {id:6, src: "/assets/gallery/wh_gal_6.png"},
  {id:7, src: "/assets/gallery/wh_gal_7.png"},
  {id:8, src: "/assets/gallery/wh_gal_8.png"},
  {id:9, src: "/assets/gallery/wh_gal_9.png"},
  {id:10, src: "/assets/gallery/wh_gal_10.png"},
  {id:11, src: "/assets/gallery/wh_gal_11.png"},
  {id:12, src: "/assets/gallery/wh_gal_12.png"},
  {id:13, src: "/assets/gallery/wh_gal_13.png"},
  {id:14, src: "/assets/gallery/wh_gal_14.png"},
]

const event_firestore = {
    title: "Live Jazz Night",
    description: "Join us for live jazz music and cocktails.",
    startTime: 'firebase.firestore.Timestamp',
    endTime: 'firebase.firestore.Timestamp',  // optional
    imageUrl: "gs://bucket/path/to/image.jpg",
    price: 0.0,
    isRecurring: true,
    recurrence: {
        frequency: "weekly",  // or "monthly" if you expand later
        dayOfWeek: 5  // 0 = Sunday, 6 = Saturday
    },
    createdAt: 'firebase.firestore.FieldValue.serverTimestamp()',
    updatedAt: 'firebase.firestore.FieldValue.serverTimestamp()'
}



export const food = [
    {
        id: 1,
        category: "Burgers",
        items: [
            {
                id: 11,
                itemName: "Lonestar Stack",
                itemDesc: "Our beef patty comes with lettuce, pickled onion, and a slather of our house-made burger sauce.",
                itemDiet: "meat",
                itemDenom: ["Single", "Double", "Triple"],
                itemPrice: [51, 75, 97],
                itemSides: 26,
                itemCheese: null
            },
            {
                id: 12,
                itemName: "Cheesy Texan",
                itemDesc: "Melted cheese, juicy beef patty, layered with crunchy lettuce, pickled onions and a rich burger sauce.",
                itemDiet: "meat",
                itemDenom: ["Single", "Double", "Triple"],
                itemPrice: [61, 92, 115],
                itemSides: 26,
                itemCheese: null
            },
            {
                id: 13,
                itemName: "Tumbleweed Veggie Star",
                itemDesc: "This plant-based patty is grilled to perfection, tucked in a soft bun, and served just the way nature intended - uncomplicated.",
                itemDiet: "vegetarian",
                itemDenom: ["Single", "Double", "Triple"],
                itemPrice: [61, 92, 115],
                itemSides: 26,
                itemCheese: [10, 18, 25]
            },
            {
                id: 14,
                itemName: "The Southern Sizzler",
                itemDesc: "Juicy fried chicken marinated in buttermilk and coated in crunch. Topped with pickle slices, red onion, lettuce, and a fiery-sweet sauce.",
                itemDiet: "meat",
                itemPrice: [57],
                itemSides: 26,
                itemCheese: null
            },
            {
                id: 15,
                itemName: "Bacon Wrangler",
                itemDesc: "Beef, crispy bacon, cheese, lettuce, pickled onions and a hit of our burger sauce.",
                itemDiet: "meat",
                itemDenom: ["Single", "Double", "Triple"],
                itemPrice: [69, 107, 149],
                itemSides: 26,
                itemCheese: null
            },

        ]
    },
    {
        id: 2,
        category: "Chicken",
        items: [
            {
                itemName: "Ranchfire chicken strips",
                itemDesc: "Crispy chicken strips marinated in tangy buttermilk and coated with a southern spice blend - fried to perfection.",
                itemPrice: [56],
                itemSides: 26
            },
            {
                itemName: "Buttermilk Blazing Bites",
                itemDesc: "Chicken bites soaked in rich buttermilk and coated with a bold southern blend of spices with a crispy edge and a peppery kick.",
                itemDenom: ["100g", "300g"],
                itemPrice: [32, 81],
                itemSides: 26
            },
        ],
        itemDip: [
            {
                itemName: "Smokey Texan BBQ",
                itemHeat: 1,
                itemPrice: 13
            },
            {
                itemName: "Sweet Chilli & Lime",
                itemHeat: 0,
                itemPrice: 17
            },
            {
                itemName: "Creamy Sriracha",
                itemHeat: 0,
                itemPrice: 21
            },
            {
                itemName: "Sticky Sweet",
                itemHeat: 0,
                itemPrice: 31
            }
        ]
    },
    {
        id: 3,
        category: "Ribs",
        items: [
            {
                itemName: "Cowboys Corn Ribs",
                itemDesc: "Corn Ribs with a crispy outside and juicy inside. Serves with either a creamy sriracha or sweet chilli & lime dip.",
                itemDiet: "vegetarian",
                itemHeat: 0,
                itemPrice: [66],
                itemSides: 26
            },
            {
                itemName: "Houston Heat Wave Ribs",
                itemDesc: "Marinated pork ribs cooked with a sweet and spicy dry rub.",
                itemDiet: "meat",
                itemHeat: 1,
                itemDenom: ["300g", "600g", "900g"],
                itemPrice: [100, 191, 284],
                itemSides: 26
            },
            {
                itemName: "Smoked Texan BBQ",
                itemDesc: "Glazed with our Spicy Texan BBQ Sauce.",
                itemDiet: "meat",
                itemHeat: 1,
                itemDenom: ["300g", "600g", "900g"],
                itemPrice: [94, 179, 266],
                itemSides: 26
            },
            {
                itemName: "The Dallas Dusk Ribs",
                itemDesc: "Sweet southerndry rub. Served with a honey dipper.",
                itemDiet: "meat",
                itemHeat: 0,
                itemDenom: ["300g", "600g", "900g"],
                itemPrice: [106, 203, 286],
                itemSides: 26
            },
            {
                itemName: "Big Tex Glazed BBQ Ribs",
                itemDesc: "Smothered in our signature big tex BBQ glaze.",
                itemDiet: "meat",
                itemHeat: 0,
                itemDenom: ["300g", "600g", "900g"],
                itemPrice: [99, 189, 281],
                itemSides: 26
            },
            {
                itemName: "Crunch Back Ribs",
                itemDesc: "Corn coated and deep fried, served with a spicy tabasco sauce.",
                itemDiet: "meat",
                itemHeat: 1,
                itemDenom: ["300g", "600g", "900g"],
                itemPrice: [137, 266, 397],
                itemSides: 26
            },

        ]
    },
    {
        id: 4,
        category: "Sides",
        items: [
            {
                itemName: "Coleslaw",
                itemDesc: "Shredded Cabbage and carrots tossed in a creamy, tangy dressing with justy the right hint of sweetness",
                itemDiet: "vegetarian",
                itemPrice: [30]
            },
            {
                itemName: "Smashed Potato Salad",
                itemDesc: "Smashed potatoes with herbs and a mustard mayo",
                itemDiet: "vegetarian",
                itemPrice: [30]
            },
            {
                itemName: "Cornribs Side",
                itemDesc: "Served with either a creamy Sriracha drizzle or a sweet chilli and lime drizzle",
                itemDiet: "vegetarian",
                itemPrice: [33]
            },
            {
                itemName: "Fries",
                itemDesc: "Crispy golden fries tossed in our bold signature spice blend",
                itemDiet: "vegetarian",
                itemDenom: ["Small", "Large"],
                itemPrice: [30, 45]
            },
        ]
    }
]

export const drinks = [
    {
        id: 1,
        category: "Craft Beers",
        items: [
            {
                itemName: "Lupulin Shift Disorder",
                itemDesc: "Are you tough enough for this bold beer?",
                itemBrewery: "That Brewing Company",
                itemDenom: ["340ml","500ml"],
                itemPrice: [48, 67],
                itemImage: 'assets/menus/emblems/TBC-lupulin.webp',
                itemImageAlt: "Drinks emblem"
            },
            {
                itemName: "That Blonde",
                itemDesc: "A light, gold, crisp and refreshing ale made for session drinking",
                itemBrewery: "That Brewing Company",
                itemDenom: ["340ml","500ml", "1 ltr"],
                itemPrice: [36, 50, 91],
                itemImage: '/assets/menus/emblems/TBC-that-blonde-ale.webp',
                itemImageAlt: "Drinks emblem"
            },
            {
                itemName: "El' Juicy",
                itemDesc: "The most swahbuckling on tap beer there ever was",
                itemBrewery: "That Brewing Company",
                itemDenom: ["340ml","500ml"],
                itemPrice: [44, 62],
                itemImage: '/assets/menus/emblems/TBC-el-juicy.webp',
                itemImageAlt: "Drinks emblem"
            },
            {
                itemName: "Back Alley Brew",
                itemDesc: "Defined by its rich rewarding chill brew fromm Langtons brewery.",
                itemBrewery: "Langtons",
                itemDenom: ["340ml","500ml", "1 ltr"],
                itemPrice: [25, 35, 65],
                itemImage: '/assets/menus/emblems/L-back-alley-brew.webp',
                itemImageAlt: "Drinks emblem"
            },
            {
                itemName: "Oktoberfest Lager",
                itemDesc: "A refreshing any time any day beer that satisfies with every sip",
                itemBrewery: "That Brewing Company",
                itemDenom: ["340ml","500ml", "1 ltr"],
                itemPrice: [37, 54, 103],
                itemImage: '/assets/menus/emblems/TBC-oktoberfest.webp',
                itemImageAlt: "Drinks emblem"
            },
        ]
    },
    {
        id: 2,
        category: "Pre-mixed",
        items: [
            {
                itemName: "Kiwi Melon Twist",
                itemDesc: "Kiwi and watermelon delish",
                itemBrewery: "OTD",
                itemDenom: ["Single", "Double"],
                itemPrice: [42, 56],
                itemImage: '/assets/menus/emblems/OTD-kiwi-melon.webp',
                itemImageAlt: "Drinks emblem"
            },
            {
                itemName: "Strawberry Lime Twist",
                itemDesc: "Sweet and tart, just like my heart",
                itemBrewery: "OTD",
                itemDenom: ["Single", "Double"],
                itemPrice: [45, 57],
                itemImage: '/assets/menus/emblems/OTD-strawberry-lime.webp',
                itemImageAlt: "Drinks emblem"
            },
            {
                itemName: "Watermelon Breeze",
                itemDesc: "A delectable sparkler will keep you pleasantly refreshed",
                itemBrewery: "OTD",
                itemDenom: ["Single", "Double"],
                itemPrice: [41, 51],
                itemImage: '/assets/menus/emblems/OTD-watermelon-breeze.webp',
                itemImageAlt: "Drinks emblem"
            },
            {
                itemName: "Jamaican Me Crazy",
                itemDesc: "Cocnut, pineapple and banana flavour rum cocktail, for when you're feeling the Carribean vibes",
                itemBrewery: "OTD",
                itemDenom: ["Single", "Double"],
                itemPrice: [56, 66],
                itemImage: '/assets/menus/emblems/OTD-jamaican-me-crazy.webp',
                itemImageAlt: "Drinks emblem"
            },
            {
                itemName: "Gin and Tonic",
                itemDesc: "Just pure ice cold low calorie enjoyment. Perfect any day, any time.",
                itemBrewery: "OTD",
                itemDenom: ["Single", "Double"],
                itemPrice: [37, 56],
                itemImage: '/assets/menus/emblems/OTD-gin-tonic.webp',
                itemImageAlt: "Drinks emblem"
            },
            {
                itemName: "Brandy and Coke",
                itemDesc: "Flowing ice cold straight from our tap. Perfect at the end of the day when you want to chill with mates",
                itemBrewery: "OTD",
                itemDenom: ["Double"],
                itemPrice: [40],
                itemImage: '/assets/menus/emblems/OTD-brandy-coke.webp',
                itemImageAlt: "Drinks emblem"
            },
            {
                itemName: "Spiced Gold and Coke",
                itemDesc: "This refreshing masterpiece is only served as a double, just the way the captain likes it",
                itemBrewery: "OTD",
                itemDenom: ["Double"],
                itemPrice: [40],
                itemImage: '/assets/menus/emblems/OTD-spiced-gold.webp',
                itemImageAlt: "Drinks emblem"
            },
            {
                itemName: "Rum and Strawberry",
                itemDesc: "Rum and strawberry for that yummy sweet deliciousness",
                itemBrewery: "OTD",
                itemDenom: ["Double"],
                itemPrice: [46],
                itemImage: '/assets/menus/emblems/OTD-rum-strawberry.webp',
                itemImageAlt: "Drinks emblem"
            },
            {
                itemName: "Coke on tap",
                itemDesc: "Refreshing ice cold coca cola on tap",
                itemBrewery: "OTD",
                itemDenom: ["Regular"],
                itemPrice: [19],
                itemImage: '/assets/menus/emblems/OTD-coca-cola.webp',
                itemImageAlt: "Drinks emblem"
            },
            {
                itemName: "Apple Bomb",
                itemDesc: "A sweet apple creation, with a playful vodka kick",
                itemBrewery: "OTD",
                itemDenom: ["Single", "Double"],
                itemPrice: [41, 51],
                itemImage: '/assets/menus/emblems/OTD-apple-bomb.webp',
                itemImageAlt: "Drinks emblem"
            },
            {
                itemName: "Cherry Bomb",
                itemDesc: "A sweet and sour creation, with a playful vodka kick",
                itemBrewery: "OTD",
                itemDenom: ["Single", "Double"],
                itemPrice: [39, 48],
                itemImage: '/assets/menus/emblems/OTD-cherry-bomb.webp',
                itemImageAlt: "Drinks emblem"
            },
            {
                itemName: "Punch Berry",
                itemDesc: "When you want to look and feel like a million bucks",
                itemBrewery: "OTD",
                itemDenom: ["Single", "Double"],
                itemPrice: [37, 49],
                itemImage: '/assets/menus/emblems/OTD-punch-berry.webp',
                itemImageAlt: "Drinks emblem"
            }
        ]
    },
    {
        id: 3,
        category: "Cocktails",
        items: [
            {
                itemName: "Sex On The Beach",
                itemDesc: "A combination of vodka, peach schnapps, orange, and cranberry juice",
                itemPrice: [65]
            },
            {
                itemName: "Gin Blush",
                itemDesc: "Gin and tonic with a splash of cranberry and raspberry",
                itemPrice: [68]
            },
            {
                itemName: "White Russian",
                itemDesc: "A perfect creamy combination of coffee liqeur, vodka, and cream",
                itemPrice: [72]
            },
            {
                itemName: "Long Island Iced Tea",
                itemDesc: "5 white spirits shaken and topped with a splash of coke",
                itemPrice: [76]
            },
            {
                itemName: "Mango Peach Sangria",
                itemDesc: "Sweet or dry white wine, shaken with peach schnapps and a splash of mango syrup",
                itemPrice: [79]
            },
            {
                itemName: "Dark and stormy",
                itemDesc: "Exactly what it sounds like. Dark rum and ginger ale with a splash of bitters",
                itemPrice: [79]
            },
            {
                itemName: "California Iced Tea",
                itemDesc: "5 white spirits shaken, topped with cranberry and orange juice",
                itemPrice: [88]
            },
        ]
    },
    {
        id: 4,
        category: "Shooters",
        items: [
            {
                itemName: "Springbok",
                itemPrice: [22]
            },
            {
                itemName: "Blowjob",
                itemPrice: [24]
            },
            {
                itemName: "Rascal",
                itemPrice: [24]
            },
            {
                itemName: "Dirty Rascal",
                itemPrice: [26]
            },
            {
                itemName: "Chocolate Cake",
                itemPrice: [25]
            },
            {
                itemName: "Suitcase",
                itemPrice: [39]
            },
            {
                itemName: "Briefcase",
                itemPrice: [39]
            },
            {
                itemName: "Cactus Jack Triple",
                itemPrice: [42]
            },
            {
                itemName: "2 Shots Pancake",
                itemPrice: [44]
            },
            {
                itemName: "2 Shots Cajun Fireball",
                itemPrice: [64]
            },
        ]
    }
]

export const fb_events =
{
  "data": [
    {
      "id": "1364578491354635",
      "name": "DEATHSTRIKE",
      "start_time": "2026-02-06T18:00:00+0200",
      "place": {
        "name": "The Westville Warehouse",
        "location": {
          "city": "Westville",
          "country": "South Africa",
          "latitude": -29.835058,
          "longitude": 30.915234,
          "street": "48A Buckingham terrace",
          "zip": "3629"
        },
        "id": "2031566960468299"
      },
      "cover": {
        "offset_x": 50,
        "offset_y": 50,
        "source": "https://scontent-man2-1.xx.fbcdn.net/v/t39.30808-6/597387615_1498739652256712_7940734345737656692_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=9e60e4&_nc_ohc=g9uD37OhJt0Q7kNvwF-jaKP&_nc_oc=Adni7aJIuwJJTD-7L9nkwff1J0iIl7ZpUZOqNMXhzBC4lTe8P9jVOmTZTxQa-s7bScI&_nc_zt=23&_nc_ht=scontent-man2-1.xx&edm=ABTKTjYEAAAA&_nc_gid=2wmOfyedEMjsKcJFOhT0JA&_nc_tpa=Q5bMBQFpXflKsFKSnLU2rcfvDPPhZn5p5uqqFJMvnIjEXc6E5DyXw9lS67uxxOd5yXfu3P6HUmTRosDS0Q&oh=00_AfqVuWaT28FGaeaNFInLKPaITAcjXcT_I_AcQ3jMrtlaXA&oe=6973997C",
        "id": "1498739622256715"
      },
      "description": "Devilnest presents: DEATHSTRIKE 6th of February 2026 The Westville Warehouse, Durban  Debuting in Durban, the Almighty DOOMTRIGGER from Cape Town will be accompanied by Pretoria's groundbreakers No Closure this summer. Your Cynical Sanity will be kicking off this hellish event followed by Imperious Vision to get you warmed up for the chaos that will ensue by the metal scenes provincial brethren bands. Early bird tickets are available, grab some before the holidays end! https://www.quicket.co.za/events/353648-deathstrike/" 
      },
      {
      "id": "855377190633107",
      "name": "Beats, Beer and Burgers",
      "start_time": "2026-01-31T12:00:00+0200",
      "place": {
        "name": "48A Buckingham terrace, 3629 Westville, South Africa"
      },
      "cover": {
        "offset_x": 50,
        "offset_y": 50,
        "source": "https://scontent-man2-1.xx.fbcdn.net/v/t39.30808-6/615945657_1373679297882105_8099737466471236707_n.jpg?_nc_cat=110&ccb=1-7&_nc_sid=9e60e4&_nc_ohc=SQoonx1dp-8Q7kNvwHO_dWi&_nc_oc=AdlYGESesobN5LfdMWgZfy83VsJMGuQFROaWB7KVyzvmQdIiIIGBig_rTtqa67yh254&_nc_zt=23&_nc_ht=scontent-man2-1.xx&edm=ABTKTjYEAAAA&_nc_gid=2wmOfyedEMjsKcJFOhT0JA&_nc_tpa=Q5bMBQFg0SpSX4T9tmiBvVdtxY580n7Q6f1ylSovYInYfxC5knMg_6FJqXojdcJebPRp6nfXFwfwb5fGnw&oh=00_Afo_OE5UX2MRnzNMu08xOvRpuDYIszOM0Jw0CHfWonZSaQ&oe=69739739",
        "id": "1373679294548772"
      },
      "description": "🎶🍺🍔 Beats, Beer & Burgers! 🍔🍺🎶 Get ready, Westville — the ultimate day-to-night experience is here! 🔥 Beats, Beer & Burgers brings together everything you love in one epic festival: live bands 🎸, ice-cold craft beer 🍻, custom gourmet burgers 🍔, and DJs 🎧 who’ll keep the energy flowing long after the sun goes down 🌅➡️🌙 Spend the day soaking up live performances from local and guest artists 🎤, sip your way through a curated selection of craft brews 🍺, and build the perfect burger exactly the way you like it 🤤🔥. As evening hits, the festival transforms — the lights drop 💡, the DJs take over 🎶and the dance floor comes alive 💃🕺 Whether you’re here for the music 🎵, the food 🍔, the vibes ✨, or all three, Beats, Beer & Burgers is Westville’s newest signature celebration of flavour, sound, and community ❤️ What to Expect 👇 • 🍔 Burger Bar – Custom burger that will feed your soul • 🍺 Local Craft Beer – Featuring the best local breweries • 🎸 Live Bands by Day  • 🎧 DJs by Night – House, Afro, EDM & Commercial • 🛋️ Chill Zones & Social Spaces – Perfect for friends, families & good vibes • 👧🧒 Kids under 12 free entrance 📍 Location: The Westville Warehouse, 48a Buckingham Terrace, Westville 📅 Date: 31 Jan 🕒 Time: Day to Night Festival 12pm 🎟️ [PRICE] Tickets: R80 at the door [/PRICE] Join us for a celebration of music, taste, and community spirit 🎉 Bring your friends 👯, your appetite 🍔, and your dancing shoes 👟 — Beats, Beer & Burgers is where it all comes together! #BeatsBeerAndBurgers #WestvilleWarehouse #FoodFestival #CraftBeer #LiveMusic #BurgerLovers #DurbanEvents #FamilyFriendly #DayToNight #GoodVibesOnly 🍔🍺🎶"
    },
    {
      "id": "1825394108119123",
      "name": "F@ck it Friday",
      "start_time": "2026-01-23T18:00:00+0200",
      "place": {
        "name": "48A Buckingham terrace, 3629 Westville, South Africa"
      },
      "cover": {
        "offset_x": 50,
        "offset_y": 50,
        "source": "https://scontent-man2-1.xx.fbcdn.net/v/t39.30808-6/614901182_1375069481076420_9128394608165991637_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=9e60e4&_nc_ohc=5R39fC_2SagQ7kNvwFKjVxM&_nc_oc=AdlwIAIZ0S9sYMB8MvEfWr5JmSm0XehtLx4avjnMbRkeXidlK7D80iva5CEkuTVrMUI&_nc_zt=23&_nc_ht=scontent-man2-1.xx&edm=ABTKTjYEAAAA&_nc_gid=2wmOfyedEMjsKcJFOhT0JA&_nc_tpa=Q5bMBQFocGDCrfbzRBDzEVty1MfcQTPiB2VsJ4e2cyuwiLd9ZsDn1f_D_MMJnt8FwVvagDk9k7KJ_-WFmA&oh=00_Afr5BB0pcuYrgXOotK5pRWeAlzCbKYOVy26feS4_sKXGTQ&oe=6973946A",
        "id": "1375069477743087"
      },
      "description": "🍻🔥 F#@k it Friday! 🔥🍻 Get ready for a wild one — Entrance only R250pp - R50 non drinking entrance! 🎟️Enjoy bottomless on-tap drinks 🍺🥃🍒 including Beer, Brandy and coke, Cherry bomb & more! (T’s & C’s apply) 💥 R.O.A.R — Right of Admission Reserved 📍 48a Buckingham Terrace, Westville 📞 WhatsApp 063 448 9165 for info! Let’s make the weekend unforgettable! 😎🎉"
    },
    {
      "id": "2043978289703353",
      "name": "New Years Eve Karaoke Party",
      "start_time": "2025-12-31T19:00:00+0200",
      "place": {
        "name": "48A Buckingham terrace, 3629 Westville, South Africa"
      },
      "cover": {
        "offset_x": 50,
        "offset_y": 50,
        "source": "https://scontent-man2-1.xx.fbcdn.net/v/t39.30808-6/594155867_1345380900711945_5811316598490328730_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=9e60e4&_nc_ohc=Z18ELTWwhdMQ7kNvwFjYesv&_nc_oc=AdmpQqqEK1TOO5u9XOqKII-SECQt900r-YNNNy8CzIcdfJ2EkwMGHM6SKeycm70VT0w&_nc_zt=23&_nc_ht=scontent-man2-1.xx&edm=ABTKTjYEAAAA&_nc_gid=2wmOfyedEMjsKcJFOhT0JA&_nc_tpa=Q5bMBQHsSmGkNdbe6jnmbvuni4yS7FJ-om-7ECVKrbDSVscYUDOnjx-xciZ70ZYkQoCTLcnvYryj92Z43g&oh=00_AfrHQAOSspWIhwVPwEpSXvccng_QTE5vTGQMjc410-AyQA&oe=69739F64",
        "id": "1345380894045279"
      },
      "description": "🎤🎉 NEW YEAR’S EVE KARAOKE PARTY! 🎉🎤 Ring in 2026 the fun way at The Westville Warehouse! Get ready to sing your heart out with our epic NYE Karaoke Night — whether you’re a shower singer or a superstar, the mic is YOURS! 🎶🔥 ✨ Plus: 🍹 Awesome drink specials all night 🍻 Ice-cold beers 🎊 Party vibes till late Bring your friends, pick your song, and let’s end 2025 on a HIGH note! 🥂🎤💥 📍 48a Buckingham Terrace, Westville 📱 WhatsApp: 063 448 9165 #NYEKaraoke #SingInTheNewYear #WestvilleWarehouse #PartyTime #GoodVibes #DurbanEvents #CheersTo2026 🎉🎤✨"
    },
    ]
}