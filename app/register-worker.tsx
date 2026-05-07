import { ROOT_URL } from "@/url";

import { Feather, Ionicons } from "@expo/vector-icons";

import DateTimePicker from "@react-native-community/datetimepicker";

import { Picker } from "@react-native-picker/picker";

import axios from "axios";

import * as DocumentPicker from "expo-document-picker";

import React, { useEffect, useState } from "react";

import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const THEME = {
  primary: "#4F46E5",
  accent: "#10B981",
  bg: "#F8FAFC",
  card: "#FFFFFF",
  text: "#1E293B",
  muted: "#64748B",
  border: "#E2E8F0",
};

const FormInput = ({ label, icon, ...props }: any) => (
  <View style={styles.fieldWrapper}>
    <Text style={styles.fieldLabel}>{label}</Text>
    <View style={styles.inputRow}>
      <Feather
        name={icon}
        size={18}
        color={THEME.muted}
        style={styles.fieldIcon}
      />
      <TextInput
        style={styles.textInput}
        placeholderTextColor="#94A3B8"
        selectionColor={THEME.primary}
        {...props}
      />
    </View>
  </View>
);

const FormPicker = ({
  label,
  icon,
  selectedValue,
  onValueChange,
  items,
}: any) => (
  <View style={styles.fieldWrapper}>
    <Text style={styles.fieldLabel}>{label}</Text>
    <View style={styles.pickerRow}>
      <Feather
        name={icon}
        size={18}
        color={THEME.muted}
        style={styles.fieldIcon}
      />
      <Picker
        selectedValue={selectedValue}
        onValueChange={onValueChange}
        style={styles.pickerElement}
        dropdownIconColor={THEME.primary}
      >
        <Picker.Item label={`Select ${label}`} value="" color={THEME.muted} />
        {items.map((item: any) => (
          <Picker.Item key={item.value} label={item.label} value={item.value} />
        ))}
      </Picker>
    </View>
  </View>
);

const FormDatePicker = ({ label, icon, value, onDateChange }: any) => {
  const [show, setShow] = useState(false);

  const displayDate = value
    ? new Date(value).toLocaleDateString()
    : "Select Date";

  return (
    <View style={styles.fieldWrapper}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <Pressable style={styles.inputRow} onPress={() => setShow(true)}>
        <Feather
          name={icon}
          size={18}
          color={THEME.muted}
          style={styles.fieldIcon}
        />
        <Text
          style={[
            styles.textInput,
            { lineHeight: 50, color: value ? THEME.text : "#94A3B8" },
          ]}
        >
          {displayDate}
        </Text>
        <Feather name="calendar" size={16} color={THEME.primary} />
      </Pressable>
      {show && (
        <DateTimePicker
          value={value ? new Date(value) : new Date()}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={(event, selectedDate) => {
            setShow(false);
            if (selectedDate) onDateChange(selectedDate.toISOString());
          }}
        />
      )}
    </View>
  );
};

const SectionTitle = ({ title }: { title: string }) => (
  <Text style={styles.sectionTitle}>{title}</Text>
);

const SubSectionTitle = ({ title }: { title: string }) => (
  <Text style={styles.subSectionTitle}>{title}</Text>
);

