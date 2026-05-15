import { ROOT_URL } from "@/url";

import { Feather, Ionicons } from "@expo/vector-icons";

import DateTimePicker from "@react-native-community/datetimepicker";

import axios from "axios";

import * as DocumentPicker from "expo-document-picker";

import { router, useLocalSearchParams } from "expo-router";

import React, { useEffect, useState } from "react";

import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
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

const FormSelect = ({
  label,
  icon,
  selectedValue,
  onValueChange,
  items,
  placeholder,
}: any) => {
  const [modalVisible, setModalVisible] = useState(false);

  const selectedItem = items.find((i: any) => i.value === selectedValue);

  return (
    <View style={styles.fieldWrapper}>
      <Text style={styles.fieldLabel}>{label}</Text>

      <TouchableOpacity
        style={styles.inputRow}
        activeOpacity={0.7}
        onPress={() => setModalVisible(true)}
      >
        <Feather
          name={icon}
          size={18}
          color={THEME.muted}
          style={styles.fieldIcon}
        />

        <Text
          style={[
            styles.textInput,
            {
              lineHeight: 50,
              color: selectedItem ? THEME.text : "#94A3B8",
            },
          ]}
        >
          {selectedItem ? selectedItem.label : placeholder || `Select ${label}`}
        </Text>

        <Feather name="chevron-down" size={18} color={THEME.muted} />
      </TouchableOpacity>

      <Modal transparent visible={modalVisible} animationType="slide">
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.bottomSheet}>
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>{label}</Text>

              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Feather name="x" size={24} color={THEME.text} />
              </TouchableOpacity>
            </View>

            <ScrollView style={{ maxHeight: 300 }}>
              {items.map((item: any) => (
                <TouchableOpacity
                  key={item.value}
                  style={[
                    styles.sheetItem,
                    selectedValue === item.value && styles.sheetItemActive,
                  ]}
                  onPress={() => {
                    onValueChange(item.value);
                    setModalVisible(false);
                  }}
                >
                  <Text
                    style={[
                      styles.sheetItemText,
                      selectedValue === item.value &&
                        styles.sheetItemTextActive,
                    ]}
                  >
                    {item.label}
                  </Text>

                  {selectedValue === item.value && (
                    <Feather name="check" size={18} color={THEME.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

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

const SuccessModal = ({
  visible,
  workerName,
  onDone,
}: {
  visible: boolean;
  workerName: string;
  onDone: () => void;
}) => (
  <Modal
    transparent
    animationType="fade"
    visible={visible}
    onRequestClose={onDone}
  >
    <View style={styles.successModalOverlay}>
      <View style={styles.modalCard}>
        <View style={styles.successRing}>
          <View style={styles.successIconCircle}>
            <Feather name="check" size={36} color="white" />
          </View>
        </View>

        <Text style={styles.modalTitle}>Registration Successful!</Text>
        {workerName ? (
          <Text style={styles.modalWorkerName}>{workerName}</Text>
        ) : null}
        <Text style={styles.modalSubtitle}>
          The worker has been registered successfully and is ready to be
          assigned.
        </Text>

        <TouchableOpacity
          style={styles.modalBtn}
          onPress={onDone}
          activeOpacity={0.85}
        >
          <Feather
            name="arrow-right"
            size={16}
            color="white"
            style={{ marginRight: 6 }}
          />
          <Text style={styles.modalBtnText}>Done</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
);

export default function RegisterWorker() {
  const [kycDocument, setKycDocument] = useState<any>(null);

  const [drivingLicenceDocument, setDrivingLicenceDocument] =
    useState<any>(null);

  const [showSuccess, setShowSuccess] = useState(false);

  const [submittedName, setSubmittedName] = useState("");

  const [loading, setLoading] = useState(false);

  const { token, agent_unique_id } = useLocalSearchParams();

  console.log("Received Token:", token, agent_unique_id);

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
    driver_license_number: "",
    payment_method: "cash",
    transaction_id: "",
  });

  const [states, setStates] = useState([]);

  const [districts, setDistricts] = useState([]);

  const [cities, setCities] = useState([]);

  const [locations, setLocations] = useState([]);

  const [categories, setCategories] = useState([]);

  const [subCategories, setSubCategories] = useState([]);

  const dataGroups = {
    relationOptions: [
      { label: "Father", value: "father" },
      { label: "Mother", value: "mother" },
      { label: "Spouse", value: "spouse" },
      { label: "Other", value: "other" },
    ],

    booleanOptions: [
      { label: "Yes", value: true },
      { label: "No", value: false },
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
        console.log("city",response)
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
        console.log(
          "the categories are",
          JSON.stringify(response.data, null, 2),
        );
      } catch (error) {
        console.log("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleChange = (key: string, value: any) => {
    if (key === "work_category_id") {
      const selectedCategory: any = categories.find(
        (cat: any) => String(cat.id) === String(value),
      );

      const children = selectedCategory?.recursive_children || [];

      setSubCategories(children);
      console.log("Subcategories:", JSON.stringify(children, null, 2));

      setFormData((prev) => ({
        ...prev,
        work_category_id: value,
        work_subcategory_id: "",
      }));

      return;
    }

    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const pickDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: "*/*" });
    if (!result.canceled) setKycDocument(result.assets[0]);
  };

  const pickDrivingLicenceDocument = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: "*/*" });
    if (!result.canceled) setDrivingLicenceDocument(result.assets[0]);
  };

  const handleSubmit = async () => {
    const payload = new FormData();

    (Object.keys(formData) as (keyof typeof formData)[]).forEach((key) => {
      if (key === "is_interstate") {
        payload.append(key, formData[key] === "true" ? "1" : "0");
      } else {
        payload.append(key, formData[key]);
      }
    });

    if (agent_unique_id) {
      payload.append("agent_unique_id", String(agent_unique_id));
    }

    if (kycDocument) {
      payload.append("kyc_document", {
        uri: kycDocument.uri,
        name: kycDocument.name,
        type: kycDocument.mimeType ?? "application/octet-stream",
      } as any);
    }

    if (drivingLicenceDocument) {
      payload.append("driver_license_image", {
        uri: drivingLicenceDocument.uri,
        name: drivingLicenceDocument.name,
        type: drivingLicenceDocument.mimeType ?? "application/octet-stream",
      } as any);
    }

    try {
      setLoading(true);
      console.log("Worker Payload : ", payload);

      const url = token
        ? `${ROOT_URL}/workers`
        : `${ROOT_URL}/workers/register`;

      const response = await axios.post(url, payload, {
        headers: {
          "Content-Type": "multipart/form-data",
          ...(token && {
            Authorization: `Bearer ${token}`,
          }),
        },
      });

      console.log("SUCCESS RESPONSE:", response.data);

      setSubmittedName(formData.full_name || formData.name);
      setShowSuccess(true);
    } catch (error: any) {
      setLoading(false);
      console.log("❌ Worker Registration Failed");

      if (error.response) {
        console.log("📌 Status Code:", error.response.status);
        console.log("📌 Server Response:", error.response.data);
      }
    } finally {
      setLoading(false);
    }
  };

  const selectedCategory: any = categories.find(
    (cat: any) => String(cat.id) === String(formData.work_category_id),
  );

  const selectedSubCategory: any = subCategories.find(
    (sub: any) => String(sub.id) === String(formData.work_subcategory_id),
  );

  const isDrivingCategory =
    selectedCategory?.name?.toLowerCase().includes("driving") ||
    selectedSubCategory?.name?.toLowerCase().includes("driving");

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

            <FormSelect
              label="Payment Method"
              icon="credit-card"
              selectedValue={formData.payment_method}
              onValueChange={(v: string) => handleChange("payment_method", v)}
              items={[{ label: "Cash", value: "cash" }]}
            />

            <FormInput
              label="Transaction ID"
              icon="hash"
              placeholder="Optional"
              value={formData.transaction_id}
              onChangeText={(v: string) => handleChange("transaction_id", v)}
            />

            {/* ── Section 2: Identity & Relations ── */}
            <SectionTitle title="Identity & Relations" />

            {/* ── Relation is now a dropdown ── */}
            <View style={styles.row}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <FormSelect
                  label="Relation"
                  icon="users"
                  selectedValue={formData.guardian_relation}
                  onValueChange={(v: string) =>
                    handleChange("guardian_relation", v)
                  }
                  items={dataGroups.relationOptions}
                />
              </View>
              <View style={{ flex: 1.5 }}>
                <FormInput
                  label="Guardian Name"
                  icon="user-check"
                  placeholder="Guardian Name"
                  value={formData.guardian_name}
                  onChangeText={(v: string) => handleChange("guardian_name", v)}
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
              onChangeText={(v: string) => handleChange("permanent_address", v)}
            />
            <FormInput
              label="Permanent Pincode"
              icon="hash"
              placeholder="781xxx"
              keyboardType="number-pad"
              value={formData.permanent_pincode}
              onChangeText={(v: string) => handleChange("permanent_pincode", v)}
            />

            <SectionTitle title="Location" />

            <View style={styles.row}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <FormSelect
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
                <FormSelect
                  label="District"
                  icon="navigation"
                  selectedValue={formData.district_id}
                  onValueChange={(v: string) => handleChange("district_id", v)}
                  items={districts.map((item: any) => ({
                    label: item.name,
                    value: item.id,
                  }))}
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <FormSelect
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
                <FormSelect
                  label="Location"
                  icon="crosshair"
                  selectedValue={formData.location_id}
                  onValueChange={(v: string) => handleChange("location_id", v)}
                  items={locations.map((item: any) => ({
                    label: item.name,
                    value: item.id,
                  }))}
                />
              </View>
            </View>

            {/* ── Section 5: Work Details ── */}
            <SectionTitle title="Work Details" />

            <FormSelect
              label="Category"
              icon="layers"
              selectedValue={formData.work_category_id}
              onValueChange={(v: string) => handleChange("work_category_id", v)}
              items={categories.map((cat: any) => ({
                label: cat.name,
                value: String(cat.id),
              }))}
            />
            {subCategories.length > 0 && (
              <FormSelect
                label="Sub Category"
                icon="grid"
                selectedValue={formData.work_subcategory_id}
                onValueChange={(v: string) =>
                  handleChange("work_subcategory_id", v)
                }
                items={subCategories.map((sub: any) => ({
                  label: sub.name,
                  value: String(sub.id),
                }))}
              />
            )}

            {/* ── Driving Licence Fields ── */}
            {isDrivingCategory && (
              <>
                <FormInput
                  label="Driving Licence Number"
                  icon="credit-card"
                  placeholder="e.g. AS01 20210012345"
                  value={formData.driver_license_number}
                  onChangeText={(v: string) =>
                    handleChange("driver_license_number", v)
                  }
                />

                <Pressable
                  style={styles.uploadBox}
                  onPress={pickDrivingLicenceDocument}
                >
                  <Ionicons
                    name="card-outline"
                    size={24}
                    color={THEME.primary}
                  />

                  <Text style={styles.uploadText}>
                    {drivingLicenceDocument
                      ? drivingLicenceDocument.name
                      : "Tap to Upload Driving Licence"}
                  </Text>
                </Pressable>
              </>
            )}

            <FormInput
              label="Work Description"
              icon="info"
              placeholder="Describe skills"
              multiline
              value={formData.work_description}
              onChangeText={(v: string) => handleChange("work_description", v)}
            />

            {/* ── Section 6: KYC & ILP ── */}
            <SectionTitle title="KYC & ILP" />

            <FormSelect
              label="KYC Document Type"
              icon="file-text"
              selectedValue={formData.kyc_document_type}
              onValueChange={(v: string) =>
                handleChange("kyc_document_type", v)
              }
              items={dataGroups.kycDocTypes}
            />

            <FormSelect
              label="Interstate?"
              icon="globe"
              selectedValue={formData.is_interstate}
              onValueChange={(v: string) => handleChange("is_interstate", v)}
              items={dataGroups.booleanOptions}
            />

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
                {kycDocument ? kycDocument.name : "Tap to Upload KYC Document"}
              </Text>
            </Pressable>

            <View style={styles.btnContainer}>
              <Pressable
                style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
                onPress={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <ActivityIndicator color="white" />
                    <Text style={styles.submitBtnText}>Submitting...</Text>
                  </>
                ) : (
                  <>
                    <Text style={styles.submitBtnText}>
                      Submit Registration
                    </Text>

                    <Feather name="check-circle" size={18} color="white" />
                  </>
                )}
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <SuccessModal
        visible={showSuccess}
        workerName={submittedName}
        onDone={() => {
          setShowSuccess(false);

          if (token) {
            router.replace("/(tabs)");
          } else {
            router.replace("/(auth)");
          }
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.5)",
    justifyContent: "flex-end",
  },
  successModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  submitBtnDisabled: {
    opacity: 0.7,
  },

  bottomSheet: {
    backgroundColor: "white",
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    paddingBottom: 40,
  },

  sheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  sheetTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: THEME.text,
  },

  sheetItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },

  sheetItemActive: {
    backgroundColor: "#F5F3FF",
    borderRadius: 12,
    paddingHorizontal: 10,
  },

  sheetItemText: {
    fontSize: 16,
    fontWeight: "600",
    color: THEME.text,
  },

  sheetItemTextActive: {
    color: THEME.primary,
    fontWeight: "700",
  },
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
    marginBottom: 20,
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

  modalCard: {
    backgroundColor: "#fff",
    borderRadius: 28,
    padding: 32,
    alignItems: "center",
    width: "82%",
    elevation: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
  },
  successRing: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: "#D1FAE5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  successIconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: THEME.accent,
    justifyContent: "center",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: THEME.text,
    marginBottom: 6,
    textAlign: "center",
  },
  modalWorkerName: {
    fontSize: 15,
    fontWeight: "700",
    color: THEME.primary,
    marginBottom: 10,
    textAlign: "center",
  },
  modalSubtitle: {
    fontSize: 13,
    color: THEME.muted,
    textAlign: "center",
    marginBottom: 28,
    lineHeight: 20,
  },
  modalBtn: {
    backgroundColor: THEME.primary,
    paddingVertical: 14,
    paddingHorizontal: 48,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
  },
  modalBtnText: {
    color: "white",
    fontWeight: "700",
    fontSize: 15,
  },
});
