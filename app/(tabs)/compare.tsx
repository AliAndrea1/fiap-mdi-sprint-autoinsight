import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, FontSize, Spacing, Radius } from '../../constants/theme';
import { vehicleService, VehicleResponse } from '../../services/vehicleService';

export default function CompareScreen() {
  const router = useRouter();
  const [brand1, setBrand1] = useState('');
  const [model1, setModel1] = useState('');
  const [version1, setVersion1] = useState('');
  const [brand2, setBrand2] = useState('');
  const [model2, setModel2] = useState('');
  const [version2, setVersion2] = useState('');
  const [vehicle1, setVehicle1] = useState<VehicleResponse | null>(null);
  const [vehicle2, setVehicle2] = useState<VehicleResponse | null>(null);
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);

  const searchVehicle1 = async () => {
    if (!brand1 || !model1 || !version1) {
      Alert.alert('Atenção', 'Preencha todos os campos do veículo 1!');
      return;
    }
    setLoading1(true);
    try {
      const result = await vehicleService.search(brand1, model1, version1);
      setVehicle1(result);
    } catch {
      Alert.alert('Erro', 'Veículo 1 não encontrado!');
    } finally {
      setLoading1(false);
    }
  };

  const searchVehicle2 = async () => {
    if (!brand2 || !model2 || !version2) {
      Alert.alert('Atenção', 'Preencha todos os campos do veículo 2!');
      return;
    }
    setLoading2(true);
    try {
      const result = await vehicleService.search(brand2, model2, version2);
      setVehicle2(result);
    } catch {
      Alert.alert('Erro', 'Veículo 2 não encontrado!');
    } finally {
      setLoading2(false);
    }
  };

  const getAllAttributes = () => {
    const attrs = new Set<string>();
    vehicle1?.specifications.forEach(s => attrs.add(s.attributeName));
    vehicle2?.specifications.forEach(s => attrs.add(s.attributeName));
    return Array.from(attrs);
  };

  const getSpecValue = (vehicle: VehicleResponse | null, attributeName: string) => {
    if (!vehicle) return '—';
    const spec = vehicle.specifications.find(s => s.attributeName === attributeName);
    if (!spec || !spec.attributeValue || spec.attributeValue === 'Não disponível') return 'N/D';
    return spec.unit ? `${spec.attributeValue} ${spec.unit}` : spec.attributeValue;
  };

  const isDifferent = (attr: string) => {
    const v1 = getSpecValue(vehicle1, attr);
    const v2 = getSpecValue(vehicle2, attr);
    return v1 !== v2;
  };
  const handleClear = () => {
  setBrand1('');
  setModel1('');
  setVersion1('');
  setBrand2('');
  setModel2('');
  setVersion2('');
  setVehicle1(null);
  setVehicle2(null);
};

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>Comparar</Text>
            <Text style={styles.headerSubtitle}>Compare dois veículos lado a lado</Text>
          </View>
          <TouchableOpacity
            style={styles.navButton}
            onPress={() => router.push('/(tabs)')}
          >
            <Text style={styles.navButtonText}>Início</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.formsRow}>
          <View style={styles.formCard}>
            <View style={styles.formBadge}>
              <Text style={styles.formBadgeText}>Veículo 1</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Marca"
              placeholderTextColor={Colors.text.muted}
              value={brand1}
              onChangeText={setBrand1}
              autoCapitalize="words"
            />
            <TextInput
              style={styles.input}
              placeholder="Modelo"
              placeholderTextColor={Colors.text.muted}
              value={model1}
              onChangeText={setModel1}
              autoCapitalize="words"
            />
            <TextInput
              style={styles.input}
              placeholder="Versão"
              placeholderTextColor={Colors.text.muted}
              value={version1}
              onChangeText={setVersion1}
              autoCapitalize="words"
            />
            <TouchableOpacity
              style={[styles.searchButton, loading1 && styles.disabled]}
              onPress={searchVehicle1}
              disabled={loading1}
            >
              {loading1 ? (
                <ActivityIndicator color={Colors.text.inverse} size="small"/>
              ) : (
                <Text style={styles.searchButtonText}>Buscar</Text>
              )}
            </TouchableOpacity>
            {vehicle1 && (
              <View style={styles.vehicleInfo}>
                <Text style={styles.vehicleName}>{vehicle1.brand} {vehicle1.model}</Text>
                <Text style={styles.vehicleVersion}>{vehicle1.version}</Text>
              </View>
            )}
          </View>

          <View style={styles.formCard}>
            <View style={[styles.formBadge, styles.formBadge2]}>
              <Text style={styles.formBadgeText}>Veículo 2</Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Marca"
              placeholderTextColor={Colors.text.muted}
              value={brand2}
              onChangeText={setBrand2}
              autoCapitalize="words"
            />
            <TextInput
              style={styles.input}
              placeholder="Modelo"
              placeholderTextColor={Colors.text.muted}
              value={model2}
              onChangeText={setModel2}
              autoCapitalize="words"
            />
            <TextInput
              style={styles.input}
              placeholder="Versão"
              placeholderTextColor={Colors.text.muted}
              value={version2}
              onChangeText={setVersion2}
              autoCapitalize="words"
            />
            <TouchableOpacity
              style={[styles.searchButton, styles.searchButton2, loading2 && styles.disabled]}
              onPress={searchVehicle2}
              disabled={loading2}
            >
              {loading2 ? (
                <ActivityIndicator color={Colors.text.inverse} size="small"/>
              ) : (
                <Text style={styles.searchButtonText}>Buscar</Text>
              )}
            </TouchableOpacity>
            {vehicle2 && (
              <View style={styles.vehicleInfo}>
                <Text style={styles.vehicleName}>{vehicle2.brand} {vehicle2.model}</Text>
                <Text style={styles.vehicleVersion}>{vehicle2.version}</Text>
              </View>
            )}
          </View>
        </View>
        {(vehicle1 || vehicle2) && (
        <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
            <Text style={styles.clearButtonText}>🗑 Limpar comparação</Text>
        </TouchableOpacity>
        )}
        {vehicle1 && vehicle2 && (
          <View style={styles.compareTable}>
            <Text style={styles.compareTitle}>Comparação de Especificações</Text>
            <View style={styles.tableHeader}>
              <Text style={styles.tableHeaderAttr}>Atributo</Text>
              <Text style={styles.tableHeaderVal}>{vehicle1.brand}</Text>
              <Text style={styles.tableHeaderVal}>{vehicle2.brand}</Text>
            </View>
            {getAllAttributes().map((attr, index) => {
              const val1 = getSpecValue(vehicle1, attr);
              const val2 = getSpecValue(vehicle2, attr);
              const diff = isDifferent(attr);
              return (
                <View
                  key={index}
                  style={[
                    styles.tableRow,
                    diff && styles.tableRowDiff,
                    index % 2 === 0 && styles.tableRowEven
                  ]}
                >
                  <Text style={styles.tableAttr} numberOfLines={2}>{attr}</Text>
                  <Text style={[styles.tableVal, diff && styles.tableValDiff]} numberOfLines={2}>{val1}</Text>
                  <Text style={[styles.tableVal, diff && styles.tableValDiff]} numberOfLines={2}>{val2}</Text>
                </View>
              );
            })}
          </View>
        )}

        {(!vehicle1 || !vehicle2) && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>⚖️</Text>
            <Text style={styles.emptyText}>
              {!vehicle1 && !vehicle2
                ? 'Busque dois veículos para comparar'
                : !vehicle1
                ? 'Busque o Veículo 1'
                : 'Busque o Veículo 2'}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md,
    paddingTop: 70,
    paddingBottom: Spacing.lg,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  headerTitle: {
    fontSize: FontSize.xl,
    fontWeight: '800',
    color: Colors.text.inverse,
  },
  headerSubtitle: {
    fontSize: FontSize.sm,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 4,
  },
  navButton: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: Radius.full,
    marginTop: 40,
  },
  navButtonText: {
    fontSize: FontSize.xs,
    color: Colors.text.inverse,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: Spacing.md,
  },
  formsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  formCard: {
    flex: 1,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    elevation: 1,
  },
  formBadge: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    alignSelf: 'flex-start',
    marginBottom: Spacing.sm,
  },
  formBadge2: {
    backgroundColor: Colors.accent,
  },
  formBadgeText: {
    fontSize: FontSize.xs,
    color: Colors.text.inverse,
    fontWeight: '700',
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.sm,
    padding: Spacing.xs,
    fontSize: FontSize.xs,
    color: Colors.text.primary,
    backgroundColor: Colors.background,
    marginBottom: Spacing.xs,
  },
  searchButton: {
    backgroundColor: Colors.primary,
    padding: Spacing.xs,
    borderRadius: Radius.sm,
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  searchButton2: {
    backgroundColor: Colors.accent,
  },
  disabled: {
    opacity: 0.6,
  },
  searchButtonText: {
    color: Colors.text.inverse,
    fontSize: FontSize.xs,
    fontWeight: '700',
  },
  vehicleInfo: {
    marginTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing.xs,
  },
  vehicleName: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    color: Colors.text.primary,
  },
  vehicleVersion: {
    fontSize: FontSize.xs,
    color: Colors.text.secondary,
  },
  compareTable: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    marginBottom: Spacing.xl,
  },
  compareTitle: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: Colors.text.primary,
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: Colors.primary,
    padding: Spacing.sm,
  },
  tableHeaderAttr: {
    flex: 2,
    fontSize: FontSize.xs,
    color: Colors.text.inverse,
    fontWeight: '700',
  },
  tableHeaderVal: {
    flex: 1,
    fontSize: FontSize.xs,
    color: Colors.text.inverse,
    fontWeight: '700',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    padding: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tableRowEven: {
    backgroundColor: Colors.background,
  },
  tableRowDiff: {
    backgroundColor: '#EFF6FF',
  },
  tableAttr: {
    flex: 2,
    fontSize: FontSize.xs,
    color: Colors.text.secondary,
  },
  tableVal: {
    flex: 1,
    fontSize: FontSize.xs,
    color: Colors.text.primary,
    textAlign: 'center',
  },
  tableValDiff: {
    color: Colors.primary,
    fontWeight: '700',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: Spacing.md,
  },
  emptyText: {
    fontSize: FontSize.md,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
  clearButton: {
  backgroundColor: Colors.surface,
  paddingHorizontal: Spacing.md,
  paddingVertical: Spacing.sm,
  borderRadius: Radius.full,
  borderWidth: 1,
  borderColor: Colors.error,
  alignItems: 'center',
  marginBottom: Spacing.md,
},
clearButtonText: {
  fontSize: FontSize.sm,
  color: Colors.error,
  fontWeight: '600',
},
});