import { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import {
  C,
  width,
  height,
  AnimatedBackground,
  FlocoLogo,
  AuthInput,
  PrimaryButton,
} from "./components/auth.components";

export default function Login() {
  const router = useRouter();
  const [email, setEmail]       = useState("");
  const [senha, setSenha]       = useState("");

  const glowPulse = useRef(new Animated.Value(0.28)).current;
  const fadeIn    = useRef(new Animated.Value(0)).current;
  const slideY    = useRef(new Animated.Value(32)).current;
  const formFade  = useRef(new Animated.Value(0)).current;
  const formSlide = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowPulse, { toValue: 0.44, duration: 2400, useNativeDriver: true }),
        Animated.timing(glowPulse, { toValue: 0.26, duration: 2400, useNativeDriver: true }),
      ])
    ).start();

    // Header entra
    Animated.parallel([
      Animated.timing(fadeIn,  { toValue: 1, duration: 450, useNativeDriver: true }),
      Animated.timing(slideY,  { toValue: 0, duration: 450, useNativeDriver: true }),
    ]).start();

    // Formulário entra com delay
    Animated.sequence([
      Animated.delay(200),
      Animated.parallel([
        Animated.timing(formFade,  { toValue: 1, duration: 450, useNativeDriver: true }),
        Animated.timing(formSlide, { toValue: 0, duration: 450, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />
      <AnimatedBackground glowOpacity={glowPulse} />

      <KeyboardAvoidingView
        style={{ flex: 1, zIndex: 2 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >

          {/* Botão voltar */}
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>

          {/* Header */}
          <Animated.View style={[styles.header, { opacity: fadeIn, transform: [{ translateY: slideY }] }]}>
            <FlocoLogo size={46} />
            <Text style={styles.title}>LOGIN</Text>
          </Animated.View>

          {/* Card do formulário */}
          <Animated.View
            style={[styles.card, { opacity: formFade, transform: [{ translateY: formSlide }] }]}
          >
            {/* Glow interno */}
            <View style={styles.cardGlow} />

            <AuthInput
              label="E-mail"
              placeholder="seu@email.com"
              keyboardType="email-address"
              secureTextEntry={false}
              value={email}
              onChangeText={setEmail}
            />
            <AuthInput
              label="Senha"
              placeholder="••••••••"
              keyboardType="default"
              secureTextEntry
              value={senha}
              onChangeText={setSenha}
            />

            {/* Esqueceu a senha */}
            <TouchableOpacity style={styles.forgotBtn}>
              <Text style={styles.forgotText}>Esqueceu a senha?</Text>
            </TouchableOpacity>

            <PrimaryButton
              label="PLAY"
              onPress={() => router.push("/splashscreen")}
              style={{ marginTop: 8 }}
            />

            {/* Divisor */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>ou</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Link para cadastro */}
            <TouchableOpacity style={styles.signupRow} onPress={() => router.push("/cadastro")}>
              <Text style={styles.signupText}>Não tem conta? </Text>
              <Text style={styles.signupLink}>Cadastre-se</Text>
            </TouchableOpacity>
          </Animated.View>

        </ScrollView>
      </KeyboardAvoidingView>

      {/* Rodapé logo */}
      <View style={styles.footer}>
        <FlocoLogo size={18} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.bg,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: height * 0.1,
    paddingBottom: 48,
  },
  backBtn: {
    marginBottom: 24,
    alignSelf: "flex-start",
    padding: 4,
  },
  backArrow: {
    fontSize: 22,
    color: C.textMuted,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
    gap: 16,
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    letterSpacing: 6,
    color: C.white,
    textTransform: "uppercase",
  },
  card: {
    backgroundColor: C.bgCard,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: C.border,
    padding: 24,
    overflow: "hidden",
  },
  cardGlow: {
    position: "absolute",
    top: -60,
    right: -60,
    width: 200,
    height: 200,
    borderRadius: 999,
    backgroundColor: C.purple,
    opacity: 0.12,
  },
  forgotBtn: {
    alignSelf: "flex-end",
    marginBottom: 20,
    marginTop: -4,
  },
  forgotText: {
    fontSize: 12,
    color: C.purpleLight,
    letterSpacing: 0.3,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
    gap: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: C.border,
  },
  dividerText: {
    fontSize: 12,
    color: C.textMuted,
  },
  signupRow: {
    flexDirection: "row",
    justifyContent: "center",
  },
  signupText: {
    fontSize: 13,
    color: C.textMuted,
  },
  signupLink: {
    fontSize: 13,
    color: C.purpleLight,
    fontWeight: "600",
  },
  footer: {
    alignItems: "center",
    paddingBottom: 28,
    opacity: 0.35,
    zIndex: 2,
  },
});