/**
 * 设置 storage
 * @param key
 * @param value 
 */
export const setStore = <T>(key: string, value: T) => {
  localStorage.setItem(key, JSON.stringify(value))
}

/**
 * 获取 storage
 * @param key 
 * @returns 
 */
export const getStore = (key: string): any => {
  const val = localStorage.getItem(key)
  if (val) {
    return JSON.parse(val)
  }
  return ''
}