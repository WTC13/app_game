import { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Image,
  TextInput,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import {
  C,
  width,
  height,
  AnimatedBackground,
  FlocoLogo,
  PrimaryButton,
} from "./components/auth.components";

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

// ─── Image picker slot ────────────────────────────────────────────
// Por enquanto sem integração com galeria — imagem via require() local.
// Quando quiser adicionar galeria no futuro, substitua o bloco "localImage"
// por expo-image-picker e remova o require().

function ImageSlot({ label, hint, aspectRatio = 1, localImage, onPress, style }) {
  const scale = useRef(new Animated.Value(1)).current;
  const onIn  = () => Animated.spring(scale, { toValue: 0.97, useNativeDriver: true }).start();
  const onOut = () => Animated.spring(scale, { toValue: 1,    useNativeDriver: true }).start();

  return (
    <View style={style}>
      <Text style={slotStyles.label}>{label}</Text>
      <Animated.View style={{ transform: [{ scale }] }}>
        <TouchableOpacity
          style={[slotStyles.slot, { aspectRatio }]}
          onPress={onPress}
          onPressIn={onIn}
          onPressOut={onOut}
          activeOpacity={1}
        >
          {localImage ? (
            <Image source={localImage} style={slotStyles.image} resizeMode="cover" />
          ) : (
            // 🔲 Placeholder enquanto não há imagem
            <View style={slotStyles.placeholder}>
              <View style={slotStyles.plusCircle}>
                <Text style={slotStyles.plusIcon}>+</Text>
              </View>
              <Text style={slotStyles.hintText}>{hint}</Text>
            </View>
          )}

          {/* Overlay de edição quando já tem imagem */}
          {localImage && (
            <View style={slotStyles.editOverlay}>
              <Text style={slotStyles.editText}>Trocar</Text>
            </View>
          )}
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const slotStyles = StyleSheet.create({
  label: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 2,
    color: C.textMuted,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  slot: {
    width: "100%",
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: C.border,
    borderStyle: "dashed",
    backgroundColor: C.inputBg,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  placeholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  plusCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: C.purple,
    alignItems: "center",
    justifyContent: "center",
  },
  plusIcon: {
    fontSize: 22,
    color: C.purple,
    lineHeight: 26,
  },
  hintText: {
    fontSize: 11,
    color: C.textMuted,
    letterSpacing: 0.5,
    textAlign: "center",
    paddingHorizontal: 16,
  },
  editOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.55)",
    paddingVertical: 6,
    alignItems: "center",
  },
  editText: {
    fontSize: 11,
    color: C.white,
    fontWeight: "600",
    letterSpacing: 1,
  },
});

// ─── Main Screen ──────────────────────────────────────────────────
export default function ProfileMedia() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [bio, setBio] = useState("");
  const bioLen = bio.length;
  const BIO_MAX = 160;

  // ──────────────────────────────────────────────────────────────────

  // ──────────────────────────────────────────────────────────────────
  const avatarImage = null; // 
  const coverImage  = null; // 

  const glowPulse  = useRef(new Animated.Value(0.26)).current;
  const headerFade = useRef(new Animated.Value(0)).current;
  const headerY    = useRef(new Animated.Value(24)).current;
  const contentFade = useRef(new Animated.Value(0)).current;
  const contentY   = useRef(new Animated.Value(20)).current;

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
        Animated.timing(contentFade, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(contentY,    { toValue: 0, duration: 400, useNativeDriver: true }),
      ]),
    ]).start();
  }, []);

  const handleFinish = () => {
    // Aqui futuramente você envia tudo para o backend
    router.push("./home");
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />
      <AnimatedBackground glowOpacity={glowPulse} />

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        style={{ zIndex: 2 }}
      >
        {/* ── Header ── */}
        <Animated.View style={[styles.header, { opacity: headerFade, transform: [{ translateY: headerY }] }]}>
          <View style={styles.headerTop}>
            <FlocoLogo size={32} />
            <StepDots current={1} total={2} />
          </View>
          <Text style={styles.eyebrow}>SEU PERFIL</Text>
          <Text style={styles.title}>Como o mundo{"\n"}te verá</Text>
          <Text style={styles.subtitle}>
            Adicione sua foto, capa e uma bio. Você pode alterar depois.
          </Text>
        </Animated.View>

        <Animated.View style={[{ opacity: contentFade, transform: [{ translateY: contentY }] }]}>

          {/* ── Capa ── */}
          <ImageSlot
            label="Foto de capa"
            hint={"Imagem de fundo do seu perfil\n(sugerido: 16:9 ou 3:1)"}
            aspectRatio={16 / 6}
            localImage={coverImage}
            onPress={() => {
              // Futuramente: abrir galeria com expo-image-picker
              // ImagePicker.launchImageLibraryAsync(...)
            }}
            style={{ marginBottom: 20 }}
          />

          {/* ── Avatar + Preview ── */}
          <View style={styles.avatarRow}>
            <ImageSlot
              label="Foto de perfil"
              hint={"Sua foto\nou avatar"}
              aspectRatio={1}
              localImage={avatarImage}
              onPress={() => {
                // Futuramente: abrir galeria com expo-image-picker
              }}
              style={{ width: 120 }}
            />

            {/* Preview do card de perfil */}
            <View style={styles.previewCard}>
              <Text style={styles.previewLabel}>PRÉVIA DO PERFIL</Text>
              <View style={styles.previewAvatarBox}>
                {avatarImage ? (
                  <Image source={avatarImage} style={styles.previewAvatar} />
                ) : (
                  <View style={styles.previewAvatarPlaceholder}>
                    <Text style={{ fontSize: 22 }}>👤</Text>
                  </View>
                )}
              </View>
              <Text style={styles.previewName}>
                {params.apelido || "Seu apelido"}
              </Text>
              <Text style={styles.previewSport}>
                {params.genero || "Esportista"}
              </Text>
            </View>
          </View>

          {/* ── Bio ── */}
          <View style={styles.bioWrapper}>
            <View style={styles.bioHeader}>
              <Text style={styles.bioLabel}>BIO</Text>
              <Text style={[styles.bioCount, bioLen > BIO_MAX * 0.9 && { color: "#E2694A" }]}>
                {bioLen}/{BIO_MAX}
              </Text>
            </View>
            <View style={styles.bioInputWrapper}>
              <TextInput
                style={styles.bioInput}
                placeholder="Conte um pouco sobre você como atleta..."
                placeholderTextColor={C.textMuted}
                multiline
                maxLength={BIO_MAX}
                value={bio}
                onChangeText={setBio}
                textAlignVertical="top"
              />
            </View>
          </View>

          {/* ── Nota sobre imagens ── */}
          <View style={styles.infoBox}>
            <Text style={styles.infoIcon}>💡</Text>
            <Text style={styles.infoText}>
              Para adicionar suas imagens agora, edite as variáveis{" "}
              <Text style={{ color: C.purpleLight }}>avatarImage</Text> e{" "}
              <Text style={{ color: C.purpleLight }}>coverImage</Text> no arquivo{" "}
              <Text style={{ color: C.purpleLight }}>profile-media.tsx</Text> com o caminho da sua imagem em{" "}
              <Text style={{ color: C.purpleLight }}>assets/images/</Text>.
            </Text>
          </View>

          {/* ── Botão finalizar ── */}
          <PrimaryButton
            label="ENTRAR NO JOGO →"
            onPress={handleFinish}
            style={styles.btn}
          />

          <TouchableOpacity style={styles.skipBtn} onPress={handleFinish}>
            <Text style={styles.skipText}>Pular por agora</Text>
          </TouchableOpacity>

        </Animated.View>
      </ScrollView>
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
    paddingBottom: 52,
  },
  header: {
    marginBottom: 28,
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

  // Avatar row
  avatarRow: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 24,
    alignItems: "flex-start",
  },

  // Preview card
  previewCard: {
    flex: 1,
    backgroundColor: C.bgCard,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: C.border,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  previewLabel: {
    fontSize: 9,
    fontWeight: "700",
    letterSpacing: 2,
    color: C.textMuted,
    textTransform: "uppercase",
  },
  previewAvatarBox: {
    width: 56,
    height: 56,
    borderRadius: 28,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: C.purple,
  },
  previewAvatar: {
    width: "100%",
    height: "100%",
  },
  previewAvatarPlaceholder: {
    flex: 1,
    backgroundColor: C.inputBg,
    alignItems: "center",
    justifyContent: "center",
  },
  previewName: {
    fontSize: 13,
    fontWeight: "700",
    color: C.white,
    letterSpacing: 0.5,
  },
  previewSport: {
    fontSize: 10,
    color: C.textMuted,
    letterSpacing: 0.5,
  },

  // Bio
  bioWrapper: {
    marginBottom: 20,
  },
  bioHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  bioLabel: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 2,
    color: C.textMuted,
    textTransform: "uppercase",
  },
  bioCount: {
    fontSize: 11,
    color: C.textMuted,
  },
  bioInputWrapper: {
    backgroundColor: C.inputBg,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 12,
    padding: 14,
    minHeight: 100,
  },
  bioInput: {
    color: C.white,
    fontSize: 14,
    lineHeight: 22,
    minHeight: 80,
  },

  // Info box
  infoBox: {
    flexDirection: "row",
    gap: 10,
    backgroundColor: "#0E0C1A",
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 12,
    padding: 14,
    marginBottom: 24,
    alignItems: "flex-start",
  },
  infoIcon: {
    fontSize: 14,
    marginTop: 1,
  },
  infoText: {
    flex: 1,
    fontSize: 11,
    color: C.textMuted,
    lineHeight: 18,
  },

  btn: {
    marginBottom: 12,
  },
  skipBtn: {
    alignItems: "center",
    paddingVertical: 10,
  },
  skipText: {
    fontSize: 13,
    color: C.textMuted,
    letterSpacing: 0.3,
  },
});