import { atom } from "recoil";

export const inputState = atom({
  key: 'input',
  default: '',
})

export const typeState = atom({
  key: 'type',
  default: 'stat',
})

export const charState = atom({
  key: 'char',
  default: '',
})

export const observerState = atom({
  key: 'observer',
  default: 'false',
})
