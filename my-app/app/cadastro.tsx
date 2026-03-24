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
  height,
  AnimatedBackground,
  FlocoLogo,
  AuthInput,
  PrimaryButton,
} from "./components/auth.components";

export default function Cadastro() {
  const router = useRouter();
  const [nome,     setNome]     = useState("");
  const [email,    setEmail]    = useState("");
  const [telefone, setTelefone] = useState("");
  const [senha,    setSenha]    = useState("");

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

    Animated.parallel([
      Animated.timing(fadeIn,  { toValue: 1, duration: 450, useNativeDriver: true }),
      Animated.timing(slideY,  { toValue: 0, duration: 450, useNativeDriver: true }),
    ]).start();

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
            <FlocoLogo size={36} />
            <Text style={styles.title}>CADASTRO</Text>
          </Animated.View>

          {/* Card */}
          <Animated.View
            style={[styles.card, { opacity: formFade, transform: [{ translateY: formSlide }] }]}
          >
            {/* Glow interno */}
            <View style={styles.cardGlowTL} />
            <View style={styles.cardGlowBR} />

            <AuthInput
              label="Nome"
              placeholder="Seu nome completo"
              value={nome}
              onChangeText={setNome}
              secureTextEntry={false}
              keyboardType="default"
            />
            <AuthInput
              label="E-mail"
              placeholder="seu@email.com"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              secureTextEntry={false}
            />
            <AuthInput
              label="Telefone"
              placeholder="(11) 9 0000-0000"
              keyboardType="phone-pad"
              value={telefone}
              onChangeText={setTelefone}
              secureTextEntry={false}
            />
            <AuthInput
              label="Senha"
              placeholder="••••••••"
              secureTextEntry
              keyboardType="default"
              value={senha}
              onChangeText={setSenha}
            />

            {/* Termos */}
            <Text style={styles.terms}>
              Ao continuar, você concorda com os{" "}
              <Text style={styles.termsLink}>Termos de Uso</Text>
              {" "}e{" "}
              <Text style={styles.termsLink}>Política de Privacidade</Text>.
            </Text>

            <PrimaryButton
              label="PLAY"
              onPress={() => router.push("./sport-selection")}
              style={{ marginTop: 8 }}
            />

            {/* Link para login */}
            <TouchableOpacity style={styles.loginRow} onPress={() => router.push("/login")}>
              <Text style={styles.loginText}>Já tem conta? </Text>
              <Text style={styles.loginLink}>Entrar</Text>
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
    paddingTop: height * 0.09,
    paddingBottom: 48,
  },
  backBtn: {
    marginBottom: 20,
    alignSelf: "flex-start",
    padding: 4,
  },
  backArrow: {
    fontSize: 22,
    color: C.textMuted,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 28,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    letterSpacing: 5,
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
  cardGlowTL: {
    position: "absolute",
    top: -50,
    left: -50,
    width: 160,
    height: 160,
    borderRadius: 999,
    backgroundColor: C.purple,
    opacity: 0.14,
  },
  cardGlowBR: {
    position: "absolute",
    bottom: -40,
    right: -40,
    width: 120,
    height: 120,
    borderRadius: 999,
    backgroundColor: C.purpleMid,
    opacity: 0.1,
  },
  terms: {
    fontSize: 11,
    color: C.textMuted,
    textAlign: "center",
    lineHeight: 16,
    marginTop: 4,
    marginBottom: 16,
  },
  termsLink: {
    color: C.purpleLight,
    fontWeight: "600",
  },
  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  loginText: {
    fontSize: 13,
    color: C.textMuted,
  },
  loginLink: {
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