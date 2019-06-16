declare enum DateFormat {
  dateMonth = 'dateMonth',
  dayDateMonth = 'dayDateMonth',
}

declare enum FinalType {
  hide = 'hide',
  foreground = 'foreground',
  background = 'background'
}

interface AnimateIntValueConfig {
  start?: number;
  end: number;
  element: Element;
}

interface BatteryElements {
  container: Element | null;
  circles: {
    [key: string]: Element | null;
    circle0: Element | null;
    circle1: Element | null;
    circle2: Element | null;
    circle3: Element | null;
  }
}

interface BatteryLevels {
  [key: string]: number;
  circle0: number;
  circle1: number;
  circle2: number;
  circle3: number;
}

interface ClockDigits {
  hours: Element[];
  minutes: Element[];
  seconds: Element[];
  separator?: Element;
}

interface CreateDigitsAnimationConfig {
  /** DOM Element to animate */
  element: Element;

  /** Y coordinate where to end the animation */
  endY: number;

  /** Defines which style to apply when the animation ends. */
  finalType: FinalType;

  /** Set opacity to 0 when animation ends. */
  hideAfterAnimation?: boolean;

  /** Set the DOM element to this Y coordinate after animation ends. */
  resetYto?: number;

  /** Y coordinate where to start the animation */
  startY: number;

  /** Custom step. */
  step?: number;
}

interface DateElements {
  children: {
    [key: string]: Element | null;
    day: Element | null;
    month: Element | null;
    number: Element | null;
    numberDay: Element | null;
    numberMonth: Element | null;
  }
  container: Element | null;
}

interface FadeAnimationConfig {
  element: Element | null;
  step?: number;
  endValue?: number;
}

interface ResultAnimationConfig {
  success: boolean;
}

interface GetNextOpacityConfig {
  currentOpacity: number;
  finalType: FinalType;
  hideAfterAnimation?: boolean;
}

interface Days {
  [key: number] : 'SUN' | 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT';
}

interface IntegerHash {
  [key: string]: number;
}

interface Months {
  [key: number]: 'JAN' | 'FEB' | 'MAR' | 'APR' | 'MAY' | 'JUN' | 'JUL' | 'AUG' | 'SEP' | 'OCT' | 'NOV' | 'DEC';
}

interface MultiLayoutHash {
  Ionic: IntegerHash;
  Versa: IntegerHash;
}

interface MultiLayoutNestedHash {
  Ionic: {
    [key: string]: IntegerHash;
  };
  Versa: {
    [key: string]: IntegerHash;
  };
}

interface Settings {
  [key: string]: string | number | boolean;
  dateFormat: DateFormat;
  displayActivities: boolean;
  displayActivities2: boolean;
  displayBatteryDate: boolean;
  displaySeconds: boolean;
  isBottomDigitTapOn: boolean;
  isHoursTapOn: boolean;
  isMinutesTapOn: boolean;
  isTopDigitTapOn: boolean;
}

interface SettingsUpdateConfig {
  key: string;
  value: string | number | boolean;
}
