import AVATAR_FRIEREN from './images/avatar_frieren_1790744947882.jpg';
import AVATAR_GOJO from './images/avatar_gojo_1790744905412.jpg';
import AVATAR_JINWOO from './images/avatar_jinwoo_1790744920008.jpg';
import AVATAR_LUFFY from './images/avatar_luffy_1790744965994.jpg';
import AVATAR_TANJIRO from './images/avatar_tanjiro_1790744882863.jpg';
import HERO_DEMON_SLAYER_BANNER from './images/hero_demon_slayer_banner_1790704547751.jpg';
import HERO_FRIEREN_BANNER from './images/hero_frieren_banner_1790704596209.jpg';
import HERO_JUJUTSU_KAISEN_BANNER from './images/hero_jujutsu_kaisen_banner_1790704582086.jpg';
import HERO_SOLO_LEVELING_BANNER from './images/hero_solo_leveling_banner_1790704567137.jpg';
import POSTER_ATTACK_ON_TITAN from './images/poster_attack_on_titan_1790743081266.jpg';
import POSTER_BLEACH_TYBW from './images/poster_bleach_tybw_1790743403880.jpg';
import POSTER_CHAINSAW_MAN from './images/poster_chainsaw_man_1790743095202.jpg';
import POSTER_DEATH_NOTE from './images/poster_death_note_1790743433804.jpg';
import POSTER_DEMON_SLAYER from './images/poster_demon_slayer_1790743005144.jpg';
import POSTER_FRIEREN from './images/poster_frieren_1790743061524.jpg';
import POSTER_JUJUTSU_KAISEN from './images/poster_jujutsu_kaisen_1790743046425.jpg';
import POSTER_KAIJU_NO_8 from './images/poster_kaiju_no_8_1790743127063.jpg';
import POSTER_NARUTO_SHIPPUDEN from './images/poster_naruto_shippuden_1790743417321.jpg';
import POSTER_ONE_PIECE from './images/poster_one_piece_1790743389574.jpg';
import POSTER_SOLO_LEVELING from './images/poster_solo_leveling_1790743020838.jpg';
import POSTER_SPY_FAMILY from './images/poster_spy_family_1790743112046.jpg';
import DS_EP1_VIDEO_FILE from './videos/demon_slayer_ep1.mp4';
import DS_EP2_VIDEO_FILE from './videos/demon_slayer_ep2.mp4';
import DS_EP3_VIDEO_FILE from './videos/demon_slayer_ep3.mp4';
import DS_EP4_VIDEO_FILE from './videos/demon_slayer_ep4.mp4';
import DS_EP5_VIDEO_FILE from './videos/demon_slayer_ep5.mp4';
import DS_EP6_VIDEO_FILE from './videos/demon_slayer_ep6.mp4';
import DS_EP7_VIDEO_FILE from './videos/demon_slayer_ep7.mp4';
import DS_EP8_VIDEO_FILE from './videos/demon_slayer_ep8.mp4';
import SL_EP1_VIDEO_FILE from './videos/solo_leveling_ep1.mp4';
import SL_EP2_VIDEO_FILE from './videos/solo_leveling_ep2.mp4';
import SL_EP3_VIDEO_FILE from './videos/solo_leveling_ep3.mp4';
import JJK_EP1_VIDEO_FILE from './videos/jujutsu_kaisen_ep1.mp4';
import JJK_EP2_VIDEO_FILE from './videos/jujutsu_kaisen_ep2.mp4';
import FR_EP1_VIDEO_FILE from './videos/frieren_ep1.mp4';
import FR_EP2_VIDEO_FILE from './videos/frieren_ep2.mp4';
import AOT_EP1_VIDEO_FILE from './videos/attack_on_titan_ep1.mp4';
import K8_EP1_VIDEO_FILE from './videos/kaiju_no_8_ep1.mp4';
import OP_EP1_VIDEO_FILE from './videos/one_piece_ep1.mp4';
import OP_EP2_VIDEO_FILE from './videos/one_piece_ep2.mp4';
import BL_EP1_VIDEO_FILE from './videos/bleach_ep1.mp4';
import NAR_EP1_VIDEO_FILE from './videos/naruto_shippuden_ep1.mp4';
import CSM_EP1_VIDEO_FILE from './videos/chainsaw_man_ep1.mp4';
import SXF_EP1_VIDEO_FILE from './videos/spy_family_ep1.mp4';
import DN_EP1_VIDEO_FILE from './videos/death_note_ep1.mp4';

