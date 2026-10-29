import { SvgXml } from 'react-native-svg'

export const AVATAR_PRESETS = [
  {
    id: 'preset:bee-gold',
    label: 'Golden Bee',
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><rect width="128" height="128" rx="28" fill="#F6D878"/><path d="M37 45c-8-15 5-23 17-11m37 11c8-15-5-23-17-11" fill="#FFF8D9" stroke="#fff" stroke-width="4"/><ellipse cx="64" cy="68" rx="29" ry="23" fill="#332B1B"/><path d="M47 48h12v40H47zm24 0h12v40H71z" fill="#F3C742"/><circle cx="92" cy="68" r="13" fill="#F3C742"/><circle cx="96" cy="65" r="2" fill="#332B1B"/><path d="M99 72q-5 5-10 0M87 54l-5-9m16 9 5-9" fill="none" stroke="#332B1B" stroke-width="3" stroke-linecap="round"/><path d="m34 68-13-7 2 14z" fill="#332B1B"/><path d="M41 100q-16-3-18-17 17 2 18 17m46 0q16-3 18-17-17 2-18 17" fill="#77A66A"/></svg>',
  },
  {
    id: 'preset:bee-lavender',
    label: 'Lavender Bee',
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><rect width="128" height="128" rx="28" fill="#E8DDF6"/><path d="M25 92q-1-24 12-42m-2 17q14-5 16-18m-23 29q-13-2-17-14m76 29q1-24-12-42m2 17q-14-5-16-18m23 29q13-2 17-14" fill="none" stroke="#72966D" stroke-width="5" stroke-linecap="round"/><path d="M45 51c-7-13 4-19 14-9m22 9c7-13-4-19-14-9" fill="#FFF" stroke="#fff" stroke-width="3"/><ellipse cx="61" cy="69" rx="24" ry="20" fill="#332B1B"/><path d="M48 51h10v36H48zm20 0h10v36H68z" fill="#F3C742"/><circle cx="84" cy="69" r="11" fill="#F3C742"/><circle cx="87" cy="66" r="1.8" fill="#332B1B"/><path d="M91 73q-4 4-8 0m3-15-3-7m12 7 4-7" fill="none" stroke="#332B1B" stroke-width="2.5" stroke-linecap="round"/><circle cx="26" cy="42" r="6" fill="#B694D2"/><circle cx="95" cy="40" r="6" fill="#B694D2"/><circle cx="107" cy="82" r="6" fill="#B694D2"/></svg>',
  },
  {
    id: 'preset:bee-meadow',
    label: 'Meadow Bee',
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><rect width="128" height="128" rx="28" fill="#D9EFE0"/><circle cx="25" cy="29" r="7" fill="#F5D263"/><circle cx="101" cy="30" r="5" fill="#fff"/><path d="M25 99q0-29 17-45m-8 21q-12-2-16-13m82 37q0-29-17-45m8 21q12-2 16-13" fill="none" stroke="#69956A" stroke-width="5" stroke-linecap="round"/><path d="M43 49c-6-12 5-17 13-8m19 8c6-12-5-17-13-8" fill="#FFF" stroke="#fff" stroke-width="3"/><ellipse cx="59" cy="67" rx="23" ry="19" fill="#322B1C"/><path d="M47 50h10v34H47zm19 0h10v34H66z" fill="#F3C742"/><circle cx="80" cy="67" r="10" fill="#F3C742"/><circle cx="83" cy="64" r="1.7" fill="#322B1C"/><path d="M86 71q-4 4-8 0m3-14-3-6m11 6 3-6" fill="none" stroke="#322B1C" stroke-width="2.5" stroke-linecap="round"/><path d="M21 57l3-6 3 6 6 3-6 3-3 6-3-6-6-3zm77 39 2-5 3 5 5 3-5 2-3 6-2-6-6-2z" fill="#F3C742"/></svg>',
  },
  {
    id: 'preset:daisy',
    label: 'Daisy',
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><rect width="128" height="128" rx="28" fill="#FFF5D9"/><path d="M64 72v36m0-16q-19-17-30-4 14 17 30 12m0-8q18-17 30-4-13 17-30 12" fill="#79A36C"/><g fill="#fff"><ellipse cx="64" cy="37" rx="10" ry="19"/><ellipse cx="64" cy="91" rx="10" ry="19"/><ellipse cx="37" cy="64" rx="19" ry="10"/><ellipse cx="91" cy="64" rx="19" ry="10"/><ellipse cx="45" cy="45" rx="10" ry="18" transform="rotate(-45 45 45)"/><ellipse cx="83" cy="45" rx="10" ry="18" transform="rotate(45 83 45)"/><ellipse cx="45" cy="83" rx="10" ry="18" transform="rotate(45 45 83)"/><ellipse cx="83" cy="83" rx="10" ry="18" transform="rotate(-45 83 83)"/></g><circle cx="64" cy="64" r="19" fill="#F2C441"/><circle cx="58" cy="61" r="2" fill="#9A6B25"/><circle cx="69" cy="61" r="2" fill="#9A6B25"/><path d="M58 69q6 6 12 0" fill="none" stroke="#9A6B25" stroke-width="2.5" stroke-linecap="round"/></svg>',
  },
  {
    id: 'preset:sunflower',
    label: 'Sunflower',
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><rect width="128" height="128" rx="28" fill="#F8E8B4"/><path d="M64 75v33m0-15q-18-16-29-4 13 16 29 12m0-8q17-16 29-4-13 16-29 12" fill="#6F9A64"/><g fill="#E6AD32"><ellipse cx="64" cy="35" rx="9" ry="18"/><ellipse cx="64" cy="93" rx="9" ry="18"/><ellipse cx="35" cy="64" rx="18" ry="9"/><ellipse cx="93" cy="64" rx="18" ry="9"/><ellipse cx="44" cy="44" rx="9" ry="18" transform="rotate(-45 44 44)"/><ellipse cx="84" cy="44" rx="9" ry="18" transform="rotate(45 84 44)"/><ellipse cx="44" cy="84" rx="9" ry="18" transform="rotate(45 44 84)"/><ellipse cx="84" cy="84" rx="9" ry="18" transform="rotate(-45 84 84)"/></g><circle cx="64" cy="64" r="22" fill="#594129"/><g fill="#D7A13A"><circle cx="55" cy="57" r="2"/><circle cx="65" cy="54" r="2"/><circle cx="73" cy="60" r="2"/><circle cx="57" cy="67" r="2"/><circle cx="68" cy="69" r="2"/><circle cx="63" cy="77" r="2"/></g></svg>',
  },
  {
    id: 'preset:blossom',
    label: 'Pink Blossom',
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><rect width="128" height="128" rx="28" fill="#F4DDE4"/><path d="M63 108V67m0 23q-19-18-31-5 14 18 31 13m0-9q18-18 31-5-14 18-31 13" fill="#6D9669"/><g fill="#E995AD"><ellipse cx="64" cy="42" rx="12" ry="23"/><ellipse cx="64" cy="86" rx="12" ry="23"/><ellipse cx="42" cy="64" rx="23" ry="12"/><ellipse cx="86" cy="64" rx="23" ry="12"/><ellipse cx="48" cy="48" rx="12" ry="22" transform="rotate(-45 48 48)"/><ellipse cx="80" cy="48" rx="12" ry="22" transform="rotate(45 80 48)"/><ellipse cx="48" cy="80" rx="12" ry="22" transform="rotate(45 48 80)"/><ellipse cx="80" cy="80" rx="12" ry="22" transform="rotate(-45 80 80)"/></g><circle cx="64" cy="64" r="15" fill="#F2C647"/><circle cx="59" cy="62" r="1.8" fill="#885D36"/><circle cx="69" cy="62" r="1.8" fill="#885D36"/><path d="M59 69q5 5 10 0" fill="none" stroke="#885D36" stroke-width="2" stroke-linecap="round"/></svg>',
  },
] as const

export type AvatarPresetId = (typeof AVATAR_PRESETS)[number]['id']

export function getAvatarPreset(value?: string) {
  return AVATAR_PRESETS.find((preset) => preset.id === value)
}

export function AvatarArtwork({ id }: { id: string }) {
  const preset = getAvatarPreset(id)
  const artwork = preset?.svg.replace(' rx="28"', '')
  return artwork ? <SvgXml xml={artwork} width="100%" height="100%" /> : null
}
