import React from 'react';
import Svg, { Circle, Line, Rect } from 'react-native-svg';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, FontSize } from '../constants/theme';

interface LogoProps {
  size?: number;
  showText?: boolean;
  color?: string;
  accentColor?: string;
}

export default function Logo({ 
  size = 48, 
  showText = true, 
  color = Colors.text.inverse,
  accentColor = Colors.accentLight
}: LogoProps) {
  const r = size / 2;
  const hub = r * 0.22;
  const spoke = r * 0.85;

  const barW = size * 0.09;
  const barX1 = r - size * 0.27;
  const barX2 = r - size * 0.09;
  const barX3 = r + size * 0.07;
  const barX4 = r + size * 0.25;
  const barBottom = r + size * 0.3;

  return (
    <View style={styles.container}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Circle cx={r} cy={r} r={r - 4} fill="none" stroke={color} strokeWidth={size * 0.07}/>
        <Circle cx={r} cy={r} r={hub} fill={color}/>
        <Line x1={r} y1={r - hub} x2={r} y2={r - spoke} stroke={color} strokeWidth={size * 0.06} strokeLinecap="round"/>
        <Line x1={r + hub * 0.7} y1={r - hub * 0.7} x2={r + spoke * 0.7} y2={r - spoke * 0.7} stroke={color} strokeWidth={size * 0.05} strokeLinecap="round"/>
        <Line x1={r - hub * 0.7} y1={r - hub * 0.7} x2={r - spoke * 0.7} y2={r - spoke * 0.7} stroke={color} strokeWidth={size * 0.05} strokeLinecap="round"/>
        <Line x1={r + hub} y1={r} x2={r + spoke} y2={r} stroke={color} strokeWidth={size * 0.05} strokeLinecap="round"/>
        <Line x1={r - hub} y1={r} x2={r - spoke} y2={r} stroke={color} strokeWidth={size * 0.05} strokeLinecap="round"/>
        <Line x1={r} y1={r + hub} x2={r} y2={r + spoke} stroke={color} strokeWidth={size * 0.05} strokeLinecap="round"/>

        <Rect x={barX1} y={barBottom - size * 0.18} width={barW} height={size * 0.18} rx={2} fill={color}/>
        <Rect x={barX2} y={barBottom - size * 0.28} width={barW} height={size * 0.28} rx={2} fill={accentColor}/>
        <Rect x={barX3} y={barBottom - size * 0.38} width={barW} height={size * 0.38} rx={2} fill={color}/>
        <Rect x={barX4} y={barBottom - size * 0.32} width={barW} height={size * 0.32} rx={2} fill={accentColor}/>
      </Svg>
      {showText && (
        <Text style={[styles.text, { color }]}>AutoInsight</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 8,
  },
  text: {
    fontSize: FontSize.lg,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
});