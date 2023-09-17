export enum NiticeType {
  INTEL_MATTING = '1',
  TEST = '测试',
}

export const niticeLabelType: { [key in NiticeType]: string } = {
  [NiticeType.INTEL_MATTING]: '智能抠图',
  [NiticeType.TEST]: '测试'
}

export const niticeTypeOptions = [
  { value: NiticeType.INTEL_MATTING, label: '智能抠图' },
  { value: NiticeType.TEST, label: '测试' }
]
