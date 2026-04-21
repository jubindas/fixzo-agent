import { Feather, Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from "react-native";

// --- TYPES ---

interface InputProps extends TextInputProps {
  label: string;
  icon: keyof typeof Feather.glyphMap;
}

// --- REUSABLE COMPONENTS ---

const CustomInput = ({ label, icon, ...props }: InputProps) => (
  <View style={styles.inputWrapper}>
    <Text style={styles.inputLabel}>{label}</Text>
    <View style={styles.inputContainer}>
      <Feather name={icon} size={18} color="#94a3b8" style={styles.inputIcon} />
      <TextInput
        style={styles.textInput}
        placeholderTextColor="#cbd5e1"
        {...props}
      />
    </View>
  </View>
);

const CheckItem = ({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) => (
  <Pressable
    style={[styles.docRow, selected && styles.docRowSelected]}
    onPress={onPress}
  >
    <Ionicons
      name={selected ? "checkbox" : "square-outline"}
      size={20}
      color={selected ? "#10b981" : "#cbd5e1"}
    />
    <Text style={[styles.docText, selected && styles.docTextSelected]}>
      {label}
    </Text>
  </Pressable>
);

const StepIndicator = ({ currentStep }: { currentStep: number }) => (
  <View style={styles.stepContainer}>
    {[1, 2, 3].map((step) => (
      <View
        key={step}
        style={[
          styles.stepBar,
          currentStep >= step ? styles.stepBarActive : styles.stepBarInactive,
        ]}
      />
    ))}
  </View>
);

// --- MAIN PAGE ---

export default function RegisterWorker() {
  const [step, setStep] = useState(1);

  // Form State
  const [kyc, setKyc] = useState<string[]>([]);
  const toggleKyc = (id: string) => {
    setKyc((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const nextStep = () => setStep((s) => Math.min(3, s + 1));
  const prevStep = () => setStep((s) => Math.max(1, s - 1));

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.select({ ios: "padding", android: undefined })}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={styles.heading}>Member Registration</Text>
            <Text style={styles.subheading}>
              Fill all fields for Arunachal Pradesh compliance.
            </Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>STEP {step} OF 3</Text>
          </View>
        </View>

        <StepIndicator currentStep={step} />

        <View style={styles.card}>
          {step === 1 && (
            <View style={styles.formSection}>
              <Text style={styles.innerSectionTitle}>Personal Details</Text>
              <View style={styles.row}>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <CustomInput
                    label="First Name"
                    icon="user"
                    placeholder="JOHN"
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <CustomInput
                    label="Last Name"
                    icon="user"
                    placeholder="DOE"
                  />
                </View>
              </View>

              <Text style={styles.innerSectionTitle}>
                Guardian / Spouse Info
              </Text>
              <CustomInput
                label="Relation Name"
                icon="users"
                placeholder="Father/Mother/Spouse Name"
              />

              <Text style={styles.innerSectionTitle}>Contact</Text>
              <CustomInput
                label="Mobile No."
                icon="phone"
                placeholder="98765 43210"
                keyboardType="phone-pad"
              />
              <CustomInput
                label="Alternate No."
                icon="smartphone"
                placeholder="Optional"
                keyboardType="phone-pad"
              />
              <CustomInput
                label="Registration Date"
                icon="calendar"
                placeholder="DD/MM/YYYY"
              />
            </View>
          )}

          {step === 2 && (
            <View style={styles.formSection}>
              <Text style={styles.innerSectionTitle}>Address Details</Text>
              <CustomInput
                label="Present Address"
                icon="map-pin"
                placeholder="Building, Street, Area..."
                multiline
              />
              <CustomInput
                label="Present PIN"
                icon="hash"
                placeholder="791111"
                keyboardType="number-pad"
              />

              <View style={styles.divider} />

              <CustomInput
                label="Permanent Address"
                icon="home"
                placeholder="Native Village/Town Address"
                multiline
              />
              <CustomInput
                label="Permanent PIN"
                icon="hash"
                placeholder="784001"
                keyboardType="number-pad"
              />

              <Text style={styles.innerSectionTitle}>Work Profile</Text>
              <CustomInput
                label="Work Category"
                icon="briefcase"
                placeholder="e.g. Construction / Retail"
              />
              <CustomInput
                label="Work Description"
                icon="edit-3"
                placeholder="Briefly describe your role"
                multiline
              />
            </View>
          )}

          {step === 3 && (
            <View style={styles.formSection}>
              <Text style={styles.innerSectionTitle}>KYC Documents</Text>
              <View style={styles.grid}>
                <CheckItem
                  label="Aadhaar Card"
                  selected={kyc.includes("aadhaar")}
                  onPress={() => toggleKyc("aadhaar")}
                />
                <CheckItem
                  label="Voter ID"
                  selected={kyc.includes("voter")}
                  onPress={() => toggleKyc("voter")}
                />
                <CheckItem
                  label="Driving Licence"
                  selected={kyc.includes("dl")}
                  onPress={() => toggleKyc("dl")}
                />
                <CheckItem
                  label="Ration Card"
                  selected={kyc.includes("ration")}
                  onPress={() => toggleKyc("ration")}
                />
              </View>

              <View style={styles.ilpBox}>
                <View style={styles.ilpHeader}>
                  <Feather name="shield" size={14} color="#b91c1c" />
                  <Text style={styles.ilpHeaderText}>
                    VALID ILP DOCUMENT (ARUNACHAL)
                  </Text>
                </View>
                <View style={styles.row}>
                  <View style={{ flex: 1, marginRight: 8 }}>
                    <CustomInput
                      label="Issue Date"
                      icon="calendar"
                      placeholder="YYYY-MM-DD"
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <CustomInput
                      label="Expiry Date"
                      icon="calendar"
                      placeholder="YYYY-MM-DD"
                    />
                  </View>
                </View>
              </View>

              <Text style={styles.innerSectionTitle}>Office Use</Text>
              <CustomInput
                label="Agent Name"
                icon="user-check"
                placeholder="Assigned Agent"
              />
              <CustomInput
                label="Employee ID"
                icon="tag"
                placeholder="FIX-000"
              />
            </View>
          )}

          {/* CONTROLS */}
          <View style={styles.buttonRow}>
            {step > 1 && (
              <Pressable style={styles.backButton} onPress={prevStep}>
                <Feather name="chevron-left" size={20} color="#64748b" />
                <Text style={styles.backButtonText}>Back</Text>
              </Pressable>
            )}

            <Pressable
              style={[styles.primaryButton, step === 1 && { width: "100%" }]}
              onPress={step === 3 ? () => alert("Success!") : nextStep}
            >
              <Text style={styles.primaryButtonText}>
                {step === 3 ? "Submit & Pay" : "Next Step"}
              </Text>
              {step !== 3 && (
                <Feather name="chevron-right" size={18} color="#fff" />
              )}
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc" },
  content: { padding: 24, paddingTop: 60 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  heading: { fontSize: 22, fontWeight: "800", color: "#1e293b" },
  subheading: { fontSize: 13, color: "#64748b", marginTop: 4 },
  badge: {
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText: { fontSize: 10, fontWeight: "800", color: "#64748b" },
  stepContainer: { flexDirection: "row", gap: 8, marginBottom: 32 },
  stepBar: { height: 6, flex: 1, borderRadius: 3 },
  stepBarActive: { backgroundColor: "#10b981" },
  stepBarInactive: { backgroundColor: "#e2e8f0" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 28,
    padding: 24,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 3,
  },
  row: { flexDirection: "row" },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 20 },
  divider: { height: 1, backgroundColor: "#f1f5f9", marginVertical: 20 },
  inputWrapper: { marginBottom: 16 },
  inputLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: "#64748b",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginLeft: 4,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 16,
    height: 56,
    paddingHorizontal: 16,
  },
  inputIcon: { marginRight: 12 },
  textInput: { flex: 1, fontSize: 15, fontWeight: "600", color: "#1e293b" },
  innerSectionTitle: {
    fontSize: 11,
    fontWeight: "800",
    color: "#1e293b",
    textTransform: "uppercase",
    letterSpacing: 1,
    borderLeftWidth: 4,
    borderLeftColor: "#10b981",
    paddingLeft: 10,
    marginBottom: 20,
    marginTop: 10,
  },
  docRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    gap: 10,
    width: "48%",
  },
  docRowSelected: { borderColor: "#10b981", backgroundColor: "#f0fdf4" },
  docText: { fontSize: 12, color: "#475569", fontWeight: "600" },
  docTextSelected: { color: "#065f46" },
  ilpBox: {
    backgroundColor: "#fef2f2",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#fee2e2",
    marginBottom: 24,
  },
  ilpHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
  },
  ilpHeaderText: { fontSize: 10, fontWeight: "800", color: "#b91c1c" },
  buttonRow: { flexDirection: "row", marginTop: 20, gap: 12 },
  backButton: {
    flex: 1,
    height: 56,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: "#f1f5f9",
    gap: 8,
  },
  backButtonText: { color: "#64748b", fontWeight: "700", fontSize: 16 },
  primaryButton: {
    flex: 2,
    height: 56,
    backgroundColor: "#1e293b",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },
  primaryButtonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  formSection: { minHeight: 300 },
});
