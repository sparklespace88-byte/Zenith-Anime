import { IMG } from '../assets/images';
import { Anime, ReviewComment, User } from '../types';

export const SAMPLE_VIDEOS = {
  action1: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
  fantasy1: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
  adventure1: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  scifi1: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  short1: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
  short2: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
};

export const INITIAL_ANIME_LIST: Anime[] = [
  {
    id: 'demon-slayer',
    title: 'Demon Slayer: Kimetsu no Yaiba',
    altTitle: '鬼滅の刃 (Hashira Training Arc)',
    description: 'Tanjiro Kamado undergoes grueling training under the stone, wind, and serpent Hashira to prepare for the climactic battle against Muzan Kibutsuji.',
    synopsis: 'Following the fierce battle in the Swordsmith Village, Tanjiro and his fellow Demon Slayers must elevate their physical and breathing techniques to supreme heights. The Hashira Training Arc brings the elite pillars together to train the next generation while Muzan searches frantically for Nezuko, whose ability to conquer sunlight threatens to upend the age-old conflict between demons and humanity.',
    genres: ['Action', 'Fantasy', 'Shounen', 'Supernatural'],
    releaseYear: 2024,
    rating: 9.3,
    ratingCount: 14280,
    totalEpisodes: 8,
    type: 'TV',
    status: 'Completed',
    studio: 'ufotable',
    language: 'Sub & Dub',
    bannerImage: IMG.HERO_DEMON_SLAYER_BANNER,
    posterImage: IMG.POSTER_DEMON_SLAYER,
    trailerUrl: SAMPLE_VIDEOS.action1,
    featured: true,
    trending: true,
    popular: true,
    latest: true,
    published: true,
    views: 489200,
    relatedAnimeIds: ['jujutsu-kaisen', 'solo-leveling', 'attack-on-titan'],
    episodes: [
      {
        id: 'ds-ep-1',
        animeId: 'demon-slayer',
        episodeNumber: 1,
        title: 'To Defeat Muzan Kibutsuji',
        duration: '2m 28s',
        thumbnail: IMG.POSTER_DEMON_SLAYER,
        videoUrl: IMG.DS_EP1_VIDEO,
        releaseDate: '2024-05-12',
        views: 120500,
        synopsis: 'The Hashira assemble in an emergency summit to devise strategy as Tanjiro recovers and begins his preliminary drills.'
      },
      {
        id: 'ds-ep-2',
        animeId: 'demon-slayer',
        episodeNumber: 2,
        title: 'The Water Hashira Giyu Tomioka\'s Pain',
        duration: '2m 02s',
        thumbnail: IMG.POSTER_DEMON_SLAYER,
        videoUrl: IMG.DS_EP2_VIDEO,
        releaseDate: '2024-05-19',
        views: 98400,
        synopsis: 'Tanjiro visits Giyu Tomioka to understand his reluctance to join the joint training sessions.'
      },
      {
        id: 'ds-ep-3',
        animeId: 'demon-slayer',
        episodeNumber: 3,
        title: 'Fully Recovered Tanjiro Joins the Training',
        duration: '2m 10s',
        thumbnail: IMG.POSTER_DEMON_SLAYER,
        videoUrl: IMG.DS_EP3_VIDEO,
        releaseDate: '2024-05-26',
        views: 89300,
        synopsis: 'Tanjiro takes on the training of the former Sound Hashira Tengen Uzui.'
      },
      {
        id: 'ds-ep-4',
        animeId: 'demon-slayer',
        episodeNumber: 4,
        title: 'To Bring a Smile to One\'s Face',
        duration: '1m 30s',
        thumbnail: IMG.POSTER_DEMON_SLAYER,
        videoUrl: IMG.DS_EP4_VIDEO,
        releaseDate: '2024-06-02',
        views: 84200,
        synopsis: 'Under Mist Hashira Muichiro Tokito, the slayers face high-velocity sword sparring.'
      },
      {
        id: 'ds-ep-5',
        animeId: 'demon-slayer',
        episodeNumber: 5,
        title: 'The Demon Hunter\'s Resolution',
        duration: '39s',
        thumbnail: IMG.POSTER_DEMON_SLAYER,
        videoUrl: IMG.DS_EP5_VIDEO,
        releaseDate: '2024-06-09',
        views: 79100,
        synopsis: 'Love Hashira Mitsuri Kanroji guides the squad through extreme flexibility conditioning.'
      },
      {
        id: 'ds-ep-6',
        animeId: 'demon-slayer',
        episodeNumber: 6,
        title: 'The Strongest of the Demon Slayer Corps',
        duration: '1m 38s',
        thumbnail: IMG.POSTER_DEMON_SLAYER,
        videoUrl: IMG.DS_EP6_VIDEO,
        releaseDate: '2024-06-16',
        views: 94200,
        synopsis: 'Wind Hashira Sanemi Shinazugawa puts Tanjiro and Genya through relentless combat training.'
      },
      {
        id: 'ds-ep-7',
        animeId: 'demon-slayer',
        episodeNumber: 7,
        title: 'Stone Hashira Gyomei Himejima',
        duration: '30s',
        thumbnail: IMG.POSTER_DEMON_SLAYER,
        videoUrl: IMG.DS_EP7_VIDEO,
        releaseDate: '2024-06-23',
        views: 110400,
        synopsis: 'Tanjiro undergoes muscle and spirit tempering under the waterfall with Gyomei Himejima.'
      },
      {
        id: 'ds-ep-8',
        animeId: 'demon-slayer',
        episodeNumber: 8,
        title: 'The Hashira Unite: Infinity Castle',
        duration: '1m 38s',
        thumbnail: IMG.POSTER_DEMON_SLAYER,
        videoUrl: IMG.DS_EP8_VIDEO,
        releaseDate: '2024-06-30',
        views: 154000,
        synopsis: 'Muzan Kibutsuji attacks the Ubuyashiki estate as all Hashira plunge into the Infinity Castle.'
      }
    ]
  },
  {
    id: 'solo-leveling',
    title: 'Solo Leveling: Arise',
    altTitle: '俺だけレベルアップな件 (Ore dake Level Up na Ken)',
    description: 'When the weakest E-rank hunter Sung Jin-woo survives a double dungeon trial, he awakens a mysterious quest system only visible to him.',
    synopsis: 'In a world where dimensional gates unleash deadly monsters, hunters with supernatural gifts risk their lives for glory and loot. Sung Jin-woo, notoriously known as the "Weakest Hunter of All Mankind," is brutally slaughtered inside a perilous hidden sanctuary. Instead of perishing, he wakes up in a hospital with a holographic floating quest log granting him limitless potential to level up into a godlike sovereign.',
    genres: ['Action', 'Fantasy', 'Supernatural', 'Adventure'],
    releaseYear: 2024,
    rating: 9.2,
    ratingCount: 18940,
    totalEpisodes: 12,
    type: 'TV',
    status: 'Completed',
    studio: 'A-1 Pictures',
    language: 'Sub & Dub',
    bannerImage: IMG.HERO_SOLO_LEVELING_BANNER,
    posterImage: IMG.POSTER_SOLO_LEVELING,
    trailerUrl: SAMPLE_VIDEOS.action1,
    featured: true,
    trending: true,
    popular: true,
    latest: false,
    published: true,
    views: 521000,
    relatedAnimeIds: ['demon-slayer', 'jujutsu-kaisen', 'chainsaw-man'],
    episodes: [
      {
        id: 'sl-ep-1',
        animeId: 'solo-leveling',
        episodeNumber: 1,
        title: 'I\'m Used to It',
        duration: '2m 30s',
        thumbnail: IMG.POSTER_SOLO_LEVELING,
        videoUrl: IMG.SL_EP1_VIDEO,
        releaseDate: '2024-01-07',
        views: 184000,
        synopsis: 'E-rank hunter Sung Jin-woo enters a routine D-rank dungeon raid that turns into a nightmare.'
      },
      {
        id: 'sl-ep-2',
        animeId: 'solo-leveling',
        episodeNumber: 2,
        title: 'If I Had One More Chance',
        duration: '2m 35s',
        thumbnail: IMG.POSTER_SOLO_LEVELING,
        videoUrl: IMG.SL_EP2_VIDEO,
        releaseDate: '2024-01-14',
        views: 145000,
        synopsis: 'Trapped inside the Cartenon Temple, the raid party must decipher three sacred commandments.'
      },
      {
        id: 'sl-ep-3',
        animeId: 'solo-leveling',
        episodeNumber: 3,
        title: 'It\'s Like a Game',
        duration: '2m 11s',
        thumbnail: IMG.POSTER_SOLO_LEVELING,
        videoUrl: IMG.SL_EP3_VIDEO,
        releaseDate: '2024-01-21',
        views: 132000,
        synopsis: 'Jin-woo awakens in a Seoul hospital bed greeted by a system interface only he can interact with.'
      }
    ]
  },
  {
    id: 'jujutsu-kaisen',
    title: 'Jujutsu Kaisen: Shibuya Incident',
    altTitle: '呪術廻戦 (Jujutsu Kaisen Season 2)',
    description: 'On Halloween night in Shibuya, a massive curtain descends trapping countless civilians as Pseudo-Geto moves to seal Satoru Gojo.',
    synopsis: 'The delicate equilibrium of the jujutsu world shatters on October 31st when an elaborate barrier encloses Shibuya Station. Satoru Gojo enters the depths alone to face special-grade cursed spirits Jogo, Hanami, and Choso. What follows is the most catastrophic clash in modern jujutsu history as Yuji Itadori and Jujutsu High sorcerers race against impossible odds.',
    genres: ['Action', 'Supernatural', 'Dark Fantasy', 'Shounen'],
    releaseYear: 2023,
    rating: 9.4,
    ratingCount: 22100,
    totalEpisodes: 23,
    type: 'TV',
    status: 'Completed',
    studio: 'MAPPA',
    language: 'Sub & Dub',
    bannerImage: IMG.HERO_JUJUTSU_KAISEN_BANNER,
    posterImage: IMG.POSTER_JUJUTSU_KAISEN,
    trailerUrl: SAMPLE_VIDEOS.action1,
    featured: true,
    trending: true,
    popular: true,
    latest: false,
    published: true,
    views: 689000,
    relatedAnimeIds: ['chainsaw-man', 'demon-slayer', 'attack-on-titan'],
    episodes: [
      {
        id: 'jjk-ep-1',
        animeId: 'jujutsu-kaisen',
        episodeNumber: 1,
        title: 'Shibuya Incident',
        duration: '1m 16s',
        thumbnail: IMG.POSTER_JUJUTSU_KAISEN,
        videoUrl: IMG.JJK_EP1_VIDEO,
        releaseDate: '2023-08-31',
        views: 210000,
        synopsis: 'A curtain falls over Shibuya during Halloween as sorcerers are deployed to contain the threat.'
      },
      {
        id: 'jjk-ep-2',
        animeId: 'jujutsu-kaisen',
        episodeNumber: 2,
        title: 'Gate, Open',
        duration: '1m 35s',
        thumbnail: IMG.POSTER_JUJUTSU_KAISEN,
        videoUrl: IMG.JJK_EP2_VIDEO,
        releaseDate: '2023-09-07',
        views: 195000,
        synopsis: 'Satoru Gojo descends into the B5 subway platform where the curse alliance awaits.'
      }
    ]
  },
  {
    id: 'frieren-journey',
    title: 'Frieren: Beyond Journey\'s End',
    altTitle: '葬送のフリーレン (Sousou no Frieren)',
    description: 'Decades after defeating the Demon King alongside the Hero party, elven mage Frieren embarks on a new voyage to understand human emotion.',
    synopsis: 'The hero party\'s decade-long quest ended in glorious triumph. For the elf mage Frieren, whose lifespan spans millennia, those ten years were merely a blink of an eye. After watching her mortal comrade Himmel pass away from old age, deep regret spurs her on a pilgrimage to Aureole to speak with souls of the departed, taking on apprentice Fern and warrior Stark along the path.',
    genres: ['Fantasy', 'Adventure', 'Drama'],
    releaseYear: 2024,
    rating: 9.5,
    ratingCount: 31050,
    totalEpisodes: 28,
    type: 'TV',
    status: 'Completed',
    studio: 'Madhouse',
    language: 'Sub & Dub',
    bannerImage: IMG.HERO_FRIEREN_BANNER,
    posterImage: IMG.POSTER_FRIEREN,
    trailerUrl: SAMPLE_VIDEOS.fantasy1,
    featured: true,
    trending: true,
    popular: true,
    latest: true,
    published: true,
    views: 742000,
    relatedAnimeIds: ['demon-slayer', 'spy-family'],
    episodes: [
      {
        id: 'fr-ep-1',
        animeId: 'frieren-journey',
        episodeNumber: 1,
        title: 'The Journey\'s End',
        duration: '1m 51s',
        thumbnail: IMG.POSTER_FRIEREN,
        videoUrl: IMG.FR_EP1_VIDEO,
        releaseDate: '2023-09-29',
        views: 245000,
        synopsis: 'Frieren reunites with her old comrades fifty years after defeating the Demon King.'
      },
      {
        id: 'fr-ep-2',
        animeId: 'frieren-journey',
        episodeNumber: 2,
        title: 'It Didn\'t Have to Be Magic...',
        duration: '32s',
        thumbnail: IMG.POSTER_FRIEREN,
        videoUrl: IMG.FR_EP2_VIDEO,
        releaseDate: '2023-09-29',
        views: 189000,
        synopsis: 'Frieren teaches Heiter\'s adopted daughter Fern the foundations of sorcery.'
      }
    ]
  },
  {
    id: 'attack-on-titan',
    title: 'Attack on Titan: The Final Chapters',
    altTitle: '進撃の巨人 (Shingeki no Kyojin)',
    description: 'The Rumbling marches across continents as Armin, Mikasa, and the allied forces wage their final desperate battle to save humanity.',
    synopsis: 'With the true power of the Founding Titan unleashed, Eren Yeager advances tens of thousands of Colossal Titans across the globe. Divided by conscience yet united by survival, former enemies band together for one last skyward assault against the catastrophic Rumbling.',
    genres: ['Action', 'Dark Fantasy', 'Drama', 'Mystery'],
    releaseYear: 2023,
    rating: 9.1,
    ratingCount: 45000,
    totalEpisodes: 2,
    type: 'Movie',
    status: 'Completed',
    studio: 'MAPPA',
    language: 'Sub & Dub',
    bannerImage: IMG.HERO_JUJUTSU_KAISEN_BANNER,
    posterImage: IMG.POSTER_ATTACK_ON_TITAN,
    trailerUrl: SAMPLE_VIDEOS.action1,
    trending: true,
    popular: true,
    latest: false,
    published: true,
    views: 920000,
    relatedAnimeIds: ['jujutsu-kaisen', 'demon-slayer'],
    episodes: [
      {
        id: 'aot-ep-1',
        animeId: 'attack-on-titan',
        episodeNumber: 1,
        title: 'Special 1: The Rumbling',
        duration: '2m 26s',
        thumbnail: IMG.POSTER_ATTACK_ON_TITAN,
        videoUrl: IMG.AOT_EP1_VIDEO,
        releaseDate: '2023-03-04',
        views: 410000,
        synopsis: 'Armin and the alliance repair the flying boat as the Colossal Titans breach Odiha.'
      }
    ]
  },
  {
    id: 'chainsaw-man',
    title: 'Chainsaw Man',
    altTitle: 'チェンソーマン',
    description: 'Denji, a destitute youth who merges with chainsaw devil Pochita, is recruited by Public Safety devil hunters.',
    synopsis: 'Living in squalor under the shadow of yakuza debts, Denji hunts lesser devils with his chainsaw dog Pochita. When betrayed and butchered, Pochita gives his heart to resurrect Denji as Chainsaw Man. Brought into the Public Safety Division by Makima, he enters a blood-drenched world of devils, guns, and fleeting dreams.',
    genres: ['Action', 'Dark Fantasy', 'Supernatural'],
    releaseYear: 2022,
    rating: 8.9,
    ratingCount: 16800,
    totalEpisodes: 12,
    type: 'TV',
    status: 'Completed',
    studio: 'MAPPA',
    language: 'Sub & Dub',
    bannerImage: IMG.HERO_SOLO_LEVELING_BANNER,
    posterImage: IMG.POSTER_CHAINSAW_MAN,
    trailerUrl: SAMPLE_VIDEOS.action1,
    trending: false,
    popular: true,
    latest: false,
    published: true,
    views: 380000,
    episodes: [
      {
        id: 'csm-ep-1',
        animeId: 'chainsaw-man',
        episodeNumber: 1,
        title: 'Dog & Chainsaw',
        duration: '1m 42s',
        thumbnail: IMG.POSTER_CHAINSAW_MAN,
        videoUrl: IMG.CSM_EP1_VIDEO,
        releaseDate: '2022-10-12',
        views: 198000,
        synopsis: 'Denji struggles to pay his late father\'s debt through devil hunting.'
      }
    ]
  },
  {
    id: 'spy-family',
    title: 'SPY x FAMILY Season 2',
    altTitle: 'スパイファミリー',
    description: 'Master spy Twilight, assassin Yor, and telepathic orphan Anya navigate the secret trials of their fabricated suburban household.',
    synopsis: 'Operation Strix continues as the Forger family balances mundane domestic life with covert missions. Twilight navigates complex diplomatic subterfuge while Yor defends cruise ship delegates and Anya uses her secret mind-reading abilities to keep the quirky family from unraveling.',
    genres: ['Comedy', 'Action', 'Shounen'],
    releaseYear: 2023,
    rating: 8.7,
    ratingCount: 12400,
    totalEpisodes: 12,
    type: 'TV',
    status: 'Completed',
    studio: 'WIT Studio & CloverWorks',
    language: 'Sub & Dub',
    bannerImage: IMG.HERO_FRIEREN_BANNER,
    posterImage: IMG.POSTER_SPY_FAMILY,
    trailerUrl: SAMPLE_VIDEOS.short1,
    trending: false,
    popular: true,
    latest: true,
    published: true,
    views: 310000,
    episodes: [
      {
        id: 'sxf-ep-1',
        animeId: 'spy-family',
        episodeNumber: 1,
        title: 'Follow Mama and Papa',
        duration: '1m 52s',
        thumbnail: IMG.POSTER_SPY_FAMILY,
        videoUrl: IMG.SXF_EP1_VIDEO,
        releaseDate: '2023-10-07',
        views: 110000,
        synopsis: 'Loid and Yor go on a date while Franky babysits Anya.'
      }
    ]
  },
  {
    id: 'kaiju-no-8',
    title: 'Kaiju No. 8',
    altTitle: '怪獣8号',
    description: 'Kafka Hibino, a 32-year-old monster corpse disposal worker, accidentally consumes a kaiju parasite gaining terrifying transformation abilities.',
    synopsis: 'Japan suffers the highest rate of kaiju emergence in the world. Kafka Hibino dreams of joining the elite Defense Force alongside childhood friend Mina Ashiro. After a mysterious creature enters his body, Kafka obtains catastrophic kaiju powers, threatening his humanity even as he enlists.',
    genres: ['Action', 'Sci-Fi', 'Shounen'],
    releaseYear: 2024,
    rating: 8.8,
    ratingCount: 9400,
    totalEpisodes: 12,
    type: 'TV',
    status: 'Completed',
    studio: 'Production I.G',
    language: 'Sub & Dub',
    bannerImage: IMG.HERO_DEMON_SLAYER_BANNER,
    posterImage: IMG.POSTER_KAIJU_NO_8,
    trailerUrl: SAMPLE_VIDEOS.action1,
    trending: true,
    popular: true,
    latest: true,
    published: true,
    views: 295000,
    episodes: [
      {
        id: 'k8-ep-1',
        animeId: 'kaiju-no-8',
        episodeNumber: 1,
        title: 'The Man Who Became a Kaiju',
        duration: '1m 39s',
        thumbnail: IMG.POSTER_KAIJU_NO_8,
        videoUrl: IMG.K8_EP1_VIDEO,
        releaseDate: '2024-04-13',
        views: 140000,
        synopsis: 'Kafka works cleaning giant monster remains until a junior worker inspires him.'
      }
    ]
  },
  {
    id: 'one-piece',
    title: 'One Piece: Egghead Arc',
    altTitle: 'ワンピース (Wan Pīsu)',
    description: 'Monkey D. Luffy and the Straw Hat Pirates arrive at the futuristic island of Egghead, home to genius scientist Dr. Vegapunk.',
    synopsis: 'Leaving Wano behind after Luffy\'s awakening of Sun God Nika and Gear 5, the Straw Hat Pirates venture to Egghead Island, an island 500 years in the future. As World Government CP0 assassins and Admiral Kizaru close in, Luffy must unleash the full cartoonish wrath of Gear 5.',
    genres: ['Action', 'Adventure', 'Fantasy', 'Shounen'],
    releaseYear: 2024,
    rating: 9.3,
    ratingCount: 52000,
    totalEpisodes: 1120,
    type: 'TV',
    status: 'Ongoing',
    studio: 'Toei Animation',
    language: 'Sub & Dub',
    bannerImage: IMG.HERO_DEMON_SLAYER_BANNER,
    posterImage: IMG.POSTER_ONE_PIECE,
    trailerUrl: SAMPLE_VIDEOS.adventure1,
    featured: true,
    trending: true,
    popular: true,
    latest: true,
    published: true,
    views: 980000,
    episodes: [
      {
        id: 'op-ep-1',
        animeId: 'one-piece',
        episodeNumber: 1100,
        title: 'Powers on a Different Level! Luffy vs. Lucci!',
        duration: '1m 39s',
        thumbnail: IMG.POSTER_ONE_PIECE,
        videoUrl: IMG.OP_EP1_VIDEO,
        releaseDate: '2024-04-07',
        views: 310000,
        synopsis: 'Luffy activates Gear 5 on Egghead Island and clashes violently with Rob Lucci\'s Awakened Leopard form.'
      },
      {
        id: 'op-ep-2',
        animeId: 'one-piece',
        episodeNumber: 1101,
        title: 'The Humanity of the Seraphim',
        duration: '1m 9s',
        thumbnail: IMG.POSTER_ONE_PIECE,
        videoUrl: IMG.OP_EP2_VIDEO,
        releaseDate: '2024-04-14',
        views: 290000,
        synopsis: 'Vegapunk reveals the shocking origins of devil fruits and the cloning of the Seven Warlords.'
      }
    ]
  },
  {
    id: 'bleach-tybw',
    title: 'Bleach: Thousand-Year Blood War',
    altTitle: 'BLEACH 千年血戦篇',
    description: 'Yhwach and the hidden Quincy empire Wandenreich wage all-out annihilation war against the Soul Society.',
    synopsis: 'Peace is suddenly shattered when warning sirens echo through the Soul Society. Residents of the Rukongai disappear without a trace while hollows vanish across the living world. The Quincy King Yhwach resurfaces after a millennium of slumber to reclaim the realm and slay the Soul King.',
    genres: ['Action', 'Supernatural', 'Shounen'],
    releaseYear: 2024,
    rating: 9.1,
    ratingCount: 28400,
    totalEpisodes: 26,
    type: 'TV',
    status: 'Ongoing',
    studio: 'Studio Pierrot',
    language: 'Sub & Dub',
    bannerImage: IMG.HERO_JUJUTSU_KAISEN_BANNER,
    posterImage: IMG.POSTER_BLEACH_TYBW,
    trailerUrl: SAMPLE_VIDEOS.action1,
    featured: false,
    trending: true,
    popular: true,
    latest: true,
    published: true,
    views: 450000,
    episodes: [
      {
        id: 'bl-ep-1',
        animeId: 'bleach-tybw',
        episodeNumber: 1,
        title: 'The Blood Warfare',
        duration: '2m 25s',
        thumbnail: IMG.POSTER_BLEACH_TYBW,
        videoUrl: IMG.BL_EP1_VIDEO,
        releaseDate: '2022-10-11',
        views: 210000,
        synopsis: 'Substitute Soul Reaper Ichigo Kurosaki answers the call as shadows infiltrate the Seireitei.'
      }
    ]
  },
  {
    id: 'naruto-shippuden',
    title: 'Naruto: Shippuden',
    altTitle: 'NARUTO -ナルト- 疾風伝',
    description: 'After years of training with Jiraiya, Naruto Uzumaki returns to the Hidden Leaf Village to protect his friends from the Akatsuki.',
    synopsis: 'Two and a half years after leaving Konoha, Naruto returns stronger and more determined than ever to bring Sasuke Uchiha back to the light. However, the criminal organization Akatsuki has mobilized to extract all nine tailed beasts, pushing Naruto toward his ultimate destiny as the Child of Prophecy.',
    genres: ['Action', 'Adventure', 'Shounen', 'Fantasy'],
    releaseYear: 2017,
    rating: 8.9,
    ratingCount: 89000,
    totalEpisodes: 500,
    type: 'TV',
    status: 'Completed',
    studio: 'Studio Pierrot',
    language: 'Sub & Dub',
    bannerImage: IMG.HERO_SOLO_LEVELING_BANNER,
    posterImage: IMG.POSTER_NARUTO_SHIPPUDEN,
    trailerUrl: SAMPLE_VIDEOS.fantasy1,
    featured: false,
    trending: true,
    popular: true,
    latest: false,
    published: true,
    views: 890000,
    episodes: [
      {
        id: 'nar-ep-1',
        animeId: 'naruto-shippuden',
        episodeNumber: 167,
        title: 'Planetary Devastation',
        duration: '1m 43s',
        thumbnail: IMG.POSTER_NARUTO_SHIPPUDEN,
        videoUrl: IMG.NAR_EP1_VIDEO,
        releaseDate: '2010-07-01',
        views: 450000,
        synopsis: 'Devastated by Pain\'s assault on Hinata, Naruto loses control to the Nine-Tails demon fox.'
      }
    ]
  },
  {
    id: 'death-note',
    title: 'Death Note',
    altTitle: 'デスノート (Desu Nōto)',
    description: 'Genius high schooler Light Yagami finds a supernatural notebook that can kill anyone whose name is written in it.',
    synopsis: 'Bored shinigami Ryuk drops his Death Note into the human world. When ace student Light Yagami discovers it, he resolves to cleanse the world of all criminals and become the god of a new utopia under the alias Kira, igniting a lethal psychological battle of wits with eccentric detective L.',
    genres: ['Mystery', 'Supernatural', 'Drama'],
    releaseYear: 2007,
    rating: 9.0,
    ratingCount: 110000,
    totalEpisodes: 37,
    type: 'TV',
    status: 'Completed',
    studio: 'Madhouse',
    language: 'Sub & Dub',
    bannerImage: IMG.HERO_JUJUTSU_KAISEN_BANNER,
    posterImage: IMG.POSTER_DEATH_NOTE,
    trailerUrl: SAMPLE_VIDEOS.action1,
    featured: false,
    trending: false,
    popular: true,
    latest: false,
    published: true,
    views: 780000,
    episodes: [
      {
        id: 'dn-ep-1',
        animeId: 'death-note',
        episodeNumber: 1,
        title: 'Rebirth',
        duration: '1m 0s',
        thumbnail: IMG.POSTER_DEATH_NOTE,
        videoUrl: IMG.DN_EP1_VIDEO,
        releaseDate: '2006-10-04',
        views: 380000,
        synopsis: 'Light Yagami finds a strange black notebook titled Death Note and tests its lethal power.'
      }
    ]
  }
];

