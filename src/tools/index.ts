interface TreeNode {
  id: number
  name: string
  children: TreeNode[]
  [key: string]: any
}

interface FieldNames {
  label: string
  value: string
  parentId: string
  children?: string
}

const defaultFieldNames: FieldNames = {
  label: 'label',
  value: 'value',
  parentId: 'parentId',
  children: 'children'
}

interface ArrayToTreeParams {
  array: any[],
  pId?: number | string | null,
  fieldNames?: FieldNames
}

/**
 * 树转数组
 * @param array 源数组
 * @param pId 父元素id
 * @param fieldNames 自定义字段
 * @returns 源树组
 */
export function arrayToTree({ array, pId, fieldNames }: ArrayToTreeParams): any[] {
  const getFidleNames = { ...defaultFieldNames, ...fieldNames }
  const tree: TreeNode[] = []

  array.forEach((node) => {
    const { [getFidleNames.parentId]: parentId } = node


    if (parentId === pId) {
      const newNode: TreeNode = {
        ...node
      }

      const children = arrayToTree({ array, pId: node[getFidleNames.value], fieldNames })
      if (children.length > 0) {
        newNode.children = children
      }

      tree.push(newNode)
    }
  })

  return tree
}

type FunctionCb = (...args: any[]) => any
interface DebouncedFunction<T extends FunctionCb> {
  (this: ThisParameterType<T>, ...args: Parameters<T>): void
}

/**
 * 防抖函数
 * @param func 执行函数
 * @param wait 等待时间 默认 2s
 * @returns
 */
export function debounce<T extends FunctionCb>(func: T, wait = 2000): DebouncedFunction<T> {
  let timeout: NodeJS.Timeout | null = null

  return function (this: ThisParameterType<T>, ...args: any[]) {
    const later = () => {
      timeout = null
      func.apply(this, args)
    }

    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(later, wait)
  }
}

interface ThrottleFunction<T extends FunctionCb> {
  (this: ThisParameterType<T>, ...args: Parameters<T>): void
}
/**
 * 节流
 * @param func 执行函数
 * @param interval 等待时间 默认 2s
 * @returns
 */
export function throttle<T extends FunctionCb>(func: T, interval = 2000): ThrottleFunction<T> {
  let timeout: NodeJS.Timeout | null = null
  let lastRunTime: number | null = null

  const throttledFunction = function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    const currentTime = Date.now()

    const later = () => {
      timeout = null
      lastRunTime = Date.now()
      func.apply(this, args)
    }

    if (lastRunTime === null || currentTime - lastRunTime >= interval) {
      later()
    } else if (timeout === null) {
      timeout = setTimeout(later, interval - (currentTime - (lastRunTime as number)))
    }
  }

  return throttledFunction
}
