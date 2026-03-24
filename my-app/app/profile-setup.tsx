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
  Switch,
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

// ─── Opções de gênero ─────────────────────────────────────────────
const GENEROS = ["Masculino", "Feminino", "Não-binário", "Prefiro não dizer"];

// ─── Selector pills ───────────────────────────────────────────────
function PillSelector({ options, selected, onSelect }) {
  return (
    <View style={pillStyles.row}>
      {options.map((opt) => {
        const active = selected === opt;
        return (
          <TouchableOpacity
            key={opt}
            style={[pillStyles.pill, active && pillStyles.pillActive]}
            onPress={() => onSelect(opt)}
            activeOpacity={0.8}
          >
            <Text style={[pillStyles.label, active && pillStyles.labelActive]}>
              {opt}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const pillStyles = StyleSheet.create({
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 2,
  },
  pill: {
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: C.inputBg,
  },
  pillActive: {
    borderColor: C.purple,
    backgroundColor: "#1A0F2E",
  },
  label: {
    fontSize: 13,
    color: C.textMuted,
    fontWeight: "500",
  },
  labelActive: {
    color: C.purpleLight,
    fontWeight: "700",
  },
});

// ─── Seção com label ──────────────────────────────────────────────
function Section({ label, children }) {
  return (
    <View style={{ marginBottom: 20 }}>
      <Text style={sectionStyles.label}>{label}</Text>
      {children}
    </View>
  );
}

const sectionStyles = StyleSheet.create({
  label: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 2,
    color: C.textMuted,
    textTransform: "uppercase",
    marginBottom: 8,
  },
});

// ─── Step indicator ───────────────────────────────────────────────
function StepDots({ current, total }) {
  return (
    <View style={{ flexDirection: "row", gap: 6, alignItems: "center" }}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={{
            width: i === current ? 20 : 6,
            height: 6,
            borderRadius: 3,
            backgroundColor: i === current ? C.purple : C.border,
          }}
        />
      ))}
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────
export default function ProfileSetup() {
  const router = useRouter();

  const [apelido,    setApelido]    = useState("");
  const [altura,     setAltura]     = useState("");
  const [peso,       setPeso]       = useState("");
  const [genero,     setGenero]     = useState(null);
  const [localizacao, setLocalizacao] = useState(false);

  const glowPulse  = useRef(new Animated.Value(0.26)).current;
  const headerFade = useRef(new Animated.Value(0)).current;
  const headerY    = useRef(new Animated.Value(24)).current;
  const formFade   = useRef(new Animated.Value(0)).current;
  const formY      = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowPulse, { toValue: 0.42, duration: 2600, useNativeDriver: true }),
        Animated.timing(glowPulse, { toValue: 0.24, duration: 2600, useNativeDriver: true }),
      ])
    ).start();

    Animated.sequence([
      Animated.parallel([
        Animated.timing(headerFade, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(headerY,    { toValue: 0, duration: 400, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(formFade, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(formY,    { toValue: 0, duration: 400, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  const canContinue = apelido.trim() && altura.trim() && peso.trim() && genero;

  const handleContinue = () => {
    if (!canContinue) return;
    router.push({
      pathname: "/profile-media",
      params: { apelido, altura, peso, genero },
    });
  };

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
          {/* ── Header ── */}
          <Animated.View style={[styles.header, { opacity: headerFade, transform: [{ translateY: headerY }] }]}>
            <View style={styles.headerTop}>
              <FlocoLogo size={32} />
              <StepDots current={0} total={2} />
            </View>
            <Text style={styles.eyebrow}>SOBRE VOCÊ</Text>
            <Text style={styles.title}>Vamos te{"\n"}conhecer melhor</Text>
            <Text style={styles.subtitle}>
              Essas informações personalizam sua experiência esportiva.
            </Text>
          </Animated.View>

          {/* ── Formulário ── */}
          <Animated.View style={[styles.card, { opacity: formFade, transform: [{ translateY: formY }] }]}>
            <View style={styles.cardGlowTL} />

            {/* Apelido */}
            <Section label="Como deseja ser chamado?">
              <AuthInput
                placeholder="Seu apelido ou nome"
                value={apelido}
                onChangeText={setApelido}
              />
            </Section>

            {/* Altura + Peso lado a lado */}
            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Section label="Altura">
                  <AuthInput
                    placeholder="Ex: 1,75 m"
                    keyboardType="numeric"
                    value={altura}
                    onChangeText={setAltura}
                  />
                </Section>
              </View>
              <View style={{ flex: 1 }}>
                <Section label="Peso">
                  <AuthInput
                    placeholder="Ex: 70 kg"
                    keyboardType="numeric"
                    value={peso}
                    onChangeText={setPeso}
                  />
                </Section>
              </View>
            </View>

            {/* Gênero */}
            <Section label="Gênero">
              <PillSelector
                options={GENEROS}
                selected={genero}
                onSelect={setGenero}
              />
            </Section>

            {/* Localização */}
            <View style={styles.locationRow}>
              <View style={styles.locationTexts}>
                <Text style={styles.locationTitle}>Aceitar localização</Text>
                <Text style={styles.locationSub}>
                  Permite encontrar eventos e jogadores próximos a você.
                </Text>
              </View>
              <Switch
                value={localizacao}
                onValueChange={setLocalizacao}
                trackColor={{ false: C.border, true: C.purple }}
                thumbColor={localizacao ? C.purpleLight : C.textMuted}
              />
            </View>

          </Animated.View>

          {/* ── Botão ── */}
          <PrimaryButton
            label="CONTINUAR →"
           onPress={() => router.push("/profile-media")}
            style={[styles.btn, !canContinue && { opacity: 0.4 }]}
          />

          {/* Hint campos obrigatórios */}
          {!canContinue && (
            <Text style={styles.hint}>Preencha todos os campos para continuar</Text>
          )}

        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.bg,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 22,
    paddingTop: height * 0.08,
    paddingBottom: 48,
  },
  header: {
    marginBottom: 28,
    zIndex: 2,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 4,
    color: C.neonGreen,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: C.white,
    lineHeight: 34,
    letterSpacing: 0.3,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 13,
    color: C.textMuted,
    lineHeight: 20,
  },
  card: {
    backgroundColor: C.bgCard,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: C.border,
    padding: 22,
    marginBottom: 20,
    overflow: "hidden",
    zIndex: 2,
  },
  cardGlowTL: {
    position: "absolute",
    top: -50,
    left: -50,
    width: 160,
    height: 160,
    borderRadius: 999,
    backgroundColor: C.purple,
    opacity: 0.12,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: C.inputBg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: C.border,
    padding: 14,
    marginTop: 4,
  },
  locationTexts: {
    flex: 1,
  },
  locationTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: C.white,
    marginBottom: 2,
  },
  locationSub: {
    fontSize: 11,
    color: C.textMuted,
    lineHeight: 16,
  },
  btn: {
    zIndex: 2,
  },
  hint: {
    fontSize: 11,
    color: C.textMuted,
    textAlign: "center",
    marginTop: 10,
  },
});