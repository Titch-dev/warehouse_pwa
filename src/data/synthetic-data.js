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