export const INITIAL_USERS: User[] = [
  {
    id: 'user-admin',
    name: 'Admin Otaku',
    username: 'admin',
    email: 'admin@zenithanime.com',
    role: 'admin',
    avatar: IMG.AVATAR_GOJO,
    bio: 'Lead Anime Curator & System Admin. Managing ZenithAnime stream nodes.',
    joinedDate: '2023-01-15',
    isBlocked: false,
    watchlist: [
      { animeId: 'demon-slayer', status: 'watching', addedAt: '2024-05-14' },
      { animeId: 'solo-leveling', status: 'completed', addedAt: '2024-01-10' }
    ],
    favorites: ['demon-slayer', 'jujutsu-kaisen', 'frieren-journey'],
    watchHistory: [
      {
        animeId: 'demon-slayer',
        episodeNumber: 1,
        progressSeconds: 1420,
        durationSeconds: 2880,
        lastWatchedAt: '2026-09-29T08:15:00Z'
      },
      {
        animeId: 'frieren-journey',
        episodeNumber: 1,
        progressSeconds: 840,
        durationSeconds: 1500,
        lastWatchedAt: '2026-09-28T19:30:00Z'
      }
    ]
  },
  {
    id: 'user-faizan',
    name: 'Muhammad Faizan',
    username: 'faizan_otaku',
    email: 'muhammadfaiza903@gmail.com',
    role: 'user',
    avatar: IMG.AVATAR_TANJIRO,
    bio: 'Avid anime watcher, dark fantasy and action lover. Keeping up with seasonals!',
    joinedDate: '2023-08-20',
    isBlocked: false,
    watchlist: [
      { animeId: 'demon-slayer', status: 'watching', addedAt: '2024-05-15' },
      { animeId: 'frieren-journey', status: 'watching', addedAt: '2024-04-01' },
      { animeId: 'solo-leveling', status: 'completed', addedAt: '2024-03-28' }
    ],
    favorites: ['demon-slayer', 'solo-leveling'],
    watchHistory: [
      {
        animeId: 'demon-slayer',
        episodeNumber: 1,
        progressSeconds: 650,
        durationSeconds: 2880,
        lastWatchedAt: '2026-09-29T09:40:00Z'
      }
    ]
  }
];

