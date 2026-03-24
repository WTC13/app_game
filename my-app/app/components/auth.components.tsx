import { useRef, useEffect } from "react";
import {
  View,
  Text,
  Animated,
  Dimensions,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import Svg, { Line, Defs, LinearGradient, Stop } from "react-native-svg";

export const { width, height } = Dimensions.get("window");

// ─── Design Tokens ────────────────────────────────────────────────
export const C = {
  bg:          "#07060F",
  bgCard:      "#100E1E",
  purple:      "#7B2FBE",
  purpleMid:   "#9B4DCA",
  purpleGlow:  "#6A1FA8",
  purpleLight: "#C084FC",
  neonGreen:   "#39FF14",
  white:       "#FFFFFF",
  textMuted:   "#9A8FB5",
  border:      "#2A2440",
  inputBg:     "#0E0C1A",
};

// ─── Animated background lines (reutilizável) ─────────────────────
const LINE_COUNT   = 10;
const LINE_SPACING = width / (LINE_COUNT - 1);
const DURATION     = 4200;

function AnimatedLine({ index }: { index: number }) {
  const translateY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    translateY.setValue(-(index / LINE_COUNT) * height);
    Animated.loop(
      Animated.timing(translateY, {
        toValue: height + 80,
        duration: DURATION,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const x     = index * LINE_SPACING;
  const thick = index % 3 === 0 ? 1.1 : 0.5;

  return (
    <Animated.View
      pointerEvents="none"
      style={{ position: "absolute", top: -height, left: 0, width, height: height * 2, transform: [{ translateY }] }}
    >
      <Svg width={width} height={height * 2}>
        <Defs>
          <LinearGradient id={`gl${index}`} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0"   stopColor={C.purpleMid} stopOpacity="0"    />
            <Stop offset="0.3" stopColor={C.purpleMid} stopOpacity="0.5"  />
            <Stop offset="0.7" stopColor={C.purple}    stopOpacity="0.32" />
            <Stop offset="1"   stopColor={C.purple}    stopOpacity="0"    />
          </LinearGradient>
        </Defs>
        <Line x1={x} y1={0} x2={x - 180} y2={height * 2} stroke={`url(#gl${index})`} strokeWidth={thick} />
      </Svg>
    </Animated.View>
  );
}

export function AnimatedBackground({ glowOpacity }: { glowOpacity: any }) {
  return (
    <>
      {/* Linhas diagonais */}
      <View style={[StyleSheet.absoluteFill, { overflow: "hidden" }]} pointerEvents="none">
        {Array.from({ length: LINE_COUNT }).map((_, i) => (
          <AnimatedLine key={i} index={i} />
        ))}
      </View>
      {/* Blob principal roxo */}
      <Animated.View
        pointerEvents="none"
        style={{
          position: "absolute",
          width: width * 1.1,
          height: height * 0.45,
          top: -height * 0.06,
          left: -width * 0.05,
          borderRadius: 999,
          backgroundColor: C.purpleGlow,
          opacity: glowOpacity,
        }}
      />
      {/* Blob secundário */}
      <View
        pointerEvents="none"
        style={{ position: "absolute", width: 200, height: 200, bottom: height * 0.05, right: -60, borderRadius: 999, backgroundColor: C.purpleMid, opacity: 0.1 }}
      />
    </>
  );
}

// ─── Logo floco ───────────────────────────────────────────────────
export function FlocoLogo({ size = 48 }) {
  const arms = [0, 45, 90, 135];
  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <View style={{ position: "absolute", width: size * 1.7, height: size * 1.7, borderRadius: 999, backgroundColor: C.purple, opacity: 0.15 }} />
      <View style={{ position: "absolute", width: size * 1.2, height: size * 1.2, borderRadius: 999, backgroundColor: C.purple, opacity: 0.2 }} />
      {arms.map((a) => (
        <View key={a} style={{ position: "absolute", width: 3, height: size * 0.82, borderRadius: 3, backgroundColor: C.purpleMid, opacity: 0.9, transform: [{ rotate: `${a}deg` }] }} />
      ))}
      <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: C.white, zIndex: 2 }} />
      {arms.map((a) => {
        const rad = (a * Math.PI) / 180;
        const r   = size * 0.4;
        return (
          <View key={`t${a}`} style={{ position: "absolute", width: 6, height: 6, borderRadius: 3, backgroundColor: C.white, opacity: 0.85, top: size / 2 - 3 - Math.cos(rad) * r, left: size / 2 - 3 + Math.sin(rad) * r }} />
        );
      })}
    </View>
  );
}

// ─── Input customizado ────────────────────────────────────────────
export function AuthInput({ label, placeholder, secureTextEntry, keyboardType, value, onChangeText }: { label?: string; placeholder: string; secureTextEntry?: boolean; keyboardType?: string; value: string; onChangeText: (text: string) => void }) {
  const borderAnim = useRef(new Animated.Value(0)).current;

  const onFocus = () => Animated.timing(borderAnim, { toValue: 1, duration: 200, useNativeDriver: false }).start();
  const onBlur  = () => Animated.timing(borderAnim, { toValue: 0, duration: 200, useNativeDriver: false }).start();

  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [C.border, C.purple],
  });

  return (
    <View style={{ marginBottom: 16 }}>
      {label ? <Text style={inputStyles.label}>{label}</Text> : null}
      <Animated.View style={[inputStyles.wrapper, { borderColor }]}>
        <TextInput
          style={inputStyles.input}
          placeholder={placeholder}
          placeholderTextColor={C.textMuted}
          secureTextEntry={secureTextEntry}
          keyboardType={(keyboardType || "default") as any}
          value={value}
          onChangeText={onChangeText}
          onFocus={onFocus}
          onBlur={onBlur}
          autoCapitalize="none"
        />
      </Animated.View>
    </View>
  );
}

const inputStyles = StyleSheet.create({
  label: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 2,
    color: C.textMuted,
    textTransform: "uppercase",
    marginBottom: 6,
  },
  wrapper: {
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: C.inputBg,
    paddingHorizontal: 16,
    paddingVertical: 0,
    height: 48,
    justifyContent: "center",
  },
  input: {
    color: C.white,
    fontSize: 15,
    fontWeight: "400",
  },
});

// ─── Botão primário ───────────────────────────────────────────────
export function PrimaryButton({ label, onPress, style }: { label: string; onPress: () => void; style?: any }) {
  const scale = useRef(new Animated.Value(1)).current;

  const onPressIn  = () => Animated.spring(scale, { toValue: 0.96, useNativeDriver: true }).start();
  const onPressOut = () => Animated.spring(scale, { toValue: 1,    useNativeDriver: true }).start();

  return (
    <Animated.View style={[{ transform: [{ scale }] }, style]}>
      <TouchableOpacity
        style={btnStyles.btn}
        onPress={onPress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        activeOpacity={1}
      >
        <Text style={btnStyles.label}>{label}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
}

const btnStyles = StyleSheet.create({
  btn: {
    backgroundColor: C.purple,
    borderRadius: 32,
    paddingVertical: 15,
    alignItems: "center",
    shadowColor: C.purple,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.55,
    shadowRadius: 16,
    elevation: 10,
  },
  label: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 3,
    textTransform: "uppercase",
  },
});