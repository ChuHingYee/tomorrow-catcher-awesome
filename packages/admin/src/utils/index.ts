import dayjs from 'dayjs'
import type { ConfigType } from 'dayjs'

/**
 * 设置localStorage
 * @param key
 * @param value
 */
export function setStorage(key: string, value: any) {
  if (window.localStorage) {
    window.localStorage.setItem(key, JSON.stringify(value))
  }
}

/**
 * 读取localStorage
 * @param key
 * @returns
 */
export function getStorage(key: string) {
  if (window.localStorage) {
    const _value = window.localStorage.getItem(key)
    if (_value) {
      return JSON.parse(_value)
    } else {
      return null
    }
  }
}

/**
 * 清除localStorage
 * @param key
 */
export function removeStorage(key: string) {
  if (window.localStorage) {
    localStorage.removeItem(key)
  }
}
export function formatYearMonthDay(date: ConfigType) {
  return dayjs(date).format('YYYY/MM/DD')
}

export function formatYearMonth(date: ConfigType) {
  return dayjs(date).format('YYYY/MM')
}

export function formatDateDetail(date: ConfigType) {
  return dayjs(date).format('YYYY/MM/DD dddd')
}

export function formatTimeClock(date: ConfigType) {
  return dayjs(date).format('HH:mm')
}

export function formatDateClock(date: ConfigType) {
  return date ? dayjs(date).format('YYYY/MM/DD HH:mm') : '-'
}
