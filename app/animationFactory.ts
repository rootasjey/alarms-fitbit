import { FinalType } from '../common/enumerations'
import { getForegroundColor, getBackgroundColor } from './colors';

export function createDigitsAnimation(config: CreateDigitsAnimationConfig) {
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
        element.style.fill = getForegroundColor()
        break
      case 'background':
        element.style.opacity = .5
        element.style.fill = getBackgroundColor()
        break

      default:
        break
    }
  }

  return {
    start: () => requestAnimationFrame(animateDigits)
  }
}

export function fadeIn(elem: Element | null) {
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

export function fadeOut(elem: Element | null) {
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
