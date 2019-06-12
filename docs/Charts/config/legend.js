export const legendConfig = {
  show: true,
  orient: 'horizontal',
  left: 'auto',
  right: 'auto',
  top: 'auto',
  bottom: 'auto',
  itemGap: 10,
  iconWidth: 25,
  iconHeight: 10,
  selectAble: true,
  data: [],
  textStyle: {
    fontFamily: 'Arial',
    fontSize: 13,
    fill: '#000'
  },
  iconStyle: {

  },
  textUnselectedStyle: {
    fontFamily: 'Arial',
    fontSize: 13,
    fill: '#999'
  },
  iconUnselectedStyle: {
    fill: '#999'
  },
  /**
   * @description Legend animation curve
   * @type {String}
   * @default animationCurve = 'easeOutCubic'
   */
  animationCurve: 'easeOutCubic',
  /**
   * @description Legend animation frame
   * @type {Number}
   * @default animationFrame = 50
   */
  animationFrame: 50
}