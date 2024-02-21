import one from '../assets/images/digits/numeric-1.svg'
import two from '../assets/images/digits/numeric-2.svg'
import free from '../assets/images/digits/numeric-3.svg'
import four from '../assets/images/digits/numeric-4.svg'
import five from '../assets/images/digits/numeric-5.svg'
import six from '../assets/images/digits/numeric-6.svg'
import seven from '../assets/images/digits/numeric-7.svg'
import eight from '../assets/images/digits/numeric-8.svg'

import flag from '../assets/images/flag.svg'
import question from '../assets/images/question-mark.svg'

type THelpCellIcon = {
  [key: string]: string | undefined
}

export const FLAG = 'flag' 

export const helpCellIcons: THelpCellIcon = {
  'nothing': undefined,
  [FLAG]: flag,
  'question': question
}

export const cellDigits = [one, two, free, four, five, six, seven, eight]