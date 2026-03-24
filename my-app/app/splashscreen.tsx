import { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import Svg, { Line, Defs, LinearGradient, Stop } from "react-native-svg";

const { width, height } = Dimensions.get("window");

// ─── Design Tokens ────────────────────────────────────────────────
const COLORS = {
  background:  "#07060F",
  purple:      "#7B2FBE",
  purpleMid:   "#9B4DCA",
  purpleGlow:  "#6A1FA8",
  neonGreen:   "#39FF14",
  white:       "#FFFFFF",
  textMuted:   "#9A8FB5",
};

// ─── Configuração das linhas ───────────────────────────────────────
const LINE_COUNT   = 10;
const LINE_SPACING = width / (LINE_COUNT - 1);
const DURATION     = 3800; // ms para percorrer a tela completa

// ─── Linha diagonal animada ────────────────────────────────────────
function AnimatedLine({ index }: { index: number }) {
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Offset inicial para as linhas não começarem todas juntas
    const initialOffset = (index / LINE_COUNT) * height;
    translateY.setValue(-initialOffset);

    Animated.loop(
      Animated.timing(translateY, {
        toValue: height + 80,
        duration: DURATION,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const x     = index * LINE_SPACING;
  const skew  = 180; // deslocamento horizontal para criar diagonal
  const thick = index % 3 === 0 ? 1.2 : 0.55;

  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: "absolute",
        top: -height,
        left: 0,
        width,
        height: height * 2,
        transform: [{ translateY }],
      }}
    >
      <Svg width={width} height={height * 2}>
        <Defs>
          <LinearGradient id={`g${index}`} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0"   stopColor={COLORS.purpleMid} stopOpacity="0"    />
            <Stop offset="0.3" stopColor={COLORS.purpleMid} stopOpacity="0.6"  />
            <Stop offset="0.7" stopColor={COLORS.purple}    stopOpacity="0.38" />
            <Stop offset="1"   stopColor={COLORS.purple}    stopOpacity="0"    />
          </LinearGradient>
        </Defs>
        {/* Linha diagonal: x1 no topo, x2 deslocado para criar ângulo */}
        <Line
          x1={x}
          y1={0}
          x2={x - skew}
          y2={height * 2}
          stroke={`url(#g${index})`}
          strokeWidth={thick}
        />
      </Svg>
    </Animated.View>
  );
}

// ─── Ícone geométrico central (floco estilizado) ──────────────────
function CenterIcon({ scale }: { scale: any }) {
  const size = 90;
  const arms = [0, 45, 90, 135];

  return (
    <Animated.View
      style={{
        width: size,
        height: size,
        alignItems: "center",
        justifyContent: "center",
        transform: [{ scale }],
      }}
    >
      <View style={{ position: "absolute", width: size * 1.8, height: size * 1.8, borderRadius: 999, backgroundColor: COLORS.purple,    opacity: 0.18 }} />
      <View style={{ position: "absolute", width: size * 1.3, height: size * 1.3, borderRadius: 999, backgroundColor: COLORS.purple,    opacity: 0.22 }} />

      {arms.map((angle) => (
        <View
          key={angle}
          style={{
            position: "absolute",
            width: 4,
            height: size * 0.85,
            borderRadius: 4,
            backgroundColor: COLORS.purpleMid,
            opacity: 0.9,
            transform: [{ rotate: `${angle}deg` }],
          }}
        />
      ))}

      <View style={{ width: 18, height: 18, borderRadius: 9, backgroundColor: COLORS.white, opacity: 0.95, zIndex: 2 }} />

      {arms.map((angle) => {
        const rad = (angle * Math.PI) / 180;
        const r   = size * 0.42;
        return (
          <View
            key={`tip-${angle}`}
            style={{
              position: "absolute",
              width: 8, height: 8,
              borderRadius: 4,
              backgroundColor: COLORS.white,
              opacity: 0.85,
              top:  size / 2 - 4 - Math.cos(rad) * r,
              left: size / 2 - 4 + Math.sin(rad) * r,
            }}
          />
        );
      })}
    </Animated.View>
  );
}

// ─── Main Component ───────────────────────────────────────────────
export default function SplashScreen() {
  const router = useRouter();

  const logoScale    = useRef(new Animated.Value(0.4)).current;
  const logoOpacity  = useRef(new Animated.Value(0)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleY       = useRef(new Animated.Value(24)).current;
  const bodyOpacity  = useRef(new Animated.Value(0)).current;
  const bodyY        = useRef(new Animated.Value(16)).current;
  const btnOpacity   = useRef(new Animated.Value(0)).current;
  const btnY         = useRef(new Animated.Value(20)).current;
  const glowPulse    = useRef(new Animated.Value(0.28)).current;

  useEffect(() => {
    // Glow pulsando infinito
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowPulse, { toValue: 0.46, duration: 2200, useNativeDriver: true }),
        Animated.timing(glowPulse, { toValue: 0.28, duration: 2200, useNativeDriver: true }),
      ])
    ).start();

    // Sequência de entrada
    Animated.sequence([
      Animated.parallel([
        Animated.spring(logoScale,   { toValue: 1, tension: 60, friction: 8, useNativeDriver: true }),
        Animated.timing(logoOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(titleOpacity, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(titleY,       { toValue: 0, duration: 500, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(bodyOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(bodyY,       { toValue: 0, duration: 400, useNativeDriver: true }),
      ]),
      Animated.parallel([
        Animated.timing(btnOpacity, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(btnY,       { toValue: 0, duration: 400, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />

      {/* ── Linhas diagonais animadas no fundo ── */}
      <View style={[StyleSheet.absoluteFill, { overflow: "hidden" }]} pointerEvents="none">
        {Array.from({ length: LINE_COUNT }).map((_, i) => (
          <AnimatedLine key={i} index={i} />
        ))}
      </View>

      {/* ── Glow blobs ── */}
      <Animated.View
        pointerEvents="none"
        style={[styles.glowMain, { opacity: glowPulse }]}
      />
      <View
        pointerEvents="none"
        style={{ position: "absolute", width: 260, height: 180, top: height * 0.55, left: -60, borderRadius: 999, backgroundColor: COLORS.purpleGlow, opacity: 0.18 }}
      />
      <View
        pointerEvents="none"
        style={{ position: "absolute", width: 160, height: 160, top: height * 0.3, right: -40, borderRadius: 999, backgroundColor: COLORS.purpleMid, opacity: 0.12 }}
      />

      {/* ── Conteúdo central ── */}
      <View style={styles.content}>
        <Animated.View style={{ opacity: logoOpacity, transform: [{ scale: logoScale }] }}>
          <CenterIcon scale={new Animated.Value(1)} />
        </Animated.View>

        <Animated.View style={{ opacity: titleOpacity, transform: [{ translateY: titleY }], marginTop: 36, alignItems: "center" }}>
          <Text style={styles.eyebrow}>JORNADA</Text>
          <Text style={styles.title}>PRODUTIVA</Text>
        </Animated.View>

        <Animated.View style={{ opacity: bodyOpacity, transform: [{ translateY: bodyY }], marginTop: 20, alignItems: "center", paddingHorizontal: 40 }}>
          <Text style={styles.body}>
            Tenha sua <Text style={styles.bodyAccent}>jornada</Text> esportiva na{" "}
            <Text style={styles.bodyAccent}>palma</Text> de sua{" "}
            <Text style={styles.bodyAccent}>mão</Text>.
          </Text>
        </Animated.View>
      </View>

      {/* ── Botão START ── */}
      <Animated.View style={[styles.btnWrapper, { opacity: btnOpacity, transform: [{ translateY: btnY }] }]}>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => router.push("/login-selection")}
          activeOpacity={0.82}
        >
          <Text style={styles.btnText}>START</Text>
          <Text style={styles.btnArrow}>→</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  glowMain: {
    position: "absolute",
    width: width * 1.1,
    height: height * 0.55,
    top: -height * 0.08,
    left: -width * 0.05,
    borderRadius: 999,
    backgroundColor: COLORS.purpleGlow,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  eyebrow: {
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 6,
    color: COLORS.neonGreen,
    textTransform: "uppercase",
  },
  title: {
    fontSize: 42,
    fontWeight: "800",
    letterSpacing: 3,
    color: COLORS.white,
    marginTop: 2,
    textTransform: "uppercase",
  },
  body: {
    fontSize: 15,
    color: COLORS.textMuted,
    textAlign: "center",
    lineHeight: 24,
  },
  bodyAccent: {
    color: COLORS.neonGreen,
    fontWeight: "600",
  },
  btnWrapper: {
    position: "absolute",
    bottom: 56,
    zIndex: 2,
  },
  btn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: COLORS.purple,
    paddingVertical: 14,
    paddingHorizontal: 36,
    borderRadius: 32,
    shadowColor: COLORS.purple,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.6,
    shadowRadius: 18,
    elevation: 12,
  },
  btnText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 3,
    textTransform: "uppercase",
  },
  btnArrow: {
    color: COLORS.white,
    fontSize: 18,
  },
});