export default {
  reload: 'https://imestudy.smartdoodle.net:443',

  /** plugin 폴더 하위 axios.js파일 > config의 baseURL도 바꿔줘야 한다.*/

  // /** *************상용************* */
  // mainPage: 'https://arambookclub.com',
  // restAPI: 'https://api.arambookclub.com',
  // restAPIProd: 'https://api.arambookclub.com/learning/hangul/activities',
  // puzzleAPI: 'https://api.arambookclub.com/learning/hangul/puzzles',

  // /** *************_TOBE_************* */
  // mainPage: 'https://tobe-qa.arambookclub.com',
  // restAPI: 'https://tobe-qa-user-api.arambookclub.com',
  // restAPIProd:
  //   'https://tobe-qa-user-api.arambookclub.com/learning/hangul/activities',
  // puzzleAPI:
  //   'https://tobe-qa-user-api.arambookclub.com/learning/hangul/puzzles',
  /** *************_TOBE_************* */

  // /** *************_QA_************* */
  mainPage: 'https://dev.arambookclub.com',
  restAPI: 'https://qa-api.arambookclub.com',
  restAPIProd: 'https://qa-api.arambookclub.com/learning/hangul/activities',
  puzzleAPI: 'https://qa-api.arambookclub.com/learning/hangul/puzzles',
  // /** *************_QA_************* */

  resource: 'https://contents.arambookclub.com/contents/hangul/res/',
  // resource: 'https://imestudy.smartdoodle.net:443/rsc/',

  w: 1280,
  h: 720,
  fontAry: [
    'BareunBatangOTFM',
    'TmoneyRoundWindExtraBold',
    'NanumBarunGothicBold'
  ],
  studyDay: 1,
  selectDay: 1,
  puzzleStep: 0,
  /**3,6,9,12,15,16,20,24,28,32,35,38,42,43 */
  data: {
    1: { type: '2jung_', symbolType: `t1_`, symbol: ['ㅏ'], word: ['아'] },
    2: { type: '2jung_', symbolType: `t1_`, symbol: ['ㅑ'], word: ['아야'] },
    3: {
      type: '2jung_',
      symbolType: `t1_`,
      symbol: ['ㅏ', 'ㅑ'],
      word: ['아', '아야', '야']
    },
    4: { type: '2jung_', symbolType: `t1_`, symbol: ['ㅓ'], word: ['어'] },
    5: { type: '2jung_', symbolType: `t1_`, symbol: ['ㅕ'], word: ['여아'] },
    6: {
      type: '2jung_',
      symbolType: `t1_`,
      symbol: ['ㅓ', 'ㅕ'],
      word: ['어', '여아']
    },
    7: { type: '2jung_', symbolType: `t2_`, symbol: ['ㅗ'], word: ['오'] },
    8: { type: '2jung_', symbolType: `t2_`, symbol: ['ㅛ'], word: ['요요'] },
    9: {
      type: '2jung_',
      symbolType: `t2_`,
      symbol: ['ㅗ', 'ㅛ'],
      word: ['오', '요요']
    },
    10: { type: '2jung_', symbolType: `t2_`, symbol: ['ㅜ'], word: ['우'] },
    11: { type: '2jung_', symbolType: `t2_`, symbol: ['ㅠ'], word: ['우유'] },
    12: {
      type: '2jung_',
      symbol: ['ㅜ', 'ㅠ'],
      word: ['우', '우유', '여우', '여유']
    },
    13: { type: '2jung_', symbolType: `t2_`, symbol: ['ㅡ'], word: ['으'] },
    14: { type: '2jung_', symbolType: `t1_`, symbol: ['ㅣ'], word: ['이유'] },
    15: {
      type: '2jung_',
      symbolType: `t2_`,
      symbol: ['ㅡ', 'ㅣ'],
      word: ['으', '이유', '아이']
    },
    16: {
      word: [],
      symbol: ['ㅏ', 'ㅑ', 'ㅓ', 'ㅕ', 'ㅗ', 'ㅛ', 'ㅜ', 'ㅠ', 'ㅡ', 'ㅣ']
    },
    17: { type: '1cho_', symbolType: `t2_`, symbol: ['ㄱ'], word: ['고기'] },
    18: { type: '1cho_', symbolType: `t2_`, symbol: ['ㅋ'], word: ['코'] },
    19: { type: '1cho_', symbolType: `t2_`, symbol: ['ㄲ'], word: ['꼬끼오'] },
    20: {
      symbol: ['ㄱ', 'ㅋ', 'ㄲ'],
      word: ['고기', '코', '꼬끼오', '구', '쿠키']
    },
    21: { type: '1cho_', symbolType: `t2_`, symbol: ['ㄴ'], word: ['누나'] },
    22: { type: '1cho_', symbolType: `t2_`, symbol: ['ㄷ'], word: ['두유'] },
    23: { type: '1cho_', symbolType: `t1_`, symbol: ['ㄸ'], word: ['띠'] },
    24: {
      symbol: ['ㄴ', 'ㄷ', 'ㄸ'],
      word: ['누나', '두유', '띠', '노크', '도끼', '머리띠']
    },
    25: { type: '1cho_', symbolType: `t2_`, symbol: ['ㅌ'], word: ['토끼'] },
    26: { type: '1cho_', symbolType: `t1_`, symbol: ['ㄹ'], word: ['라디오'] },
    27: { type: '1cho_', symbolType: `t2_`, symbol: ['ㅁ'], word: ['무'] },
    28: {
      symbol: ['ㅌ', 'ㄹ', 'ㅁ'],
      word: ['토끼', '라디오', '무', '타이어', '라마', '나무']
    },
    29: { type: '1cho_', symbolType: `t1_`, symbol: ['ㅂ'], word: ['비버'] },
    30: { type: '1cho_', symbolType: `t1_`, symbol: ['ㅃ'], word: ['아빠'] },
    31: { type: '1cho_', symbolType: `t1_`, symbol: ['ㅍ'], word: ['파'] },
    32: {
      symbol: ['ㅂ', 'ㅃ', 'ㅍ'],
      word: ['비버', '아빠', '파', '비', '뼈', '포도']
    },
    33: { type: '1cho_', symbolType: `t2_`, symbol: ['ㅅ'], word: ['소'] },
    34: { type: '1cho_', symbolType: `t1_`, symbol: ['ㅆ'], word: ['씨'] },
    35: {
      type: '1cho_',
      symbolType: `t2_`,
      symbol: ['ㅅ', 'ㅆ'],
      word: ['소', '씨', '사다리']
    },
    36: { type: '1cho_', symbolType: `t1_`, symbol: ['ㅈ'], word: ['자'] },
    37: { type: '1cho_', symbolType: `t1_`, symbol: ['ㅉ'], word: ['가짜'] },
    38: {
      type: '1cho_',
      symbolType: `t1_`,
      symbol: ['ㅈ', 'ㅉ'],
      word: ['자', '가짜', '사자']
    },
    39: { type: '1cho_', symbolType: `t1_`, symbol: ['ㅊ'], word: ['차'] },
    40: { type: '1cho_', symbolType: `t1_`, symbol: ['ㅇ'], word: ['아저씨'] },
    41: { type: '1cho_', symbolType: `t1_`, symbol: ['ㅎ'], word: ['혀'] },
    42: {
      symbol: ['ㅊ', 'ㅇ', 'ㅎ'],
      word: ['차', '아저씨', '혀', '초', '오리', '하마']
    },
    43: {
      word: [],
      symbol: [
        'ㄱ',
        'ㅋ',
        'ㄲ',
        'ㄴ',
        'ㄷ',
        'ㄸ',
        'ㅌ',
        'ㄹ',
        'ㅁ',
        'ㅂ',
        'ㅃ',
        'ㅍ',
        'ㅅ',
        'ㅆ',
        'ㅈ',
        'ㅉ',
        'ㅊ',
        'ㅇ',
        'ㅎ'
      ]
    },
    44: { type: '2jung_', symbolType: `t1_`, symbol: ['ㅐ'], word: ['새'] },
    45: { type: '2jung_', symbolType: `t1_`, symbol: ['ㅒ'], word: ['얘기'] },
    46: {
      type: '2jung_',
      symbol: ['ㅐ', 'ㅒ'],
      word: ['새', '얘기', '해', '얘들아']
    },
    47: { type: '2jung_', symbolType: `t1_`, symbol: ['ㅔ'], word: ['체조'] },
    48: { type: '2jung_', symbolType: `t1_`, symbol: ['ㅖ'], word: ['시계'] },
    49: {
      type: '2jung_',
      symbol: ['ㅔ', 'ㅖ'],
      word: ['채조', '시계', '제비', '예배']
    },
    50: { type: '2jung_', symbolType: `t3_`, symbol: ['ㅢ'], word: ['의자'] },
    51: { type: '2jung_', symbolType: `t3_`, symbol: ['ㅚ'], word: ['뇌'] },
    52: {
      type: '2jung_',
      symbol: ['ㅢ', 'ㅚ'],
      word: ['의자', '뇌', '의사', '교회']
    },
    53: { type: '2jung_', symbolType: `t3_`, symbol: ['ㅘ'], word: ['사과'] },
    54: { type: '2jung_', symbolType: `t3_`, symbol: ['ㅙ'], word: ['돼지'] },
    55: {
      type: '2jung_',
      symbol: ['ㅘ', 'ㅙ'],
      word: ['사과', '돼지', '화가', '왜가리']
    },
    56: { type: '2jung_', symbolType: `t3_`, symbol: ['ㅟ'], word: ['귀'] },
    57: { type: '2jung_', symbolType: `t3_`, symbol: ['ㅝ'], word: ['샤워'] },
    58: { type: '2jung_', symbolType: `t3_`, symbol: ['ㅞ'], word: ['스웨터'] },
    59: {
      symbol: ['ㅝ', 'ㅞ'],
      word: ['귀', '샤워', '스웨터', '쥐', '타워', '웨이터']
    },
    60: {
      word: [],
      symbol: ['ㅐ', 'ㅒ', 'ㅔ', 'ㅖ', 'ㅢ', 'ㅚ', 'ㅘ', 'ㅙ', 'ㅝ', 'ㅞ']
    },
    61: { type: '3jong_', symbolType: `at`, symbol: ['ㄱ'], word: ['악어'] },
    62: { type: '3jong_', symbolType: `at`, symbol: ['ㄴ'], word: ['환자'] },
    63: { type: '3jong_', symbolType: `at`, symbol: ['ㄷ'], word: ['돋보기'] },
    64: { type: '3jong_', symbolType: `at`, symbol: ['ㄱ', 'ㄴ', 'ㄷ'] },
    65: { type: '3jong_', symbolType: `at`, symbol: ['ㄹ'], word: ['활'] },
    66: { type: '3jong_', symbolType: `at`, symbol: ['ㅁ'], word: ['뱀'] },
    67: { type: '3jong_', symbolType: `at`, symbol: ['ㅂ'], word: ['입'] },
    68: { type: '3jong_', symbolType: `at`, symbol: ['ㅇ'], word: ['왕'] },
    69: {
      symbol: ['ㄹ', 'ㅁ', 'ㅂ', 'ㅇ'],
      word: ['활', '뱀', '입', '왕', '돌', '곰', '밥', '공']
    },
    70: {
      word: [],
      symbol: ['ㄱ', 'ㄴ', 'ㄷ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅇ']
    },
    71: { type: '3jong_', symbol: ['ㅍ'], word: ['숲'] },
    72: { type: '3jong_', symbol: ['ㅋ'], word: ['부엌'] },
    73: { type: '3jong_', symbol: ['ㄲ'], word: ['깎다'] },
    74: {
      symbol: ['ㅍ', 'ㅋ', 'ㄲ'],
      word: ['숲', '부엌', '깎다', '깊다', '들녘', '섞다']
    },
    75: { type: '3jong_', symbolType: `at_`, symbol: ['ㅅ'], word: ['짓다'] },
    76: { type: '3jong_', symbolType: `at_`, symbol: ['ㅆ'], word: ['갔다'] },
    77: { type: '3jong_', symbolType: `at_`, symbol: ['ㅈ'], word: ['찾다'] },
    78: {
      symbol: ['ㅅ', 'ㅆ', 'ㅈ'],
      word: ['짓다', '갔다', '찾다', '빗다', '샀다', '짖다']
    },
    79: { type: '3jong_', symbolType: `at_`, symbol: ['ㅊ'], word: ['쫓다'] },
    80: { type: '3jong_', symbolType: `at_`, symbol: ['ㅌ'], word: ['뱉다'] },
    81: { type: '3jong_', symbolType: `at_`, symbol: ['ㅎ'], word: ['쌓다'] },
    82: {
      symbol: ['ㅊ', 'ㅍ', 'ㅎ'],
      word: ['쫓다', '뱉다', '쌓다', '빛나다', '같다', '놓다']
    },
    83: {
      word: '',
      symbol: ['ㅍ', 'ㅋ', 'ㄲ', 'ㅅ', 'ㅆ', 'ㅈ', 'ㅊ', 'ㅍ', 'ㅎ']
    },
    84: { type: '3jong_', symbolType: `at_`, symbol: ['ㄺ'], word: ['읽다'] },
    85: { type: '3jong_', symbolType: `at_`, symbol: ['ㄶ'], word: ['끊다'] },
    86: {
      type: '3jong_',
      symbol: ['ㄺ', 'ㄶ'],
      word: ['읽다', '끊다', '밝다', '많다']
    },
    87: { type: '3jong_', symbolType: `at_`, symbol: ['ㄼ'], word: ['짧다'] },
    88: { type: '3jong_', symbolType: `at_`, symbol: ['ㅀ'], word: ['옳다'] },
    89: {
      type: '3jong_',
      symbol: ['ㄼ', 'ㅀ'],
      word: ['짧다', '옳다', '넓다', '잃다']
    },
    90: { type: '3jong_', symbolType: `at_`, symbol: ['ㄵ'], word: ['앉다'] },
    91: { type: '3jong_', symbolType: `at_`, symbol: ['ㅄ'], word: ['없다'] },
    92: {
      type: '3jong_',
      symbol: ['ㄵ', 'ㅄ'],
      word: ['앉다', '없다', '얹다', '값']
    },
    93: { type: '3jong_', symbolType: `at_`, symbol: ['ㄻ'], word: ['삶다'] },
    94: { type: '3jong_', symbolType: `at_`, symbol: ['ㄾ'], word: ['핥다'] },
    95: {
      type: '3jong_',
      symbol: ['ㄻ', 'ㄾ'],
      word: ['삶다', '핥다', '굶다', '훑다']
    },
    96: { type: '3jong_', symbolType: `at_`, symbol: ['ㄿ'], word: ['읊다'] },
    97: { type: '3jong_', symbolType: `at_`, symbol: ['ㄽ'], word: ['외곬'] },
    98: { type: '3jong_', symbolType: `at_`, symbol: ['ㄳ'], word: ['몫'] },
    99: {
      type: '3jong_',
      symbol: ['ㄿ', 'ㄽ', 'ㄳ'],
      word: ['읊다', '외곬', '몫']
    },
    100: {
      word: ``,
      symbol: ['ㄺ', 'ㄶ', 'ㄼ', 'ㅀ', 'ㄵ', 'ㅄ', 'ㄻ', 'ㄾ', 'ㄿ', 'ㄽ', 'ㄳ']
    }
  },
  quizWord: '아앉',

  partnerNtotal: [
    'box_shadow.png',
    'side_type1_dim1.png',
    'side_type1_dim2.png',
    'side_type1_pink1.png',
    'side_type1_pink2.png',

    'side_type2_dim1.png',
    'side_type2_dim2.png',
    'side_type2_pink1.png',
    'side_type2_pink2.png',

    'side_type3_dim1.png',
    'side_type3_dim2.png',
    'side_type3_pink1.png',
    'side_type3_pink2.png',

    'side_type4_dim1.png',
    'side_type4_dim2.png',
    'side_type4_dim3.png',
    'side_type4_pink1.png',
    'side_type4_pink2.png',
    'side_type4_pink3.png',

    'side_type5_dim1.png',
    'side_type5_dim2.png',
    'side_type5_dim3.png',
    'side_type5_pink1.png',
    'side_type5_pink2.png',
    'side_type5_pink3.png',

    'side_type6_dim1.png',
    'side_type6_dim2.png',
    'side_type6_dim3.png',
    'side_type6_pink1.png',
    'side_type6_pink2.png',
    'side_type6_pink3.png',

    'type1_1deep.png',
    'type1_2deep.png',

    'type1_1default.png',
    'type1_2default.png',

    'type1_1pink.png',
    'type1_2pink.png',

    'type1_focus1.png',
    'type1_focus2.png',

    'type2_1deep.png',
    'type2_2deep.png',

    'type2_1default.png',
    'type2_2default.png',

    'type2_1pink.png',
    'type2_2pink.png',

    'type2_focus1.png',
    'type2_focus2.png',

    'type3_1deep.png',
    'type3_2deep.png',

    'type3_1default.png',
    'type3_2default.png',

    'type3_1pink.png',
    'type3_2pink.png',
    'type3_focus1.png',
    'type3_focus2.png',

    'type4_1deep.png',
    'type4_2deep.png',
    'type4_3deep.png',

    'type4_1default.png',
    'type4_2default.png',
    'type4_3default.png',

    'type4_1pink.png',
    'type4_2pink.png',
    'type4_3pink.png',

    'type4_focus1.png',
    'type4_focus2.png',
    'type4_focus3.png',

    'type5_1deep.png',
    'type5_2deep.png',
    'type5_3deep.png',

    'type5_1default.png',
    'type5_2default.png',
    'type5_3default.png',

    'type5_1pink.png',
    'type5_2pink.png',
    'type5_3pink.png',

    'type5_focus1.png',
    'type5_focus2.png',
    'type5_focus3.png',

    'type6_1deep.png',
    'type6_2deep.png',
    'type6_3deep.png',

    'type6_1default.png',
    'type6_2default.png',
    'type6_3default.png',

    'type6_1pink.png',
    'type6_2pink.png',
    'type6_3pink.png',

    'type6_focus1.png',
    'type6_focus2.png',
    'type6_focus3.png'
  ],

  nodakPos: {
    card2: [
      { x: 712, y: 354 },
      { x: 1024, y: 354 }
    ],
    card3: [
      { x: 570, y: 354 },
      { x: 846, y: 354 },
      { x: 1120, y: 354 }
    ],
    card4: [
      { x: 712, y: 222 },
      { x: 1024, y: 222 },
      { x: 712, y: 484 },
      { x: 1024, y: 484 }
    ],
    card5: [
      { x: 712, y: 222 },
      { x: 1024, y: 222 },
      { x: 572, y: 484 },
      { x: 846, y: 484 },
      { x: 1120, y: 484 }
    ],
    card6: [
      { x: 570, y: 222 },
      { x: 846, y: 222 },
      { x: 1120, y: 222 },
      { x: 570, y: 484 },
      { x: 846, y: 484 },
      { x: 1120, y: 484 }
    ],
    card8: [
      { x: 570, y: 146 },
      { x: 846, y: 146 },
      { x: 570, y: 362 },
      { x: 846, y: 362 },
      { x: 1120, y: 362 },
      { x: 570, y: 578 },
      { x: 846, y: 578 },
      { x: 1120, y: 578 }
    ]
  }
  /**--------------------노닥 패킷 ------------------------------*/
  /**리듬한글 패킷------------------- */
  // quizWrong: ['ㅑ', 'ㅓ']

  // /**짝궁 한글 */
  // /**오답데이터 */
  // partnerWrong: ['ㅁ', 'ㅑ', 'ㅁ', 'ㅑ', 'ㄶ'],

  // /**색칠한글 */
  // btnColor: [
  //   0xe6030f /**빨강 */,
  //   0xf66701 /**주황 */,
  //   0xfbcb13 /**황토 */,
  //   0x1ad518 /**녹색 */,
  //   0x0463f1 /**파랑 */,
  //   0x7003d9 /**보라 */
  // ],
  // btnName: [
  //   'btn_red',
  //   'btn_orange',
  //   'btn_yellow',
  //   'btn_green',
  //   'btn_blue',
  //   'btn_violet'
  // ]
}