// NOTE: also holds bundled videos; every value here is stored as a small token in localStorage.
export const IMG = {
  AVATAR_FRIEREN,
  AVATAR_GOJO,
  AVATAR_JINWOO,
  AVATAR_LUFFY,
  AVATAR_TANJIRO,
  HERO_DEMON_SLAYER_BANNER,
  HERO_FRIEREN_BANNER,
  HERO_JUJUTSU_KAISEN_BANNER,
  HERO_SOLO_LEVELING_BANNER,
  POSTER_ATTACK_ON_TITAN,
  POSTER_BLEACH_TYBW,
  POSTER_CHAINSAW_MAN,
  POSTER_DEATH_NOTE,
  POSTER_DEMON_SLAYER,
  POSTER_FRIEREN,
  POSTER_JUJUTSU_KAISEN,
  POSTER_KAIJU_NO_8,
  POSTER_NARUTO_SHIPPUDEN,
  POSTER_ONE_PIECE,
  POSTER_SOLO_LEVELING,
  POSTER_SPY_FAMILY,
  DS_EP1_VIDEO: DS_EP1_VIDEO_FILE,
  DS_EP2_VIDEO: DS_EP2_VIDEO_FILE,
  DS_EP3_VIDEO: DS_EP3_VIDEO_FILE,
  DS_EP4_VIDEO: DS_EP4_VIDEO_FILE,
  DS_EP5_VIDEO: DS_EP5_VIDEO_FILE,
  DS_EP6_VIDEO: DS_EP6_VIDEO_FILE,
  DS_EP7_VIDEO: DS_EP7_VIDEO_FILE,
  DS_EP8_VIDEO: DS_EP8_VIDEO_FILE,
  SL_EP1_VIDEO: SL_EP1_VIDEO_FILE,
  SL_EP2_VIDEO: SL_EP2_VIDEO_FILE,
  SL_EP3_VIDEO: SL_EP3_VIDEO_FILE,
  JJK_EP1_VIDEO: JJK_EP1_VIDEO_FILE,
  JJK_EP2_VIDEO: JJK_EP2_VIDEO_FILE,
  FR_EP1_VIDEO: FR_EP1_VIDEO_FILE,
  FR_EP2_VIDEO: FR_EP2_VIDEO_FILE,
  AOT_EP1_VIDEO: AOT_EP1_VIDEO_FILE,
  K8_EP1_VIDEO: K8_EP1_VIDEO_FILE,
  OP_EP1_VIDEO: OP_EP1_VIDEO_FILE,
  OP_EP2_VIDEO: OP_EP2_VIDEO_FILE,
  BL_EP1_VIDEO: BL_EP1_VIDEO_FILE,
  NAR_EP1_VIDEO: NAR_EP1_VIDEO_FILE,
  CSM_EP1_VIDEO: CSM_EP1_VIDEO_FILE,
  SXF_EP1_VIDEO: SXF_EP1_VIDEO_FILE,
  DN_EP1_VIDEO: DN_EP1_VIDEO_FILE,
} as const;

// ---- Persistence helpers: store bundled images as small "@img:KEY" tokens instead of
// full URLs/data-URIs (keeps localStorage tiny and survives rebuilds with new asset hashes).
const IMG_REVERSE: Record<string, string> = Object.fromEntries(
  Object.entries(IMG).map(([key, url]) => [url as string, key])
);

export const serializeForStorage = (value: unknown): string =>
  JSON.stringify(value, (_k, v) =>
    typeof v === 'string' && IMG_REVERSE[v] ? `@img:${IMG_REVERSE[v]}` : v
  );

export const parseFromStorage = <T,>(raw: string): T =>
  JSON.parse(raw, (_k, v) =>
    typeof v === 'string' && v.startsWith('@img:')
      ? ((IMG as Record<string, string>)[v.slice(5)] ?? v)
      : v
  ) as T;
