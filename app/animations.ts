import { FinalType }  from '../common/enumerations'
import * as colors    from './colors'

export const animateIntValue = (config: AnimateIntValueConfig) => {
  const { start, end, element } = config

  console.log(`element.text: ${element.text}`)
  element.text = typeof start === 'number' ? `${start}` : element.text

  console.log(`element.text: ${element.text}`)
  let currentValue = parseInt(element.text)
  console.log(`currentValue: ${currentValue}`)

  if (isNaN(currentValue)) {
    currentValue = end
    element.text = `${currentValue}`
  }

  const baseTime = 1000
  const interval = Math.max(50, baseTime / Math.abs(currentValue - end))

  console.log(`starting value: ${currentValue}`)
  console.log(`interval: ${interval}`)

  while (currentValue < end) {
    currentValue++
    console.log(`currentValue: ${currentValue}`)

    setInterval(() => {
      element.text = `${currentValue}`
    }, interval)
  }
}

export const createDigitsAnimation = (config: CreateDigitsAnimationConfig) => {
  const {
    startY,
    endY,
    element,
    finalType,
    resetYto,
    hideAfterAnimation
  } = config

  let count = startY
  const step = 2

  function animateDigits(timestamp: number) {
    if (count > endY) {
      count = count - step
      element.y = count

      const { opacity: currentOpacity } = element.style;

      element.style.opacity = getNextOpacity({ currentOpacity, finalType, hideAfterAnimation })

      requestAnimationFrame(animateDigits)
      return
    }

    switch (finalType) {
      case 'hide':
        if (typeof hideAfterAnimation === 'undefined' ||
            hideAfterAnimation === true) {
          element.style.opacity = 0
        }

        if (typeof resetYto === 'number') { element.y = resetYto }
        break
      case 'foreground':
        element.style.opacity = 1
        element.style.fill = colors.getForegroundColor()
        break
      case 'background':
        element.style.opacity = .5
        element.style.fill = colors.getBackgroundColor()
        break

      default:
        break
    }
  }

  return {
    start: () => requestAnimationFrame(animateDigits)
  }
}

export const fadeIn = (elem: Element | null) => {
  if (!elem) return

  const opacityStep = .05

  const animation = (timestamp: number) => {
    if (elem.style.opacity >= 1) return

    const newOpacity = (elem.style.opacity + opacityStep).toFixed(2)
    elem.style.opacity = parseFloat(newOpacity)

    requestAnimationFrame(animation)
  }

  requestAnimationFrame(animation)
}

export const fadeOut = (elem: Element | null) => {
  if (!elem) return

  const opacityStep = .05

  const animation = (timestamp: number) => {
    if (elem.style.opacity <= 0) return

    const newOpacity = (elem.style.opacity - opacityStep).toFixed(2)
    elem.style.opacity = parseFloat(newOpacity)

    requestAnimationFrame(animation)
  }

  requestAnimationFrame(animation)
}

function getNextOpacity(config: GetNextOpacityConfig) {
  const { currentOpacity, finalType, hideAfterAnimation } = config

  let nextOpacity = currentOpacity
  const opacityStep = 0.05

  switch (finalType) {
    case FinalType.hide:
      if ((typeof hideAfterAnimation === 'undefined' ||
        hideAfterAnimation === true) && currentOpacity > 0) {
        nextOpacity -= opacityStep
      }
      break
    case FinalType.foreground:
      if (currentOpacity < 1) {
        nextOpacity += opacityStep
      }
      break
    case FinalType.background:
      if (currentOpacity > .5) {
        nextOpacity -= opacityStep
      }
      break

    default:
      break
  }

  return parseFloat(nextOpacity.toFixed(2))
}