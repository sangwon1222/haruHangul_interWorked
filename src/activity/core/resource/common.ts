const imageList = [
  'video_bar.png',
  'video_bg.png',
  'video_current.png',

  'hand.png',
  'cursor.png',

  'play_button.png',
  'stop_button.png',

  'btn_play.png',
  'btn_play_bubble.png',

  'rec_dim.png',
  'rec_on.png',
  'btn_rec_play.png',
  'play.png',

  'btn_sound_normal.png',
  'btn_sound_on.png',

  'outro_check.png',
  'outro_next_btn.png',
  'outro_stage.png',

  't1_line.png',
  't2_line.png',
  't3_line.png',
  't4_line.png',
  't5_line.png',
  't6_line.png',

  // *********How To*********
  'btn_pre.png',
  'btn_next.png',
  'btn_close.png',

  'howto_index.png',
  'howto_pagi_off.png',
  'howto_pagi_on.png',

  'howto_today_1.png',
  'howto_today_2.png',

  'howto_rhythm_1.png',
  'howto_rhythm_2.png',
  'howto_rhythm_3.png',

  'howto_paint_1.png',
  'howto_paint_2.png',
  'howto_paint_3.png',
  'howto_paint_4.png',

  'howto_partner_1.png',
  'howto_partner_2.png',
  'howto_partner_3.png',

  'howto_myhangul_1.png',
  'howto_myhangul_2.png',
  'howto_myhangul_3.png',
  'howto_myhangul_4.png',

  'howto_nodak_1.png',
  'howto_nodak_2.png',
  'howto_nodak_3.png',
  'howto_nodak_4.png',

  'howto_total_1.png',
  'howto_total_2.png',
  'howto_total_3.png',
  'howto_total_4.png'
]
const soundsList = [
  // 사운드는 widget> intro > playTitleSound()에서 직접 로드 후 재생
  'ac1_title.mp3', //today => 오늘한글
  'ac2_title.mp3', //rhythm => 리듬한글
  'ac3_title.mp3', //paint => 색칠한글
  'ac4_title.mp3', //partner => 짝꿍한글
  'ac5_title.mp3', //myhangul => 나의한글
  'ac6_title.mp3', //nodak => 노닥한글
  'ac7_title.mp3', //total => 깨단한글
  'com_button_click.mp3',
  'com_eop_sfx.mp3',
  'com_eop_sound1.mp3',
  'com_eop_sound2.mp3',
  'com_eop_sound3.mp3',
  'com_eop_sound4.mp3',
  'ac1_playpop.mp3',
  'com_intro_bgm.mp3',
  'com_intro_eff.mp3'
]
const videoList = []
const spineList = [
  'intro.json',
  'timer_3sec.json',
  'outro.json',
  'star_effect.json'
]

export const Common = {
  images: imageList,
  sounds: soundsList,
  json: [],
  videos: videoList,
  spine: spineList
}
