import Svg, { Circle, Ellipse, Path } from 'react-native-svg'

// The bee logo, drawn in code. Swap this component's body for an <Image> to use your own file.
export function Logo({ size = 28 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 80 80">
      <Ellipse cx="30" cy="22" rx="14" ry="10" fill="#fff" stroke="#8a8670" strokeWidth="2" rotation="-25" origin="30, 22" />
      <Ellipse cx="50" cy="20" rx="14" ry="10" fill="#fff" stroke="#8a8670" strokeWidth="2" rotation="25" origin="50, 20" />
      <Ellipse cx="40" cy="46" rx="22" ry="20" fill="#E2B93B" />
      <Path d="M27 34c8 3 18 3 26 0M22 46c12 4 24 4 36 0M26 58c9 3 19 3 28 0" stroke="#2B2210" strokeWidth="5" strokeLinecap="round" fill="none" />
      <Circle cx="33" cy="42" r="2.4" fill="#2B2210" />
      <Circle cx="47" cy="42" r="2.4" fill="#2B2210" />
    </Svg>
  )
}