export interface AnimeAvatarOption {
  id: string;
  name: string;
  series: string;
  url: string;
}

export const ANIME_AVATARS: AnimeAvatarOption[] = [
  {
    id: 'tanjiro',
    name: 'Tanjiro Kamado',
    series: 'Demon Slayer',
    url: IMG.AVATAR_TANJIRO
  },
  {
    id: 'gojo',
    name: 'Satoru Gojo',
    series: 'Jujutsu Kaisen',
    url: IMG.AVATAR_GOJO
  },
  {
    id: 'jinwoo',
    name: 'Sung Jin-woo',
    series: 'Solo Leveling',
    url: IMG.AVATAR_JINWOO
  },
  {
    id: 'frieren',
    name: 'Frieren the Mage',
    series: 'Beyond Journey\'s End',
    url: IMG.AVATAR_FRIEREN
  },
  {
    id: 'luffy',
    name: 'Monkey D. Luffy',
    series: 'One Piece',
    url: IMG.AVATAR_LUFFY
  },
  {
    id: 'naruto',
    name: 'Naruto Uzumaki',
    series: 'Naruto Shippuden',
    url: IMG.POSTER_NARUTO_SHIPPUDEN
  },
  {
    id: 'ichigo',
    name: 'Ichigo Kurosaki',
    series: 'Bleach: TYBW',
    url: IMG.POSTER_BLEACH_TYBW
  },
  {
    id: 'chainsaw',
    name: 'Denji',
    series: 'Chainsaw Man',
    url: IMG.POSTER_CHAINSAW_MAN
  },
  {
    id: 'anya',
    name: 'Anya Forger',
    series: 'SPY x FAMILY',
    url: IMG.POSTER_SPY_FAMILY
  },
  {
    id: 'eren',
    name: 'Eren Yeager',
    series: 'Attack on Titan',
    url: IMG.POSTER_ATTACK_ON_TITAN
  }
];

