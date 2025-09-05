export const events = [
    {
        id: 1,
        title: "Karaoke",
        description: `Get ready to hit the stage and belt out your favorite 
        tunes at our Karaoke Night! Whether you're a shower singer 
        or a rockstar in the making, this is your chance to shine. 
        Grab a mic, enjoy awesome drinks, and vibe with a crowd that 
        loves a good time. No judgment—just pure fun!`,
        start: "2025-05-01T19:00:00Z",
        end: "2025-05-01T22:00:00Z",
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
        start: "2025-04-30T21:00:00Z",
        end: "2025-04-30T23:30:00Z",
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
        start: "2025-04-29T19:00:00Z",
        end: "2025-04-29T23:00:00Z",
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
        start: "2025-05-02T19:00:00Z",
        end: "2025-05-03T01:00:00Z",
        price: 0,
        img: '/assets/events/ladies_night_event.png',
        alt: "Ladies' night poster"
    },

]



export const specialsDrink = [
    {
        id: 4,
        img: '/assets/specials/drink/tuesday_tequila.png',
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
        img: '/assets/specials/drink/wednesday_combo.png',
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
        img: '/assets/specials/drink/thursday_thirsty.png',
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
        img: '/assets/specials/drink/saturday_student.png',
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
        img: '/assets/specials/food/tuesday.png',
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
        img: '/assets/specials/food/wednesday.png',
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
        img: '/assets/specials/food/thursday.png',
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
                itemPrice: [51, 75, 97],
                itemSides: 26,
                itemCheese: null
            },
            {
                id: 12,
                itemName: "Cheesy Texan",
                itemDesc: "Melted cheese, juicy beef patty, layered with crunchy lettuce, pickled onions and a rich burger sauce.",
                itemDiet: "meat",
                itemPrice: [61, 92, 115],
                itemSides: 26,
                itemCheese: null
            },
            {
                id: 13,
                itemName: "Tumbleweed Veggie Star",
                itemDesc: "This plant-based patty is grilled to perfection, tucked in a soft bun, and served just the way nature intended - uncomplicated.",
                itemDiet: "vegetarian",
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
                itemPrice: [100, 191, 284],
                itemSides: 26
            },
            {
                itemName: "Smoked Texan BBQ",
                itemDesc: "Glazed with our Spicy Texan BBQ Sauce.",
                itemDiet: "meat",
                itemHeat: 1,
                itemPrice: [94, 179, 266],
                itemSides: 26
            },
            {
                itemName: "The Dallas Dusk Ribs",
                itemDesc: "Sweet southerndry rub. Served with a honey dipper.",
                itemDiet: "meat",
                itemHeat: 0,
                itemPrice: [106, 203, 286],
                itemSides: 26
            },
            {
                itemName: "Big Tex Glazed BBQ Ribs",
                itemDesc: "Smothered in our signature big tex BBQ glaze.",
                itemDiet: "meat",
                itemHeat: 0,
                itemPrice: [99, 189, 281],
                itemSides: 26
            },
            {
                itemName: "Crunch Back Ribs",
                itemDesc: "Corn coated and deep fried, served with a spicy tabasco sauce.",
                itemDiet: "meat",
                itemHeat: 1,
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
                itemPrice: [30]
            },
            {
                itemName: "Smashed Potato Salad",
                itemDesc: "Smashed potatoes with herbs and a mustard mayo",
                itemPrice: [30]
            },
            {
                itemName: "Cornribs Side",
                itemDesc: "Served with either a creamy Sriracha drizzle or a sweet chilli and lime drizzle",
                itemPrice: [33]
            },
            {
                itemName: "Fries",
                itemDesc: "Crispy golden fries tossed in our bold signature spice blend",
                itemPrice: [30, 45]
            },
        ]
    }
]