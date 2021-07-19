import gsap from 'gsap/all'
import { App } from '../core/app'
import { ResourceManager } from '../core/resourceManager'
import config from './config'

// 단어사운드의 인덱스를 가져온다
export function getSound(word: string) {
  const words = [
    '아',
    '아야',
    '야',
    '어',
    '여아',
    '오',
    '요요',
    '우',
    '우유',
    '여우',
    '여유',
    '으',
    '이유',
    '아이',
    '고기',
    '코',
    '꼬끼오',
    '구',
    '쿠키',
    '누나',
    '두유',
    '띠',
    '노크',
    '도끼',
    '머리띠',
    '토끼',
    '라디오',
    '무',
    '타이어',
    '라마',
    '나무',
    '비버',
    '아빠',
    '파',
    '비',
    '뼈',
    '포도',
    '소',
    '씨',
    '사다리',

    '자',
    '가짜',
    '사자',
    '차',
    '아저씨',
    '혀',
    '초',
    '오리',
    '하마',

    '새',
    '얘기',
    '해',
    '얘들아',

    '체조',
    '시계',
    '제비',
    '예배',

    '의자',
    '뇌',
    '의사',
    '교회',

    '사과',
    '돼지',
    '화가',
    '왜가리',

    '귀',
    '샤워',
    '스웨터',
    '쥐',
    '타워',
    '웨이터',

    '악어',
    '환자',
    '돋보기',
    '약국',
    '문',
    '숟가락',

    '활',
    '뱀',
    '입',
    '왕',
    '돌',
    '곰',
    '밥',
    '공',

    '숲',
    '부엌',
    '깎다',
    '깊다',
    '들녘',
    '섞다',

    '짓다',
    '갔다',
    '찾다',
    '빗다',
    '샀다',
    '짖다',

    '쫓다',
    '뱉다',
    '쌓다',
    '빛나다',
    '같다',
    '놓다',

    '읽다',
    '끊다',
    '밝다',
    '많다',

    '짧다',
    '옳다',
    '넓다',
    '잃다',

    '앉다',
    '없다',
    '얹다',
    '값',

    '삶다',
    '핥다',
    '굶다',
    '훑다',

    '읊다',
    '외곬',
    '몫'
  ]
  for (const w of words) {
    if (word == w) {
      const index = words.indexOf(w) + 1
      return index
      break
    }
  }
}
// 짝꿍한글 자음 모음 코드넘버
export function syllableToNum(syllable: string) {
  let syllableCode = ''
  const list = [
    'ㄱ', //1
    'ㅋ', //2
    'ㄲ', //3
    'ㄴ', //4
    'ㄷ', //5
    'ㄸ', //6
    'ㅌ', //7
    'ㄹ', //8
    'ㅁ', //9
    'ㅂ', //10
    'ㅃ', //11
    'ㅍ', //12
    'ㅅ', //13
    'ㅆ', //14
    'ㅈ', //15
    'ㅉ', //16
    'ㅊ', //17
    'ㅇ', //18
    'ㅎ', //19
    'ㅗ', //20
    'ㅛ', //21
    'ㅜ', //22
    'ㅠ', //23
    'ㅡ', //24
    'ㅏ', //25
    'ㅑ', //26
    'ㅓ', //27
    'ㅕ', //28
    'ㅣ', //29
    'ㅔ', //30
    'ㅐ', //31
    'ㅒ', //32
    'ㅖ', //33
    'ㅚ', //34
    'ㅙ', //35
    'ㅝ', //36
    'ㅞ', //37
    'ㅢ', //38
    'ㅘ', //39
    'ㅟ', //40
    'ㄺ', //41
    'ㄶ', //42
    'ㄼ', //43
    'ㅀ', //44
    'ㄵ', //45
    'ㅄ', //46
    'ㄻ', //47
    'ㄾ', //48
    'ㄿ', //49
    'ㄽ', //50
    'ㄳ' //51
  ]
  for (const num of list) {
    if (num.toString() == syllable) {
      syllableCode = (list.indexOf(num) + 1).toString()
      break
    }
  }

  return syllableCode
}

