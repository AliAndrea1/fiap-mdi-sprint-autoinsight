import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, FontSize, Spacing, Radius } from '../constants/theme';
import { VehicleResponse } from '../services/vehicleService';

interface VehicleCardProps {
  vehicle: VehicleResponse;
  onPress?: () => void;
}

export default function VehicleCard({ vehicle, onPress }: VehicleCardProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.header}>
        <View style={styles.brandBadge}>
          <Text style={styles.brandText}>{vehicle.brand}</Text>
        </View>
        <Text style={styles.year}>{vehicle.year}</Text>
      </View>
      <Text style={styles.model}>{vehicle.model}</Text>
      <Text style={styles.version}>{vehicle.version}</Text>
      <View style={styles.footer}>
        <Text style={styles.specsCount}>
          {vehicle.specifications?.length || 0} especificações
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  brandBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  brandText: {
    color: Colors.text.inverse,
    fontSize: FontSize.xs,
    fontWeight: '700',
  },
  year: {
    fontSize: FontSize.sm,
    color: Colors.text.muted,
  },
  model: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: 2,
  },
  version: {
    fontSize: FontSize.sm,
    color: Colors.text.secondary,
    marginBottom: Spacing.sm,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing.xs,
  },
  specsCount: {
    fontSize: FontSize.xs,
    color: Colors.text.muted,
  },
});