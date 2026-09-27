import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, FontSize, Spacing, Radius } from '../../constants/theme';
import { vehicleService, VehicleResponse } from '../../services/vehicleService';

export default function CompareScreen() {
  const router = useRouter();

  const [options, setOptions] = useState<VehicleResponse[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [optionsError, setOptionsError] = useState(false);

  const [selectedId1, setSelectedId1] = useState<number | null>(null);
  const [selectedId2, setSelectedId2] = useState<number | null>(null);
  const [showOptions1, setShowOptions1] = useState(false);
  const [showOptions2, setShowOptions2] = useState(false);

  const [vehicle1, setVehicle1] = useState<VehicleResponse | null>(null);
  const [vehicle2, setVehicle2] = useState<VehicleResponse | null>(null);
  const [loadingCompare, setLoadingCompare] = useState(false);

  useEffect(() => {
    const loadOptions = async () => {
      try {
        const vehicles = await vehicleService.getAll();
        setOptions(vehicles);
        setOptionsError(false);
      } catch {
        setOptionsError(true);
      } finally {
        setLoadingOptions(false);
      }
    };

    loadOptions();
  }, []);

  const selectedVehicle1 = options.find(item => item.id === selectedId1);
  const selectedVehicle2 = options.find(item => item.id === selectedId2);

  const vehicleLabel = (vehicle: VehicleResponse) =>
    `${vehicle.brand} ${vehicle.model} — ${vehicle.version}`;

  const handleCompare = async () => {
    if (selectedId1 === null || selectedId2 === null) {
      Alert.alert('Atenção', 'Selecione os dois veículos.');
      return;
    }

    if (selectedId1 === selectedId2) {
      Alert.alert('Atenção', 'Selecione veículos diferentes para comparar.');
      return;
    }

    setLoadingCompare(true);

    try {
      const [first, second] = await Promise.all([
        vehicleService.getById(selectedId1),
        vehicleService.getById(selectedId2),
      ]);

      setVehicle1(first);
      setVehicle2(second);
    } catch {
      Alert.alert('Erro', 'Não foi possível carregar a comparação.');
    } finally {
      setLoadingCompare(false);
    }
  };

  const getAllAttributes = () => {
    const names = new Set<string>();

    vehicle1?.specifications.forEach(spec => names.add(spec.attributeName));
    vehicle2?.specifications.forEach(spec => names.add(spec.attributeName));

    return Array.from(names);
  };

  const getSpecValue = (
    vehicle: VehicleResponse | null,
    attributeName: string
  ) => {
    if (!vehicle) return 'N/D';

    const spec = vehicle.specifications.find(
      item => item.attributeName === attributeName
    );

    if (!spec?.attributeValue || spec.attributeValue === 'Não disponível') {
      return 'N/D';
    }

    return spec.unit
      ? `${spec.attributeValue} ${spec.unit}`
      : spec.attributeValue;
  };

  const handleClear = () => {
    setSelectedId1(null);
    setSelectedId2(null);
    setShowOptions1(false);
    setShowOptions2(false);
    setVehicle1(null);
    setVehicle2(null);
  };

  const renderOptions = (
    selectedId: number | null,
    onSelect: (id: number) => void
  ) => (
    <View style={styles.optionsList}>
      {options.map(item => (
        <TouchableOpacity
          key={item.id}
          style={[
            styles.option,
            selectedId === item.id && styles.selectedOption,
          ]}
          onPress={() => onSelect(item.id)}
        >
          <Text
            style={[
              styles.optionText,
              selectedId === item.id && styles.selectedOptionText,
            ]}
          >
            {vehicleLabel(item)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>Comparar</Text>
            <Text style={styles.headerSubtitle}>
              Selecione dois veículos para comparar
            </Text>
          </View>

          <TouchableOpacity
            style={styles.navButton}
            onPress={() => router.push('/(tabs)')}
          >
            <Text style={styles.navButtonText}>Início</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={{ paddingBottom: 48 }}
        keyboardShouldPersistTaps="handled"
      >
        {loadingOptions && (
          <ActivityIndicator
            color={Colors.primary}
            style={{ marginBottom: Spacing.md }}
          />
        )}

        {optionsError && (
          <Text style={styles.errorText}>
            Não foi possível carregar os veículos. Confira a conexão com a API.
          </Text>
        )}

        <View style={styles.formsRow}>
          <View style={styles.formCard}>
            <View style={styles.formBadge}>
              <Text style={styles.formBadgeText}>Veículo 1</Text>
            </View>

            <TouchableOpacity
              style={styles.selector}
              onPress={() => setShowOptions1(value => !value)}
              disabled={loadingOptions || optionsError}
            >
              <Text style={styles.selectorText}>
                {selectedVehicle1
                  ? vehicleLabel(selectedVehicle1)
                  : 'Selecionar veículo'}
              </Text>
              <Text style={styles.selectorArrow}>
                {showOptions1 ? '▲' : '▼'}
              </Text>
            </TouchableOpacity>

            {showOptions1 &&
              renderOptions(selectedId1, id => {
                setSelectedId1(id);
                setVehicle1(null);
                setVehicle2(null);
                setShowOptions1(false);
              })}
          </View>

          <View style={styles.formCard}>
            <View style={[styles.formBadge, styles.formBadge2]}>
              <Text style={styles.formBadgeText}>Veículo 2</Text>
            </View>

            <TouchableOpacity
              style={styles.selector}
              onPress={() => setShowOptions2(value => !value)}
              disabled={loadingOptions || optionsError}
            >
              <Text style={styles.selectorText}>
                {selectedVehicle2
                  ? vehicleLabel(selectedVehicle2)
                  : 'Selecionar veículo'}
              </Text>
              <Text style={styles.selectorArrow}>
                {showOptions2 ? '▲' : '▼'}
              </Text>
            </TouchableOpacity>

            {showOptions2 &&
              renderOptions(selectedId2, id => {
                setSelectedId2(id);
                setVehicle1(null);
                setVehicle2(null);
                setShowOptions2(false);
              })}
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.compareButton,
            loadingCompare && styles.disabled,
          ]}
          onPress={handleCompare}
          disabled={loadingCompare || loadingOptions || optionsError}
        >
          {loadingCompare ? (
            <ActivityIndicator color={Colors.text.inverse} size="small" />
          ) : (
            <Text style={styles.compareButtonText}>
              Comparar veículos
            </Text>
          )}
        </TouchableOpacity>

        {(selectedId1 !== null || selectedId2 !== null) && (
          <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
            <Text style={styles.clearButtonText}>
              🗑 Limpar comparação
            </Text>
          </TouchableOpacity>
        )}

        {vehicle1 && vehicle2 ? (
          <View style={styles.compareTable}>
            <Text style={styles.compareTitle}>
              Comparação de Especificações
            </Text>

            <View style={styles.tableHeader}>
              <Text style={styles.tableHeaderAttr}>Atributo</Text>
              <Text style={styles.tableHeaderVal}>
                {vehicle1.model} {vehicle1.version}
              </Text>
              <Text style={styles.tableHeaderVal}>
                {vehicle2.model} {vehicle2.version}
              </Text>
            </View>

            {getAllAttributes().map((attribute, index) => {
              const value1 = getSpecValue(vehicle1, attribute);
              const value2 = getSpecValue(vehicle2, attribute);
              const different = value1 !== value2;

              return (
                <View
                  key={attribute}
                  style={[
                    styles.tableRow,
                    index % 2 === 0 && styles.tableRowEven,
                    different && styles.tableRowDiff,
                  ]}
                >
                  <Text style={styles.tableAttr}>{attribute}</Text>
                  <Text style={styles.tableVal}>{value1}</Text>
                  <Text style={styles.tableVal}>{value2}</Text>
                </View>
              );
            })}
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>⚖️</Text>
            <Text style={styles.emptyText}>
              Selecione dois veículos diferentes e toque em Comparar veículos
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
    flexDirection: 'column',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  formCard: {
    width: '100%',
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    elevation: 1,
  },
  formBadge: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.full,
    paddingHorizontal: 12,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  formBadge2: {
    backgroundColor: Colors.accent,
  },
  formBadgeText: {
    fontSize: 13,
    color: Colors.text.inverse,
    fontWeight: '700',
  },
  selector: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.sm,
    backgroundColor: Colors.background,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  selectorText: {
    flex: 1,
    fontSize: 15,
    color: Colors.text.primary,
  },
  selectorArrow: {
    fontSize: 12,
    color: Colors.text.secondary,
  },
  optionsList: {
    marginTop: 6,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.sm,
    overflow: 'hidden',
  },
  option: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  selectedOption: {
    backgroundColor: '#EFF6FF',
  },
  optionText: {
    fontSize: 14,
    color: Colors.text.primary,
  },
  selectedOptionText: {
    color: Colors.primary,
    fontWeight: '700',
  },
  compareButton: {
    backgroundColor: Colors.primary,
    padding: 12,
    borderRadius: Radius.sm,
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  compareButtonText: {
    color: Colors.text.inverse,
    fontSize: 15,
    fontWeight: '700',
  },
  disabled: {
    opacity: 0.6,
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
  errorText: {
    color: Colors.error,
    marginBottom: Spacing.md,
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
    flex: 1.3,
    fontSize: FontSize.xs,
    color: Colors.text.inverse,
    fontWeight: '700',
  },
  tableHeaderVal: {
    flex: 1.35,
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
    flex: 1.3,
    fontSize: FontSize.xs,
    color: Colors.text.secondary,
  },
  tableVal: {
    flex: 1.35,
    fontSize: FontSize.xs,
    color: Colors.text.primary,
    textAlign: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: Spacing.xs,
  },
  emptyText: {
    fontSize: FontSize.md,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
});