//이거 쓰면 안되겠다
// /*초성/중성/종성*/음소의 타입 이미지를 가져온다
export function getSyllableType(syllable: string) {
  let type = ''
  const cho = [
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
  const jung = [
    'ㅗ',
    'ㅛ',
    'ㅜ',
    'ㅠ',
    'ㅡ',
    'ㅏ',
    'ㅑ',
    'ㅓ',
    'ㅕ',
    'ㅣ',
    'ㅔ',
    'ㅐ',
    'ㅒ',
    'ㅖ',
    'ㅚ',
    'ㅙ',
    'ㅝ',
    'ㅞ',
    'ㅢ',
    'ㅘ',
    'ㅟ'
  ]
  const jong = [
    'ㄺ',
    'ㄶ',
    'ㄼ',
    'ㅀ',
    'ㄵ',
    'ㅄ',
    'ㄻ',
    'ㄾ',
    'ㄿ',
    'ㄽ',
    'ㄳ'
  ]
  for (const chosung of cho) {
    if (syllable == chosung) {
      type = '1cho_'
      break
    }
  }
  for (const jungsung of jung) {
    if (syllable == jungsung) {
      type = '2jung_'
      break
    }
  }
  for (const jongsung of jong) {
    if (syllable == jongsung) {
      type = '3jong_'
      break
    }
  }

  return type
}

// 배열 섞어 주는 함수
export function shuffleArray(a: Array<any>) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
// 컨테이너나 스프라이트 등 라인 그리는 함수
export function debugLine(target: any, color?: number) {
  const debug = new PIXI.Graphics()
  debug.lineStyle(2, 0xffffff, 1)
  debug.drawRect(0, 0, target.width, target.height)
  debug.endFill()
  target.addChild(debug)

  if (color) {
    debug.tint = color
  } else {
    debug.tint = 0xff0000
  }
}
// 한 음절을 음소로 쪼개주는 함수
export function getConstantVowel(kor: string) {
  const f = [
    'ㄱ',
    'ㄲ',
    'ㄴ',
    'ㄷ',
    'ㄸ',
    'ㄹ',
    'ㅁ',
    'ㅂ',
    'ㅃ',
    'ㅅ',
    'ㅆ',
    'ㅇ',
    'ㅈ',
    'ㅉ',
    'ㅊ',
    'ㅋ',
    'ㅌ',
    'ㅍ',
    'ㅎ'
  ]
  const s = [
    'ㅏ',
    'ㅐ',
    'ㅑ',
    'ㅒ',
    'ㅓ',
    'ㅔ',
    'ㅕ',
    'ㅖ',
    'ㅗ',
    'ㅘ',
    'ㅙ',
    'ㅚ',
    'ㅛ',
    'ㅜ',
    'ㅝ',
    'ㅞ',
    'ㅟ',
    'ㅠ',
    'ㅡ',
    'ㅢ',
    'ㅣ'
  ]
  const t = [
    '',
    'ㄱ',
    'ㄲ',
    'ㄳ',
    'ㄴ',
    'ㄵ',
    'ㄶ',
    'ㄷ',
    'ㄹ',
    'ㄺ',
    'ㄻ',
    'ㄼ',
    'ㄽ',
    'ㄾ',
    'ㄿ',
    'ㅀ',
    'ㅁ',
    'ㅂ',
    'ㅄ',
    'ㅅ',
    'ㅆ',
    'ㅇ',
    'ㅈ',
    'ㅊ',
    'ㅋ',
    'ㅌ',
    'ㅍ',
    'ㅎ'
  ]

  const ga = 44032
  let uni = kor.charCodeAt(0)

  uni = uni - ga

  const fn = parseInt(`${uni / 588}`)
  const sn = parseInt(`${(uni - fn * 588) / 28}`)
  const tn = parseInt(`${uni % 28}`)

  if (tn == 0) {
    return [f[fn], s[sn]]
  } else {
    return [f[fn], s[sn], t[tn]]
  }
}

// 한 음절의 타입을 알아내는 함수
export function getCombinationType(kor: string) {
  if (kor.length > 1) {
    return 0
  }
  const f = [
    'ㄱ',
    'ㄲ',
    'ㄴ',
    'ㄷ',
    'ㄸ',
    'ㄹ',
    'ㅁ',
    'ㅂ',
    'ㅃ',
    'ㅅ',
    'ㅆ',
    'ㅇ',
    'ㅈ',
    'ㅉ',
    'ㅊ',
    'ㅋ',
    'ㅌ',
    'ㅍ',
    'ㅎ'
  ]
  const s = [
    'ㅏ',
    'ㅐ',
    'ㅑ',
    'ㅒ',
    'ㅓ',
    'ㅔ',
    'ㅕ',
    'ㅖ',
    'ㅗ',
    'ㅘ',
    'ㅙ',
    'ㅚ',
    'ㅛ',
    'ㅜ',
    'ㅝ',
    'ㅞ',
    'ㅟ',
    'ㅠ',
    'ㅡ',
    'ㅢ',
    'ㅣ'
  ]
  const t = [
    '',
    'ㄱ',
    'ㄲ',
    'ㄳ',
    'ㄴ',
    'ㄵ',
    'ㄶ',
    'ㄷ',
    'ㄹ',
    'ㄺ',
    'ㄻ',
    'ㄼ',
    'ㄽ',
    'ㄾ',
    'ㄿ',
    'ㅀ',
    'ㅁ',
    'ㅂ',
    'ㅄ',
    'ㅅ',
    'ㅆ',
    'ㅇ',
    'ㅈ',
    'ㅊ',
    'ㅋ',
    'ㅌ',
    'ㅍ',
    'ㅎ'
  ]

  /**ex> 아 야 */
  const type1 = ['ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅣ']
  /**ex> 우 누 */
  const type2 = ['ㅡ', 'ㅜ', 'ㅠ', 'ㅗ', 'ㅛ']
  /**ex> 와 괘 */
  const type3 = ['ㅘ', 'ㅙ', 'ㅚ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅢ']

  // type4 => type1 인데 받침이 있을 때 ex> 앙 엉
  // type5 => type2 인데 받침이 있을 때 ex> 응 웅 융
  // type6 => type3 인데 받침이 있을 때 ex> 왕 왱 읭

  const ga = 44032
  let uni = kor.charCodeAt(0)

  uni = uni - ga

  const fn = parseInt(`${uni / 588}`)
  const sn = parseInt(`${(uni - fn * 588) / 28}`)
  const tn = parseInt(`${uni % 28}`)

  let type = 0
  const types = [type1, type2, type3]

  for (let i = 0; i < types.length; i++) {
    for (let j = 0; j < types[i].length; j++) {
      if (s[sn] === types[i][j]) {
        type = i + 1
      }
    }
  }

  if (t[tn] !== '') {
    type += 3
  }
  return type
}

//짝꿍한글 리소스이름 만들기
export function getResourceList(quiz: string) {
  let quizAry = []
  const ary = []
  for (let i = 0; i < quiz.length; i++) {
    ary[i] = getConstantVowel(quiz[i])
  }

  quizAry = [...ary]

  let length = 0
  for (let i = 0; i < quizAry.length; i++) {
    for (let j = 0; j < quizAry[i].length; j++) {
      length += 1
    }
  }
  // console.log(length)
  const list = {}
  for (let i = 0; i < length; i++) {
    list[i] = { index: 0, syllableIndex: 0, type: 0 }
  }

  let aryIndex = 0
  // let endIndex = 0
  for (let i = 0; i < quizAry.length; i++) {
    list[aryIndex].index = aryIndex
    list[aryIndex].syllableIndex = i
    list[aryIndex].type = getCombinationType(quizAry[i])
    // console.log(quizAry[i])
    aryIndex += 1
    // console.log(aryIndex)
  }
  return list
}

// // 사운드
// export function soundPlay(rscName: string, common?: boolean) {
//   // common이
//   // true 이면 공통리소스에서 찾아오고
//   // false 이거나 없으면 실행하고 있는 게임에서 찾아온다

//   if (window['soundManager']) {
//     window['soundManager'].pause()
//     window['soundManager'] = null
//   }

//   // // console.error(rscName)
//   // // console.error(common)
//   let sound = null
//   if (common) {
//     sound = ResourceManager.Handle.getCommonResource(`${rscName}.mp3`).sound
//   } else {
//     sound = ResourceManager.Handle.getViewerResource(`${rscName}.mp3`).sound
//   }
//   window['soundManager'] = sound
//   sound.play()
//   gsap.delayedCall(sound.duration, () => {
//     sound = null
//     window['soundManager'] = null
//   })
// }

export function getColorMap(baseTex: any) {
  if (!baseTex.resource) {
    //renderTexture
    return false
  }
  const imgSource = baseTex.resource.source
  let canvas = null
  if (!imgSource) {
    return false
  }
  let context = null
  if (imgSource.getContext) {
    canvas = imgSource
    context = canvas.getContext('2d')
  } else if (imgSource instanceof Image) {
    canvas = document.createElement('canvas')
    canvas.width = imgSource.width
    canvas.height = imgSource.height
    context = canvas.getContext('2d')
    context.drawImage(imgSource, 0, 0)
  } else {
    //unknown source;
    return false
  }

  const w = canvas.width,
    h = canvas.height
  baseTex.colormap = context.getImageData(0, 0, w, h)
  return true
}

export function getColorByPoint(spr: PIXI.Sprite, globalPoint: PIXI.Point) {
  const tempPoint = new PIXI.Point()
  spr.worldTransform.applyInverse(globalPoint, tempPoint)

  const width = spr.texture.orig.width
  const height = spr.texture.orig.height
  const x1 = -width * spr.anchor.x
  let y1 = 0

  let flag = false

  if (tempPoint.x >= x1 && tempPoint.x < x1 + width) {
    y1 = -height * spr.anchor.y

    if (tempPoint.y >= y1 && tempPoint.y < y1 + height) {
      flag = true
    }
  }

  if (!flag) {
    return { r: 0, g: 0, b: 0, a: 0 }
  }

  const tex = spr.texture
  const baseTex: any = spr.texture.baseTexture
  if (!baseTex.colormap) {
    if (!getColorMap(baseTex)) {
      return { r: 0, g: 0, b: 0, a: 0 }
    }
  }

  const colormap = baseTex.colormap
  const data = colormap.data
  const res = baseTex.resolution
  // this does not account for rotation yet!!!

  const dx = Math.round((tempPoint.x - x1 + tex.frame.x) * res)
  const dy = Math.round((tempPoint.y - y1 + tex.frame.y) * res)
  const num = dx + dy * colormap.width

  // // console.log("tempPoint:", tempPoint, "tex.frame:", tex.frame, "res:", res, "num:", num, "colormap.width:", colormap.width);
  return {
    r: data[num * 4],
    g: data[num * 4 + 1],
    b: data[num * 4 + 2],
    a: data[num * 4 + 3]
  }
}

export function getSymbol() {
  const data = config.data
  const studyDay = config.selectDay

  return data[`${studyDay}`]['symbol']
}
