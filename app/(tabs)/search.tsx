import { useRouter, useFocusEffect } from 'expo-router';
import React, { useState, useCallback } from 'react';
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
import { Colors, FontSize, Spacing, Radius } from '../../constants/theme';
import { vehicleService, VehicleResponse } from '../../services/vehicleService';
import SpecRow from '../../components/SpecRow';

export default function SearchScreen() {
  const router = useRouter();

  const [options, setOptions] = useState<VehicleResponse[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [optionsError, setOptionsError] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [attributes, setAttributes] = useState('');
  const [loading, setLoading] = useState(false);
  const [vehicle, setVehicle] = useState<VehicleResponse | null>(null);
  const [error, setError] = useState('');

  const loadOptions = useCallback(async () => {
    setLoadingOptions(true);

    try {
      const data = await vehicleService.getAll();
      setOptions(data);
      setOptionsError(false);
    } catch {
      setOptionsError(true);
    } finally {
      setLoadingOptions(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadOptions();
    }, [loadOptions])
  );

  const selectedVehicle = options.find(item => item.id === selectedId);

  const vehicleLabel = (item: VehicleResponse) =>
    `${item.brand} ${item.model} — ${item.version}`;

  const handleSearch = async () => {
    if (!selectedVehicle) {
      Alert.alert('Atenção', 'Selecione um veículo para buscar.');
      return;
    }

    const requestedAttributes = attributes
      .split(',')
      .map(item => item.trim())
      .filter(Boolean);

    setLoading(true);
    setError('');
    setVehicle(null);

    try {
      const result = await vehicleService.search(
        selectedVehicle.brand,
        selectedVehicle.model,
        selectedVehicle.version,
        requestedAttributes
      );

      setVehicle(result);
    } catch {
      setError('Não foi possível buscar as especificações. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setSelectedId(null);
    setAttributes('');
    setShowOptions(false);
    setVehicle(null);
    setError('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>Buscar Veículo</Text>
            <Text style={styles.headerSubtitle}>
              Escolha um veículo e os atributos que deseja consultar
            </Text>
          </View>

          <View style={styles.headerButtons}>
            <TouchableOpacity
              style={styles.navButton}
              onPress={() => router.push('/(tabs)')}
            >
              <Text style={styles.navButtonText}>Início</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.navButton}
              onPress={() => router.push('/(tabs)/history')}
            >
              <Text style={styles.navButtonText}>Histórico</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={{ paddingBottom: 48 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.form}>
          <Text style={styles.label}>Veículo</Text>

          <TouchableOpacity
            style={styles.selector}
            onPress={() => setShowOptions(value => !value)}
            disabled={loadingOptions || optionsError}
          >
            <Text style={styles.selectorText}>
              {selectedVehicle
                ? vehicleLabel(selectedVehicle)
                : loadingOptions
                  ? 'Carregando veículos...'
                  : 'Selecionar veículo'}
            </Text>
            <Text style={styles.selectorArrow}>
              {showOptions ? '▲' : '▼'}
            </Text>
          </TouchableOpacity>

          {showOptions && (
            <View style={styles.optionsList}>
              {options.map(item => (
                <TouchableOpacity
                  key={item.id}
                  style={[
                    styles.option,
                    selectedId === item.id && styles.selectedOption,
                  ]}
                  onPress={() => {
                    setSelectedId(item.id);
                    setVehicle(null);
                    setError('');
                    setShowOptions(false);
                  }}
                >
                  <Text style={styles.optionText}>
                    {vehicleLabel(item)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {optionsError && (
            <Text style={styles.errorText}>
              Não foi possível carregar os veículos. Confira a API.
            </Text>
          )}

          <View style={styles.attributesGroup}>
            <Text style={styles.label}>
              Atributos que deseja pesquisar
            </Text>
            <TextInput
              style={styles.attributesInput}
              placeholder="Ex: Potência, Torque, Cor do volante"
              placeholderTextColor={Colors.text.muted}
              value={attributes}
              onChangeText={setAttributes}
              autoCapitalize="sentences"
              multiline
            />
            <Text style={styles.hint}>
              Separe por vírgula. Se deixar vazio, serão exibidas todas as
              especificações cadastradas.
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.searchButton, loading && styles.disabled]}
            onPress={handleSearch}
            disabled={loading || loadingOptions || optionsError}
          >
            {loading ? (
              <ActivityIndicator color={Colors.text.inverse} />
            ) : (
              <Text style={styles.searchButtonText}>
                🔍 Buscar Especificações
              </Text>
            )}
          </TouchableOpacity>

          {(selectedId !== null || attributes !== '') && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={handleClear}
            >
              <Text style={styles.clearButtonText}>Limpar busca</Text>
            </TouchableOpacity>
          )}
        </View>

        {error !== '' && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {vehicle && (
          <View style={styles.resultContainer}>
            <View style={styles.resultHeader}>
              <View style={styles.brandBadge}>
                <Text style={styles.brandText}>{vehicle.brand}</Text>
              </View>
              <Text style={styles.year}>{vehicle.year}</Text>
            </View>

            <Text style={styles.modelText}>{vehicle.model}</Text>
            <Text style={styles.versionText}>{vehicle.version}</Text>

            <View style={styles.specsContainer}>
              <Text style={styles.specsTitle}>
                Especificações Técnicas
              </Text>

              {vehicle.specifications?.length > 0 ? (
                vehicle.specifications.map((spec, index) => (
                  <SpecRow
                    key={`${spec.attributeName}-${index}`}
                    label={spec.attributeName}
                    value={spec.attributeValue}
                    unit={spec.unit}
                  />
                ))
              ) : (
                <Text style={styles.noSpecs}>
                  Nenhuma especificação cadastrada
                </Text>
              )}
            </View>
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
  headerButtons: {
    flexDirection: 'row',
    gap: Spacing.xs,
    marginTop: 40,
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
  form: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    elevation: 1,
  },
  label: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.text.secondary,
    marginBottom: Spacing.xs,
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
  attributesGroup: {
    marginTop: Spacing.md,
  },
  attributesInput: {
    minHeight: 64,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.sm,
    backgroundColor: Colors.background,
    color: Colors.text.primary,
    fontSize: FontSize.md,
    padding: Spacing.sm,
    textAlignVertical: 'top',
  },
  hint: {
    fontSize: FontSize.xs,
    color: Colors.text.muted,
    marginTop: Spacing.xs,
  },
  searchButton: {
    backgroundColor: Colors.primary,
    padding: Spacing.md,
    borderRadius: Radius.sm,
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  searchButtonText: {
    color: Colors.text.inverse,
    fontSize: FontSize.md,
    fontWeight: '700',
  },
  disabled: {
    opacity: 0.6,
  },
  clearButton: {
    padding: Spacing.sm,
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  clearButtonText: {
    color: Colors.text.secondary,
    fontSize: FontSize.sm,
  },
  errorContainer: {
    padding: Spacing.md,
    backgroundColor: '#FEF2F2',
    borderRadius: Radius.md,
    marginBottom: Spacing.md,
  },
  errorText: {
    color: Colors.error,
    fontSize: FontSize.sm,
  },
  resultContainer: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    elevation: 1,
    marginBottom: Spacing.xl,
  },
  resultHeader: {
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
  modelText: {
    fontSize: FontSize.xl,
    fontWeight: '800',
    color: Colors.text.primary,
    marginBottom: 2,
  },
  versionText: {
    fontSize: FontSize.sm,
    color: Colors.text.secondary,
    marginBottom: Spacing.md,
  },
  specsContainer: {
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing.md,
  },
  specsTitle: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  noSpecs: {
    fontSize: FontSize.sm,
    color: Colors.text.muted,
    textAlign: 'center',
    paddingVertical: Spacing.md,
  },
});