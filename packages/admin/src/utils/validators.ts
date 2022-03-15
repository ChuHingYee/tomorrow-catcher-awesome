import type { RuleItem } from 'async-validator'
import Regex from '@/utils/regex'
export const checkPassword: RuleItem['validator'] = (rule, value, callback) => {
  const { required } = rule
  if (value) {
    value = `${value}`.replace(/(^\s*)|(\s*$)/g, '')
    if (!Regex.password.test(value)) {
      // eslint-disable-next-line n/no-callback-literal
      callback('请输入6-19数字或字母')
    } else {
      callback()
    }
  } else if (required) {
    // eslint-disable-next-line n/no-callback-literal
    callback('请输入6-19数字或字母')
  } else {
    callback()
  }
}
export const checkAccount: RuleItem['validator'] = (rule, value, callback) => {
  const { required } = rule
  if (value) {
    if (!Regex.account.test(value)) {
      // eslint-disable-next-line n/no-callback-literal
      callback('账号格式不对，请重新输入')
    }
    callback()
  } else if (required) {
    // eslint-disable-next-line n/no-callback-literal
    callback('账号格式不对，请重新输入')
  } else {
    callback()
  }
}
