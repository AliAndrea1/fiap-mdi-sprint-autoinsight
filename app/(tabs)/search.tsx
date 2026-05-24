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
  const [brand, setBrand] = useState('');
  const [model, setModel] = useState('');
  const [version, setVersion] = useState('');
  const [loading, setLoading] = useState(false);
  const [vehicle, setVehicle] = useState<VehicleResponse | null>(null);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!brand || !model || !version) {
      Alert.alert('Atenção', 'Preencha todos os campos para buscar!');
      return;
    }
    setLoading(true);
    setError('');
    setVehicle(null);
    try {
      const result = await vehicleService.search(brand, model, version);
      setVehicle(result);
    } catch (err: any) {
      setError('Veículo não encontrado. Verifique os dados e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setBrand('');
    setModel('');
    setVersion('');
    setVehicle(null);
    setError('');
  };

  useFocusEffect(
  useCallback(() => {
    return () => {
      setBrand('');
      setModel('');
      setVersion('');
      setVehicle(null);
      setError('');
    };
  }, [])
);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
        <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>Buscar Veículo</Text>
            <Text style={styles.headerSubtitle}>Informe os dados para consultar as especificações</Text>
        </View>
        <View style={styles.headerButtons}>
            <TouchableOpacity
            style={styles.historyButton}
            onPress={() => router.push('/(tabs)')}
            >
            <Text style={styles.historyText}>Início</Text>
            </TouchableOpacity>
            <TouchableOpacity
            style={styles.historyButton}
            onPress={() => router.push('/(tabs)/history')}
            >
            <Text style={styles.historyText}>Histórico</Text>
            </TouchableOpacity>
        </View>
        </View>
      </View>

      <ScrollView style={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Marca</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Ford, Chevrolet, Toyota..."
              placeholderTextColor={Colors.text.muted}
              value={brand}
              onChangeText={setBrand}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Modelo</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: Ranger, S10, Hilux..."
              placeholderTextColor={Colors.text.muted}
              value={model}
              onChangeText={setModel}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Versão</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: XLT 3.0L V6 AT..."
              placeholderTextColor={Colors.text.muted}
              value={version}
              onChangeText={setVersion}
              autoCapitalize="words"
            />
          </View>

          <TouchableOpacity
            style={[styles.searchButton, loading && styles.disabled]}
            onPress={handleSearch}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={Colors.text.inverse}/>
            ) : (
              <Text style={styles.searchButtonText}>🔍 Buscar Especificações</Text>
            )}
          </TouchableOpacity>

          {vehicle && (
            <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
              <Text style={styles.clearButtonText}>Limpar busca</Text>
            </TouchableOpacity>
          )}
        </View>

        {error !== '' && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorIcon}>⚠️</Text>
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
              <Text style={styles.specsTitle}>Especificações Técnicas</Text>
              {vehicle.specifications && vehicle.specifications.length > 0 ? (
                vehicle.specifications.map((spec, index) => (
                  <SpecRow
                    key={index}
                    label={spec.attributeName}
                    value={spec.attributeValue}
                    unit={spec.unit}
                  />
                ))
              ) : (
                <Text style={styles.noSpecs}>Nenhuma especificação cadastrada</Text>
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
  historyButton: {
  backgroundColor: 'rgba(255,255,255,0.15)',
  paddingHorizontal: Spacing.sm,
  paddingVertical: Spacing.xs,
  borderRadius: Radius.full,
  marginTop: 40,
},
historyText: {
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
  inputGroup: {
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.text.secondary,
    marginBottom: Spacing.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.sm,
    padding: Spacing.sm,
    fontSize: FontSize.md,
    color: Colors.text.primary,
    backgroundColor: Colors.background,
  },
  searchButton: {
    backgroundColor: Colors.primary,
    padding: Spacing.md,
    borderRadius: Radius.sm,
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  disabled: {
    opacity: 0.6,
  },
  searchButtonText: {
    color: Colors.text.inverse,
    fontSize: FontSize.md,
    fontWeight: '700',
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
    borderWidth: 1,
    borderColor: Colors.error,
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  errorIcon: {
    fontSize: 24,
    marginBottom: Spacing.xs,
  },
  errorText: {
    fontSize: FontSize.sm,
    color: Colors.error,
    textAlign: 'center',
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
  headerButtons: {
  flexDirection: 'row',
  gap: Spacing.xs,
  marginTop: 5,
},
});