export const INITIAL_COMMENTS: ReviewComment[] = [
  {
    id: 'comm-1',
    animeId: 'demon-slayer',
    episodeId: 'ds-ep-1',
    userId: 'user-faizan',
    userName: 'Muhammad Faizan',
    userAvatar: IMG.AVATAR_TANJIRO,
    userRole: 'user',
    text: 'ufotable’s visual animation direction is unmatched! The flame breathing particle physics and the atmosphere in this premiere gave me absolute chills. 10/10 opening!',
    rating: 10,
    createdAt: '2 hours ago',
    likes: 42,
    dislikes: 1,
    replies: [
      {
        id: 'rep-1',
        commentId: 'comm-1',
        userId: 'user-admin',
        userName: 'Admin Otaku',
        userAvatar: IMG.AVATAR_LUFFY,
        userRole: 'admin',
        text: 'Agreed! Episode 1 in 1080p 60fps on our stream player looks incredible. Wait until you see the next training battles.',
        createdAt: '1 hour ago',
        likes: 15
      }
    ]
  },
  {
    id: 'comm-2',
    animeId: 'solo-leveling',
    episodeId: 'sl-ep-1',
    userId: 'user-admin',
    userName: 'Admin Otaku',
    userAvatar: IMG.AVATAR_LUFFY,
    userRole: 'admin',
    text: 'A-1 Pictures nailed the tone of the webtoon. The double dungeon dread and Sawano\'s musical score are breathtaking.',
    rating: 9,
    createdAt: 'Yesterday',
    likes: 28,
    dislikes: 0,
    replies: []
  },
  {
    id: 'comm-3',
    animeId: 'frieren-journey',
    userId: 'user-faizan',
    userName: 'Muhammad Faizan',
    userAvatar: IMG.AVATAR_TANJIRO,
    userRole: 'user',
    text: 'One of the greatest anime adaptations of the decade. The pacing, the quiet moments, and the exploration of time and grief are poetry.',
    rating: 10,
    createdAt: '3 days ago',
    likes: 89,
    dislikes: 2,
    replies: []
  }
];

export const GENRES_LIST = [
  'All',
  'Action',
  'Fantasy',
  'Shounen',
  'Supernatural',
  'Adventure',
  'Sci-Fi',
  'Drama',
  'Comedy',
  'Dark Fantasy',
  'Mystery',
  'Romance'
];
