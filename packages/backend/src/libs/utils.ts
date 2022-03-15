import * as dayjs from 'dayjs';
import * as random from 'lodash.random';
import * as bcrypt from 'bcrypt';
import * as jsonwebtoken from 'jsonwebtoken';
const saltRounds = 10;
const expires = 60 * 60;

export function formatHour(date: dayjs.ConfigType): string {
  return dayjs(date).format('HH:mm');
}

export function formatDay(date: dayjs.ConfigType): string {
  return dayjs(date).format('YYYY-MM-DD');
}

export function formatMonth(date: dayjs.ConfigType): string {
  return dayjs(date).format('YYYY-MM');
}

export function formatYear(date: dayjs.ConfigType): string {
  return dayjs(date).format('YYYY');
}

export function getYearStartAndEnd(date: dayjs.ConfigType): {
  start: number;
  end: number;
} {
  const _current = dayjs(date);
  return {
    start: _current.startOf('year').valueOf(),
    end: _current.endOf('year').valueOf(),
  };
}

export function getMonthStartAndEnd(date: dayjs.ConfigType): {
  start: number;
  end: number;
} {
  const _current = dayjs(date);
  return {
    start: _current.startOf('month').valueOf(),
    end: _current.endOf('month').valueOf(),
  };
}

export function getDaysInMonth(date: dayjs.ConfigType): number {
  return dayjs(date).daysInMonth();
}

export function initRandomString(length: number): string {
  const letters = 'abcdefghijklmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < length; i++) {
    result = result + letters[random(23)];
  }
  return result;
}

export function bhash(pass: string) {
  return bcrypt.hashSync(pass, saltRounds);
}
export function bcompare(password: string, hash: string) {
  return bcrypt.compareSync(password, hash);
}
export function generateToken(
  value: any,
  unit: number,
  secret: string
): string {
  try {
    return jsonwebtoken.sign(value, secret, { expiresIn: expires * unit });
  } catch (e) {
    console.error('jwt sign error --->', e);
    return '';
  }
}
export function verifyToken(token: string, secret: string) {
  try {
    return jsonwebtoken.verify(token, secret); // 如果过期将返回false
  } catch (e) {
    console.error('jwt verify error --->', e);
    return false;
  }
}