export default function RegisterWorker() {
  const [kycDocument, setKycDocument] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_number: "",
    password: "",
    full_name: "",
    guardian_relation: "",
    guardian_name: "",
    alternative_number: "",
    registration_date: new Date().toISOString(),
    present_address: "",
    present_pincode: "",
    permanent_address: "",
    permanent_pincode: "",
    state_id: "",
    district_id: "",
    city_id: "",
    location_id: "",
    work_category_id: "",
    work_subcategory_id: "",
    work_description: "",
    kyc_document_type: "",
    is_interstate: "",
    ilp_issue_date: "",
    ilp_expiry_date: "",
    agent_unique_id: "",
  });

  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [cities, setCities] = useState([]);
  const [locations, setLocations] = useState([]);
  const [categories, setCategories] = useState([]);

  const dataGroups = {
    workSubCats: [
      { label: "Plumber", value: "11" },
      { label: "Electrician", value: "12" },
    ],
    booleanOptions: [
      { label: "Yes", value: "true" },
      { label: "No", value: "false" },
    ],
    kycDocTypes: [
      { label: "Aadhaar Card", value: "aadhaar" },
      { label: "PAN Card", value: "pan" },
      { label: "Voter ID", value: "voter_id" },
      { label: "Passport", value: "passport" },
      { label: "Driving License", value: "driving_license" },
    ],
  };

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await axios.get(`${ROOT_URL}/location/states`);
        setStates(response.data);
      } catch (error) {
        console.log("Error fetching states:", error);
      }
    };
    fetchStates();
  }, []);

  useEffect(() => {
    const fetchDistricts = async () => {
      try {
        const response = await axios.get(`${ROOT_URL}/location/districts`);
        setDistricts(response.data);
      } catch (error) {
        console.log("Error fetching districts:", error);
      }
    };
    fetchDistricts();
  }, []);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axios.get(`${ROOT_URL}/location/cities`);
        setCities(response.data);
      } catch (error) {
        console.log("Error fetching cities:", error);
      }
    };
    fetchCities();
  }, []);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axios.get(`${ROOT_URL}/location/locations`);
        setLocations(response.data);
      } catch (error) {
        console.log("Error fetching locations:", error);
      }
    };
    fetchLocations();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${ROOT_URL}/categories`);
        setCategories(response.data);
      } catch (error) {
        console.log("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (key: string, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const pickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: "*/*" });
    if (!result.canceled) setKycDocument(result.assets[0]);
  };

  const handleSubmit = async () => {
    const payload = new FormData();

    (Object.keys(formData) as (keyof typeof formData)[]).forEach((key) => {
      payload.append(key, formData[key]);
    });

    if (kycDocument) {
      payload.append("kyc_document", {
        uri: kycDocument.uri,
        name: kycDocument.name,
        type: kycDocument.mimeType ?? "application/octet-stream",
      } as any);
    }

    console.log("===== REGISTRATION PAYLOAD =====");
    console.log("Text Fields:", JSON.stringify(formData, null, 2));
    console.log(
      "KYC Document:",
      kycDocument
        ? { name: kycDocument.name, uri: kycDocument.uri, type: kycDocument.mimeType }
        : "None",
    );
    console.log("================================");

    try {
      const response = await axios.post(
        `${ROOT_URL}/workers/register`,
        payload,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      console.log("the response is", response.data);
    } catch (error: any) {
      console.log("❌ Worker Registration Failed");

      if (error.response) {
        console.log("📌 Status Code:", error.response.status);
        console.log("📌 Server Response:", error.response.data);

        const errors = error.response.data?.errors;
        if (errors) {
          const errorMessages = Object.values(errors).flat().join("\n");
          Alert.alert("Registration Failed", errorMessages);
        } else {
          Alert.alert(
            "Error",
            error.response.data?.message || "Something went wrong",
          );
        }
      } else if (error.request) {
        Alert.alert("Network Error", "No response received from server");
      } else {
        Alert.alert("Error", error.message);
      }

      console.log("📌 Full Error Object:", error);
    }
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollArea}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.brandTitle}>Fixzo Workforce</Text>
            <Text style={styles.headerSubtitle}>Worker Registration</Text>
          </View>

          <View style={styles.mainCard}>

            {/* ── Section 1: Account Credentials ── */}
            <SectionTitle title="Account Credentials" />

            <FormInput
              label="Username"
              icon="user"
              placeholder="Choose a username"
              value={formData.name}
              onChangeText={(v: string) => handleChange("name", v)}
            />
            <FormInput
              label="Email Address"
              icon="mail"
              placeholder="worker@example.com"
              keyboardType="email-address"
              value={formData.email}
              onChangeText={(v: string) => handleChange("email", v)}
            />
            <FormInput
              label="Mobile Number"
              icon="smartphone"
              placeholder="10-digit number"
              keyboardType="phone-pad"
              value={formData.phone_number}
              onChangeText={(v: string) => handleChange("phone_number", v)}
            />
            <FormInput
              label="Set Password"
              icon="lock"
              placeholder="••••••••"
              secureTextEntry
              value={formData.password}
              onChangeText={(v: string) => handleChange("password", v)}
            />
            <FormInput
              label="Full Name"
              icon="edit-2"
              placeholder="Legal name"
              value={formData.full_name}
              onChangeText={(v: string) => handleChange("full_name", v)}
            />
            <FormDatePicker
              label="Registration Date"
              icon="calendar"
              value={formData.registration_date}
              onDateChange={(date: string) =>
                handleChange("registration_date", date)
              }
            />

            {/* ── Section 2: Identity & Relations ── */}
            <SectionTitle title="Identity & Relations" />

            <View style={styles.row}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <FormInput
                  label="Relation"
                  icon="users"
                  placeholder="Father/Spouse"
                  value={formData.guardian_relation}
                  onChangeText={(v: string) =>
                    handleChange("guardian_relation", v)
                  }
                />
              </View>
              <View style={{ flex: 1.5 }}>
                <FormInput
                  label="Guardian Name"
                  icon="user-check"
                  placeholder="Guardian Name"
                  value={formData.guardian_name}
                  onChangeText={(v: string) =>
                    handleChange("guardian_name", v)
                  }
                />
              </View>
            </View>

            <FormInput
              label="Alternative Contact"
              icon="phone-call"
              placeholder="Optional number"
              keyboardType="phone-pad"
              value={formData.alternative_number}
              onChangeText={(v: string) =>
                handleChange("alternative_number", v)
              }
            />

            {/* ── Section 3: Address Details ── */}
            <SubSectionTitle title="Address Details" />

            <FormInput
              label="Present Address"
              icon="map-pin"
              placeholder="Current address"
              multiline
              value={formData.present_address}
              onChangeText={(v: string) => handleChange("present_address", v)}
            />
            <FormInput
              label="Present Pincode"
              icon="hash"
              placeholder="781xxx"
              keyboardType="number-pad"
              value={formData.present_pincode}
              onChangeText={(v: string) => handleChange("present_pincode", v)}
            />
            <FormInput
              label="Permanent Address"
              icon="home"
              placeholder="Home address"
              multiline
              value={formData.permanent_address}
              onChangeText={(v: string) =>
                handleChange("permanent_address", v)
              }
            />
            <FormInput
              label="Permanent Pincode"
              icon="hash"
              placeholder="781xxx"
              keyboardType="number-pad"
              value={formData.permanent_pincode}
              onChangeText={(v: string) =>
                handleChange("permanent_pincode", v)
              }
            />

        
            <SectionTitle title="Location" />

            <View style={styles.row}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <FormPicker
                  label="State"
                  icon="map"
                  selectedValue={formData.state_id}
                  onValueChange={(v: string) => handleChange("state_id", v)}
                  items={states.map((item: any) => ({
                    label: item.name,
                    value: item.id,
                  }))}
                />
              </View>
              <View style={{ flex: 1 }}>
                <FormPicker
                  label="District"
                  icon="navigation"
                  selectedValue={formData.district_id}
                  onValueChange={(v: string) =>
                    handleChange("district_id", v)
                  }
                  items={districts.map((item: any) => ({
                    label: item.name,
                    value: item.id,
                  }))}
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <FormPicker
                  label="City"
                  icon="map-pin"
                  selectedValue={formData.city_id}
                  onValueChange={(v: string) => handleChange("city_id", v)}
                  items={cities.map((item: any) => ({
                    label: item.name,
                    value: item.id,
                  }))}
                />
              </View>
              <View style={{ flex: 1 }}>
                <FormPicker
                  label="Location"
                  icon="crosshair"
                  selectedValue={formData.location_id}
                  onValueChange={(v: string) =>
                    handleChange("location_id", v)
                  }
                  items={locations.map((item: any) => ({
                    label: item.name,
                    value: item.id,
                  }))}
                />
              </View>
            </View>

            {/* ── Section 5: Work Details ── */}
            <SectionTitle title="Work Details" />

            <FormPicker
              label="Category"
              icon="layers"
              selectedValue={formData.work_category_id}
              onValueChange={(v: string) =>
                handleChange("work_category_id", v)
              }
              items={categories.map((cat: any) => ({
                label: cat.name,
                value: cat.id,
              }))}
            />
            <FormPicker
              label="Sub Category"
              icon="grid"
              selectedValue={formData.work_subcategory_id}
              onValueChange={(v: string) =>
                handleChange("work_subcategory_id", v)
              }
              items={dataGroups.workSubCats}
            />
            <FormInput
              label="Work Description"
              icon="info"
              placeholder="Describe skills"
              multiline
              value={formData.work_description}
              onChangeText={(v: string) =>
                handleChange("work_description", v)
              }
            />

            {/* ── Section 6: KYC & ILP ── */}
            <SectionTitle title="KYC & ILP" />

            <FormPicker
              label="KYC Document Type"
              icon="file-text"
              selectedValue={formData.kyc_document_type}
              onValueChange={(v: string) =>
                handleChange("kyc_document_type", v)
              }
              items={dataGroups.kycDocTypes}
            />

            <View style={styles.row}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <FormPicker
                  label="Interstate?"
                  icon="globe"
                  selectedValue={formData.is_interstate}
                  onValueChange={(v: string) =>
                    handleChange("is_interstate", v)
                  }
                  items={dataGroups.booleanOptions}
                />
              </View>
              <View style={{ flex: 1 }}>
                <FormInput
                  label="Agent ID"
                  icon="tag"
                  placeholder="ID Number"
                  value={formData.agent_unique_id}
                  onChangeText={(v: string) =>
                    handleChange("agent_unique_id", v)
                  }
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <FormDatePicker
                  label="ILP Issue Date"
                  icon="calendar"
                  value={formData.ilp_issue_date}
                  onDateChange={(date: string) =>
                    handleChange("ilp_issue_date", date)
                  }
                />
              </View>
              <View style={{ flex: 1 }}>
                <FormDatePicker
                  label="ILP Expiry Date"
                  icon="shield"
                  value={formData.ilp_expiry_date}
                  onDateChange={(date: string) =>
                    handleChange("ilp_expiry_date", date)
                  }
                />
              </View>
            </View>

            <Pressable style={styles.uploadBox} onPress={pickDocument}>
              <Ionicons name="cloud-upload" size={24} color={THEME.primary} />
              <Text style={styles.uploadText}>
                {kycDocument
                  ? kycDocument.name
                  : "Tap to Upload KYC Document"}
              </Text>
            </Pressable>

            {/* ── Submit Button ── */}
            <View style={styles.btnContainer}>
              <Pressable style={styles.submitBtn} onPress={handleSubmit}>
                <Text style={styles.submitBtnText}>Submit Registration</Text>
                <Feather name="check-circle" size={18} color="white" />
              </Pressable>
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: { flex: 1, backgroundColor: THEME.bg },
  scrollArea: { paddingBottom: 60 },
  header: { padding: 24, paddingTop: 40, backgroundColor: THEME.card },
  brandTitle: {
    fontSize: 28,
    fontWeight: "900",
    color: THEME.primary,
    letterSpacing: -1,
  },
  headerSubtitle: {
    fontSize: 14,
    color: THEME.muted,
    fontWeight: "600",
    marginTop: 4,
    textTransform: "uppercase",
  },
  mainCard: {
    margin: 16,
    backgroundColor: THEME.card,
    borderRadius: 24,
    padding: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: THEME.text,
    marginTop: 24,
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: THEME.border,
  },
  subSectionTitle: {
    fontSize: 12,
    fontWeight: "800",
    color: THEME.primary,
    marginTop: 10,
    marginBottom: 15,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  fieldWrapper: { marginBottom: 20 },
  fieldLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: THEME.muted,
    textTransform: "uppercase",
    marginBottom: 8,
    marginLeft: 4,
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: THEME.bg,
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: THEME.border,
  },
  fieldIcon: { marginRight: 10 },
  textInput: {
    flex: 1,
    height: 50,
    fontSize: 15,
    fontWeight: "600",
    color: THEME.text,
  },
  pickerRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: THEME.bg,
    borderRadius: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: THEME.border,
    overflow: "hidden",
  },
  pickerElement: { flex: 1, height: 50, color: THEME.text, marginLeft: -8 },
  row: { flexDirection: "row", justifyContent: "space-between" },
  uploadBox: {
    borderStyle: "dashed",
    borderWidth: 2,
    borderColor: THEME.primary,
    borderRadius: 16,
    padding: 25,
    alignItems: "center",
    backgroundColor: "#EEF2FF",
    marginTop: 10,
  },
  uploadText: {
    color: THEME.primary,
    fontWeight: "700",
    marginTop: 8,
    fontSize: 13,
  },
  btnContainer: { marginTop: 28 },
  submitBtn: {
    height: 58,
    backgroundColor: THEME.primary,
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  submitBtnText: { color: "white", fontSize: 16, fontWeight: "700" },
});