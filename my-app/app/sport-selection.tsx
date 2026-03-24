import { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  StatusBar,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import {
  C,
  width,
  height,
  AnimatedBackground,
  FlocoLogo,
  PrimaryButton,
} from "./components/auth.components";

// ─── Dados dos esportes ───────────────────────────────────────────
const SPORTS = [
  {
    id:    "pingpong",
    label: "PING PONG",
    sub:   "Esporte de mesa",
    image: require("../assets/images/pingpong.png"),
    placeholder: "🏓",
    color: C.purpleMid,
    glow:  "#7B2FBE",
  },
  {
    id:    "esports",
    label: "E-SPORTS",
    sub:   "Competição digital",
    image: require("../assets/images/esports.png"),
    placeholder: "🎮",
    color: "#1FA87B",
    glow:  "#0F6E56",
  },
];

// ─── Card de esporte ──────────────────────────────────────────────
function SportCard({ sport, selected, onPress, enterAnim }) {
  const pressScale = useRef(new Animated.Value(1)).current;
  const onIn  = () => Animated.spring(pressScale, { toValue: 0.97, useNativeDriver: true }).start();
  const onOut = () => Animated.spring(pressScale, { toValue: 1,    useNativeDriver: true }).start();

  const isSelected = selected === sport.id;

  return (
    <Animated.View
      style={{
        flex: 1,
        transform: [{ scale: Animated.multiply(enterAnim, pressScale) }],
      }}
    >
      <TouchableOpacity
        style={[styles.card, isSelected && { borderColor: sport.color, borderWidth: 2 }]}
        onPress={onPress}
        onPressIn={onIn}
        onPressOut={onOut}
        activeOpacity={1}
      >

        {/* Glow de seleção */}
        {isSelected && (
          <Animated.View
            style={[styles.selectedGlow, { backgroundColor: sport.glow }]}
          />
        )}

        {/* Área da imagem */}
        <View style={styles.imageArea}>
          {sport.image ? (
            <Image
              source={sport.image}
              style={styles.image}
              resizeMode="cover"
            />
          ) : null}
        </View>

        {/* Texto do card */}
        <View style={styles.cardBody}>
          <Text style={[styles.cardLabel, isSelected && { color: sport.color }]}>
            {sport.label}
          </Text>
          <Text style={styles.cardSub}>{sport.sub}</Text>
        </View>

        {/* Indicador de seleção */}
        <View style={[styles.checkCircle, isSelected && { backgroundColor: sport.color, borderColor: sport.color }]}>
          {isSelected && <Text style={styles.checkMark}>✓</Text>}
        </View>

      </TouchableOpacity>
    </Animated.View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────
export default function SportSelection() {
  const router = useRouter();
  const [selected, setSelected] = useState(null);

  const glowPulse  = useRef(new Animated.Value(0.28)).current;
  const headerFade = useRef(new Animated.Value(0)).current;
  const headerY    = useRef(new Animated.Value(28)).current;
  const card1Scale = useRef(new Animated.Value(0.88)).current;
  const card2Scale = useRef(new Animated.Value(0.88)).current;
  const btnFade    = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Glow pulsando
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowPulse, { toValue: 0.44, duration: 2400, useNativeDriver: true }),
        Animated.timing(glowPulse, { toValue: 0.26, duration: 2400, useNativeDriver: true }),
      ])
    ).start();

    // Sequência de entrada
    Animated.sequence([
      // Header
      Animated.parallel([
        Animated.timing(headerFade, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(headerY,    { toValue: 0, duration: 400, useNativeDriver: true }),
      ]),
      // Cards escalonados
      Animated.parallel([
        Animated.spring(card1Scale, { toValue: 1, tension: 65, friction: 8, useNativeDriver: true }),
        Animated.spring(card2Scale, { toValue: 1, tension: 65, friction: 8, delay: 100, useNativeDriver: true }),
      ]),
      // Botão aparece
      Animated.timing(btnFade, { toValue: 1, duration: 350, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleContinue = () => {
    if (!selected) return;
    // Navega para a home passando o esporte selecionado
    router.push({ pathname: "./index.tsx", params: { sport: selected } });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />
      <AnimatedBackground glowOpacity={glowPulse} />

      {/* ── Header ── */}
      <Animated.View
        style={[styles.header, { opacity: headerFade, transform: [{ translateY: headerY }] }]}
      >
        <FlocoLogo size={36} />
        <View style={styles.headerTexts}>
          <Text style={styles.headerEyebrow}>PASSO FINAL</Text>
          <Text style={styles.headerTitle}>Qual esporte{"\n"}você quer praticar?</Text>
        </View>
      </Animated.View>

      {/* ── Cards lado a lado ── */}
      <View style={styles.cardsRow}>
        {SPORTS.map((sport, i) => (
          <SportCard
            key={sport.id}
            sport={sport}
            selected={selected}
            onPress={() => setSelected(sport.id)}
            enterAnim={i === 0 ? card1Scale : card2Scale}
          />
        ))}
      </View>

      {/* ── Mensagem de seleção ── */}
      <Animated.View style={[styles.hintRow, { opacity: btnFade }]}>
        {selected ? (
          <Text style={styles.hintSelected}>
            ✓{" "}
            <Text style={{ color: C.white, fontWeight: "600" }}>
              {SPORTS.find((s) => s.id === selected)?.label}
            </Text>{" "}
            selecionado
          </Text>
        ) : (
          <Text style={styles.hintIdle}>Selecione uma modalidade para continuar</Text>
        )}
      </Animated.View>

      {/* ── Botão continuar ── */}
      <Animated.View style={[styles.btnWrapper, { opacity: btnFade }]}>
        <PrimaryButton
          label="CONFIRMAR →"
          onPress={() => router.push("/profile-setup")}
          style={[!selected && styles.btnDisabled]}
        />
      </Animated.View>

    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.bg,
    paddingHorizontal: 22,
    paddingTop: height * 0.1,
    paddingBottom: 40,
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginBottom: 36,
    zIndex: 2,
  },
  headerTexts: {
    flex: 1,
  },
  headerEyebrow: {
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 4,
    color: C.neonGreen,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: C.white,
    lineHeight: 30,
    letterSpacing: 0.5,
  },

  // Cards
  cardsRow: {
    flexDirection: "row",
    gap: 14,
    flex: 1,
    maxHeight: height * 0.52,
    zIndex: 2,
  },
  card: {
    flex: 1,
    backgroundColor: C.bgCard,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: C.border,
    overflow: "hidden",
    position: "relative",
  },
  selectedGlow: {
    position: "absolute",
    top: -40,
    left: -40,
    width: 180,
    height: 180,
    borderRadius: 999,
    opacity: 0.2,
    zIndex: 0,
  },

  // Área da imagem
  imageArea: {
    width: "100%",
    height: "58%",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  // 🔲 Placeholder — remova quando adicionar a imagem real
  imagePlaceholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 1,
    borderColor: C.border,
    gap: 8,
    backgroundColor: "#0C0A18",
  },
  placeholderEmoji: {
    fontSize: 40,
  },
  placeholderHint: {
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 1,
    textTransform: "uppercase",
    opacity: 0.7,
  },

  // Corpo do card
  cardBody: {
    padding: 14,
    flex: 1,
    justifyContent: "center",
    zIndex: 1,
  },
  cardLabel: {
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 1.5,
    color: C.white,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  cardSub: {
    fontSize: 11,
    color: C.textMuted,
    letterSpacing: 0.5,
  },

  // Check de seleção
  checkCircle: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: C.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    zIndex: 2,
  },
  checkMark: {
    fontSize: 12,
    color: C.white,
    fontWeight: "700",
  },

  // Hint
  hintRow: {
    alignItems: "center",
    marginTop: 20,
    marginBottom: 6,
    zIndex: 2,
  },
  hintIdle: {
    fontSize: 12,
    color: C.textMuted,
    letterSpacing: 0.3,
  },
  hintSelected: {
    fontSize: 12,
    color: C.neonGreen,
    letterSpacing: 0.3,
  },

  // Botão
  btnWrapper: {
    marginTop: 12,
    zIndex: 2,
  },
  btnDisabled: {
    opacity: 0.4,
  },
});