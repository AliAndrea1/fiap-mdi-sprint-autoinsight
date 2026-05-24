import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Colors, FontSize, Spacing, Radius } from '../constants/theme';
import Logo from '../components/Logo';

const API_URL = 'http://SEU_IP:8080/api';

export default function LoginScreen() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Atenção', 'Preencha todos os campos!');
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        username,
        password,
      });
      const token = response.data.data.token;
      const role = response.data.data.role;
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('role', role);
      await AsyncStorage.setItem('username', username);
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Erro', 'Usuário ou senha inválidos!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.top}>
        <SafeAreaView>
          <Logo size={72} showText={true} color={Colors.text.inverse} accentColor={Colors.accentLight}/>
          <Text style={styles.tagline}>Inteligência Competitiva Automotiva</Text>
        </SafeAreaView>
      </View>

      <View style={styles.bottom}>
        <Text style={styles.title}>Entrar na plataforma</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Usuário</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite seu usuário"
            placeholderTextColor={Colors.text.muted}
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Senha</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite sua senha"
            placeholderTextColor={Colors.text.muted}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity
          style={[styles.loginButton, loading && styles.disabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={Colors.text.inverse} />
          ) : (
            <Text style={styles.loginButtonText}>Entrar</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
 top: {
  flex: 4,
  justifyContent: 'center',
  alignItems: 'center',
  padding: Spacing.xxl,
  paddingTop: Spacing.xxl,
},
  tagline: {
    fontSize: FontSize.sm,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
    marginTop: Spacing.sm,
  },
  bottom: {
  flex: 4,
  backgroundColor: Colors.background,
  borderTopLeftRadius: 32,
  borderTopRightRadius: 32,
  padding: Spacing.xl,
  paddingBottom: Spacing.xxl,
},
  title: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    color: Colors.text.primary,
    marginBottom: Spacing.lg,
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
    backgroundColor: Colors.surface,
  },
  loginButton: {
    backgroundColor: Colors.primary,
    padding: Spacing.md,
    borderRadius: Radius.sm,
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  disabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: Colors.text.inverse,
    fontSize: FontSize.md,
    fontWeight: '700',
  },
  hint: {
    marginTop: Spacing.lg,
    alignItems: 'center',
    gap: Spacing.xs,
  },
  hintText: {
    fontSize: FontSize.xs,
    color: Colors.text.muted,
  },
});