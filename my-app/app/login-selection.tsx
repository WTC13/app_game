import { useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import {
  C,
  width,
  height,
  AnimatedBackground,
  FlocoLogo,
} from "./components/auth.components";

export default function LoginSelection() {
  const router = useRouter();

  const glowPulse  = useRef(new Animated.Value(0.28)).current;
  const fadeIn     = useRef(new Animated.Value(0)).current;
  const slideY     = useRef(new Animated.Value(30)).current;
  const card1Scale = useRef(new Animated.Value(0.94)).current;
  const card2Scale = useRef(new Animated.Value(0.94)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(glowPulse, { toValue: 0.44, duration: 2400, useNativeDriver: true }),
        Animated.timing(glowPulse, { toValue: 0.26, duration: 2400, useNativeDriver: true }),
      ])
    ).start();

    Animated.parallel([
      Animated.timing(fadeIn, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(slideY, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();

    // Cards aparecem com delay escalonado
    Animated.sequence([
      Animated.delay(300),
      Animated.parallel([
        Animated.spring(card1Scale, { toValue: 1, tension: 70, friction: 8, useNativeDriver: true }),
        Animated.spring(card2Scale, { toValue: 1, tension: 70, friction: 8, delay: 80, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  function CardBtn({ label, sub, onPress, scaleAnim, accent }: { label: string; sub: string; onPress: () => void; scaleAnim: any; accent?: boolean }) {
    const pressScale = useRef(new Animated.Value(1)).current;
    const onIn  = () => Animated.spring(pressScale, { toValue: 0.96, useNativeDriver: true }).start();
    const onOut = () => Animated.spring(pressScale, { toValue: 1,    useNativeDriver: true }).start();

    return (
      <Animated.View style={{ transform: [{ scale: Animated.multiply(scaleAnim, pressScale) }], flex: 1 }}>
        <TouchableOpacity
          style={[styles.card, accent && styles.cardAccent]}
          onPress={onPress}
          onPressIn={onIn}
          onPressOut={onOut}
          activeOpacity={1}
        >
          {/* Brilho interno no card accent */}
          {accent && (
            <View style={styles.cardGlow} />
          )}
          <Text style={[styles.cardLabel, accent && styles.cardLabelAccent]}>{label}</Text>
          <Text style={styles.cardSub}>{sub}</Text>
        </TouchableOpacity>
      </Animated.View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />
      <AnimatedBackground glowOpacity={glowPulse} />

      <Animated.View style={[styles.content, { opacity: fadeIn, transform: [{ translateY: slideY }] }]}>

        {/* Logo + saudação */}
        <View style={styles.header}>
          <FlocoLogo size={52} />
          <View style={styles.headerText}>
            <Text style={styles.greeting}>SEJA BEM</Text>
            <Text style={styles.greetingBold}>VINDO</Text>
            <Text style={styles.sub}>Selecione abaixo:</Text>
          </View>
        </View>

        {/* Divisor */}
        <View style={styles.divider} />

        {/* Cards de seleção */}
        <View style={styles.cardsRow}>
          <CardBtn
            label="RETORNAR A PRODUZIR"
            sub="Já tenho conta"
            onPress={() => router.push("/login")}
            scaleAnim={card1Scale}
            accent={false}
          />
          <CardBtn
            label="QUERO SER UM JOGADOR"
            sub="Criar conta"
            onPress={() => router.push("/cadastro")}
            scaleAnim={card2Scale}
            accent
          />
        </View>

      </Animated.View>

      {/* Rodapé logo */}
      <View style={styles.footer}>
        <FlocoLogo size={20} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: C.bg,
  },
  content: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: height * 0.14,
    zIndex: 2,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    marginBottom: 32,
  },
  headerText: {
    flex: 1,
  },
  greeting: {
    fontSize: 13,
    fontWeight: "600",
    letterSpacing: 4,
    color: C.textMuted,
  },
  greetingBold: {
    fontSize: 34,
    fontWeight: "800",
    letterSpacing: 2,
    color: C.white,
    marginTop: -4,
  },
  sub: {
    fontSize: 13,
    color: C.textMuted,
    marginTop: 6,
    letterSpacing: 0.5,
  },
  divider: {
    height: 1,
    backgroundColor: C.border,
    marginBottom: 32,
    opacity: 0.6,
  },
  cardsRow: {
    flexDirection: "row",
    gap: 14,
  },
  card: {
    backgroundColor: C.bgCard,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.border,
    paddingVertical: 28,
    paddingHorizontal: 18,
    minHeight: 160,
    justifyContent: "flex-end",
    overflow: "hidden",
  },
  cardAccent: {
    borderColor: C.purple,
    backgroundColor: "#130F24",
  },
  cardGlow: {
    position: "absolute",
    top: -30,
    left: -30,
    width: 140,
    height: 140,
    borderRadius: 999,
    backgroundColor: C.purple,
    opacity: 0.18,
  },
  cardLabel: {
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 1,
    color: C.white,
    lineHeight: 18,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  cardLabelAccent: {
    color: C.purpleLight,
  },
  cardSub: {
    fontSize: 11,
    color: C.textMuted,
    letterSpacing: 0.5,
  },
  footer: {
    alignItems: "center",
    paddingBottom: 32,
    opacity: 0.4,
    zIndex: 2,
  },
});