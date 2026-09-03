import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../services/api";

import { Card, CardBody } from "../../components/Card";
import { Button } from "../../components/Button";
import { Badge } from "../../components/Badge";

import {
  User,
  Phone,
  Mail,
  HeartPulse,
  CalendarDays,
  Video,
  ClipboardList,
  Activity,
  MapPin,
  Loader2,
  AlertCircle,
  RefreshCw,
  ChevronRight,
  ShieldCheck,
  Stethoscope,
} from "lucide-react";

export const PatientDashboard = () => {
  const navigate = useNavigate();

  // ==========================================
  // STATE
  // ==========================================

  const [patientProfile, setPatientProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ==========================================
  // GET LOGGED IN USER FROM LOCAL STORAGE
  // ==========================================

  const getStoredUser = () => {
    try {
      const storedUser = localStorage.getItem("user");

      if (!storedUser) {
        return null;
      }

      return JSON.parse(storedUser);
    } catch (error) {
      console.error("Error reading stored user:", error);
      return null;
    }
  };

  const storedUser = getStoredUser();

  // ==========================================
  // GET PATIENT PROFILE
  // ==========================================

  const getPatientProfile = async () => {
    try {
      setLoading(true);
      setError("");

      // Get JWT token
      const token =
        localStorage.getItem("token") ||
        localStorage.getItem("accessToken") ||
        localStorage.getItem("authToken");

      console.log("====================================");
      console.log("FETCHING PATIENT PROFILE");
      console.log("TOKEN EXISTS:", !!token);
      console.log("====================================");

      // If no token
      if (!token) {
        throw new Error(
          "Authentication token not found. Please login again."
        );
      }

      // ==========================================
      // GET PATIENT PROFILE API
      // ==========================================

      const response = await api.get("/patients/profile");

      console.log(
        "PATIENT PROFILE RESPONSE:",
        response.data
      );

      if (!response.data?.success) {
        throw new Error(
          response.data?.message ||
          "Failed to fetch patient profile"
        );
      }

      const patientData = response.data?.data;

      if (!patientData) {
        throw new Error("Patient profile not found");
      }

      // ==========================================
      // SAVE PROFILE IN STATE
      // ==========================================

      setPatientProfile(patientData);

      // ==========================================
      // UPDATE LOCAL STORAGE USER
      // ==========================================

      if (patientData?.user) {
        localStorage.setItem(
          "user",
          JSON.stringify(patientData.user)
        );
      }

      console.log("PATIENT PROFILE LOADED");
      console.log(
        "PATIENT NAME:",
        patientData?.user?.fullName
      );

    } catch (err) {
      console.error(
        "GET PATIENT PROFILE ERROR:",
        err
      );

      console.error(
        "API ERROR RESPONSE:",
        err?.response?.data
      );

      const errorMessage =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Unable to load patient profile";

      setError(errorMessage);

    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // LOAD PROFILE
  // ==========================================

  useEffect(() => {
    getPatientProfile();
  }, []);

  // ==========================================
  // USER DATA
  // ==========================================

  /*
    Backend response expected:

    {
      success: true,
      data: {
        _id: "...",
        user: {
          fullName: "User Name",
          phone: "...",
          email: "...",
          role: "patient"
        }
      }
    }
  */

  const patientName =
    patientProfile?.user?.fullName ||
    patientProfile?.user?.name ||
    storedUser?.fullName ||
    storedUser?.name ||
    "Patient";

  const patientPhone =
    patientProfile?.user?.phone ||
    patientProfile?.phone ||
    storedUser?.phone ||
    "Not Available";

  const patientEmail =
    patientProfile?.user?.email ||
    patientProfile?.email ||
    storedUser?.email ||
    "Not Available";

  const patientRole =
    patientProfile?.user?.role ||
    storedUser?.role ||
    "patient";

  const abhaId =
    patientProfile?.abhaId ||
    patientProfile?.abhaNumber ||
    patientProfile?.abha_id ||
    storedUser?.abhaId ||
    "Not Available";

  const patientId =
    patientProfile?._id ||
    storedUser?._id ||
    "Not Available";

  const userInitial =
    patientName?.charAt(0)?.toUpperCase() ||
    "P";

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">

          <Loader2 className="h-10 w-10 animate-spin text-emerald-600" />

          <div className="text-center">

            <h2 className="font-bold text-lg text-slate-800 dark:text-white">
              Loading Dashboard
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Fetching your profile...
            </p>

          </div>

        </div>
      </div>
    );
  }

  // ==========================================
  // ERROR SCREEN
  // ==========================================

  if (error && !storedUser) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">

        <Card className="max-w-md w-full border border-red-200">

          <CardBody className="p-6 text-center space-y-4">

            <div className="h-14 w-14 mx-auto rounded-full bg-red-50 flex items-center justify-center">

              <AlertCircle className="h-7 w-7 text-red-500" />

            </div>

            <div>

              <h2 className="font-bold text-lg text-slate-900 dark:text-white">
                Unable to Load Dashboard
              </h2>

              <p className="text-sm text-red-500 mt-2">
                {error}
              </p>

            </div>

            <Button
              variant="primary"
              onClick={getPatientProfile}
              leftIcon={
                <RefreshCw className="h-4 w-4" />
              }
            >
              Retry
            </Button>

          </CardBody>

        </Card>

      </div>
    );
  }

  // ==========================================
  // DASHBOARD
  // ==========================================

  return (
    <div className="space-y-6 pb-10">

      {/* ====================================== */}
      {/* WELCOME HEADER */}
      {/* ====================================== */}

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">

        <div>

          <div className="flex items-center gap-2 mb-2">

            <Badge color="success">

              <ShieldCheck className="h-3.5 w-3.5 mr-1" />

              Verified Patient

            </Badge>

          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">

            Welcome back,{" "}

            <span className="text-emerald-600">
              {patientName}
            </span>

            👋

          </h1>

          <p className="text-sm text-slate-500 mt-2">

            Manage your health records, appointments and consultations
            from one place.

          </p>

          {error && (
            <p className="text-xs text-amber-600 mt-2">
              Profile API could not load. Showing saved login user data.
            </p>
          )}

        </div>

        <Button
          variant="primary"
          size="lg"
          onClick={() =>
            navigate("/patient/teleconsult")
          }
          leftIcon={
            <Video className="h-5 w-5" />
          }
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          Start Teleconsultation
        </Button>

      </div>


      {/* ====================================== */}
      {/* PROFILE CARD */}
      {/* ====================================== */}

      <Card className="overflow-hidden border border-emerald-100 dark:border-emerald-900">

        <div className="h-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500" />

        <CardBody className="p-5 sm:p-6">

          <div className="flex flex-col sm:flex-row sm:items-center gap-5">

            {/* AVATAR */}

            <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">

              {userInitial}

            </div>


            {/* PROFILE DETAILS */}

            <div className="flex-1">

              <p className="text-xs text-slate-500 uppercase tracking-wide">
                Logged in Patient
              </p>

              <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">

                {patientName}

              </h2>

              <div className="flex flex-wrap gap-4 mt-3">

                <div className="flex items-center gap-2 text-sm text-slate-500">

                  <Phone className="h-4 w-4 text-emerald-600" />

                  <span>
                    {patientPhone}
                  </span>

                </div>


                <div className="flex items-center gap-2 text-sm text-slate-500">

                  <Mail className="h-4 w-4 text-emerald-600" />

                  <span>
                    {patientEmail}
                  </span>

                </div>

              </div>

            </div>


            <Badge color="success">

              <User className="h-3.5 w-3.5 mr-1" />

              {patientRole}

            </Badge>

          </div>

        </CardBody>

      </Card>


      {/* ====================================== */}
      {/* SUMMARY CARDS */}
      {/* ====================================== */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">


        {/* ABHA */}

        <Card>

          <CardBody className="p-5">

            <div className="h-11 w-11 rounded-xl bg-emerald-50 flex items-center justify-center">

              <HeartPulse className="h-5 w-5 text-emerald-600" />

            </div>

            <p className="text-xs text-slate-500 mt-4">
              ABHA Health ID
            </p>

            <p className="font-bold text-sm text-slate-900 dark:text-white mt-1 truncate">

              {abhaId}

            </p>

          </CardBody>

        </Card>


        {/* APPOINTMENTS */}

        <Card>

          <CardBody className="p-5">

            <div className="h-11 w-11 rounded-xl bg-blue-50 flex items-center justify-center">

              <CalendarDays className="h-5 w-5 text-blue-600" />

            </div>

            <p className="text-xs text-slate-500 mt-4">
              Upcoming Appointments
            </p>

            <p className="font-bold text-2xl text-slate-900 dark:text-white mt-1">
              0
            </p>

            <p className="text-xs text-slate-400">
              No upcoming appointments
            </p>

          </CardBody>

        </Card>


        {/* TELECONSULT */}

        <Card>

          <CardBody className="p-5">

            <div className="h-11 w-11 rounded-xl bg-purple-50 flex items-center justify-center">

              <Video className="h-5 w-5 text-purple-600" />

            </div>

            <p className="text-xs text-slate-500 mt-4">
              Teleconsultation
            </p>

            <p className="font-bold text-2xl text-slate-900 dark:text-white mt-1">
              Ready
            </p>

            <p className="text-xs text-emerald-600">
              Doctors available
            </p>

          </CardBody>

        </Card>


        {/* PROFILE */}

        <Card>

          <CardBody className="p-5">

            <div className="h-11 w-11 rounded-xl bg-orange-50 flex items-center justify-center">

              <ClipboardList className="h-5 w-5 text-orange-600" />

            </div>

            <p className="text-xs text-slate-500 mt-4">
              Patient Profile
            </p>

            <p className="font-bold text-sm text-slate-900 dark:text-white mt-1">
              Active
            </p>

            <p className="text-xs text-slate-400 truncate">
              ID: {patientId}
            </p>

          </CardBody>

        </Card>

      </div>


      {/* ====================================== */}
      {/* QUICK ACTIONS */}
      {/* ====================================== */}

      <Card>

        <CardBody className="p-6">

          <div className="mb-5">

            <h2 className="font-bold text-lg text-slate-900 dark:text-white">
              Quick Actions
            </h2>

            <p className="text-xs text-slate-500 mt-1">
              Access healthcare services quickly.
            </p>

          </div>


          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">


            {/* BOOK APPOINTMENT */}

            <button
              type="button"
              onClick={() =>
                navigate("/patient/appointments")
              }
              className="group text-left border border-slate-200 dark:border-slate-800 rounded-xl p-4 hover:border-emerald-400 hover:shadow-md transition-all"
            >

              <div className="flex items-center justify-between">

                <div className="h-11 w-11 rounded-xl bg-emerald-50 flex items-center justify-center">

                  <CalendarDays className="h-5 w-5 text-emerald-600" />

                </div>

                <ChevronRight className="h-5 w-5 text-slate-400" />

              </div>

              <h3 className="font-bold text-sm mt-4">
                Book Appointment
              </h3>

              <p className="text-xs text-slate-500 mt-1">
                Find doctors and book appointments.
              </p>

            </button>


            {/* VIDEO CONSULTATION */}

            <button
              type="button"
              onClick={() =>
                navigate("/patient/teleconsult")
              }
              className="group text-left border border-slate-200 dark:border-slate-800 rounded-xl p-4 hover:border-purple-400 hover:shadow-md transition-all"
            >

              <div className="flex items-center justify-between">

                <div className="h-11 w-11 rounded-xl bg-purple-50 flex items-center justify-center">

                  <Video className="h-5 w-5 text-purple-600" />

                </div>

                <ChevronRight className="h-5 w-5 text-slate-400" />

              </div>

              <h3 className="font-bold text-sm mt-4">
                Video Consultation
              </h3>

              <p className="text-xs text-slate-500 mt-1">
                Connect with doctors online.
              </p>

            </button>


            {/* HEALTH RECORDS */}

            <button
              type="button"
              onClick={() =>
                navigate("/patient/records")
              }
              className="group text-left border border-slate-200 dark:border-slate-800 rounded-xl p-4 hover:border-blue-400 hover:shadow-md transition-all"
            >

              <div className="flex items-center justify-between">

                <div className="h-11 w-11 rounded-xl bg-blue-50 flex items-center justify-center">

                  <ClipboardList className="h-5 w-5 text-blue-600" />

                </div>

                <ChevronRight className="h-5 w-5 text-slate-400" />

              </div>

              <h3 className="font-bold text-sm mt-4">
                Health Records
              </h3>

              <p className="text-xs text-slate-500 mt-1">
                View your medical records.
              </p>

            </button>


            {/* FIND HEALTHCARE */}

            <button
              type="button"
              onClick={() =>
                navigate("/patient/facilities")
              }
              className="group text-left border border-slate-200 dark:border-slate-800 rounded-xl p-4 hover:border-orange-400 hover:shadow-md transition-all"
            >

              <div className="flex items-center justify-between">

                <div className="h-11 w-11 rounded-xl bg-orange-50 flex items-center justify-center">

                  <MapPin className="h-5 w-5 text-orange-600" />

                </div>

                <ChevronRight className="h-5 w-5 text-slate-400" />

              </div>

              <h3 className="font-bold text-sm mt-4">
                Find Healthcare
              </h3>

              <p className="text-xs text-slate-500 mt-1">
                Find nearby hospitals and doctors.
              </p>

            </button>

          </div>

        </CardBody>

      </Card>


      {/* ====================================== */}
      {/* HEALTH OVERVIEW */}
      {/* ====================================== */}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <Card className="lg:col-span-2">

          <CardBody className="p-6">

            <div className="flex items-center gap-3 mb-5">

              <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center">

                <Activity className="h-5 w-5 text-emerald-600" />

              </div>

              <div>

                <h2 className="font-bold text-lg">
                  Health Overview
                </h2>

                <p className="text-xs text-slate-500">
                  Your healthcare summary
                </p>

              </div>

            </div>


            <div className="p-6 rounded-xl border border-dashed border-slate-200 text-center">

              <HeartPulse className="h-10 w-10 mx-auto text-emerald-500 mb-3" />

              <h3 className="font-semibold">
                Your health records will appear here
              </h3>

              <p className="text-sm text-slate-500 mt-2">

                Book appointments and consultations to build your health history.

              </p>

            </div>

          </CardBody>

        </Card>


        {/* PROFILE DETAILS */}

        <Card>

          <CardBody className="p-6">

            <div className="flex items-center gap-2 mb-5">

              <User className="h-5 w-5 text-emerald-600" />

              <div>

                <h2 className="font-bold text-base">
                  Patient Profile
                </h2>

                <p className="text-xs text-slate-500">
                  Logged in user information
                </p>

              </div>

            </div>


            <div className="space-y-4">


              {/* NAME */}

              <div>

                <p className="text-[11px] text-slate-400 uppercase">
                  Full Name
                </p>

                <p className="text-sm font-semibold">

                  {patientName}

                </p>

              </div>


              {/* PHONE */}

              <div>

                <p className="text-[11px] text-slate-400 uppercase">
                  Phone Number
                </p>

                <p className="text-sm font-semibold">

                  {patientPhone}

                </p>

              </div>


              {/* EMAIL */}

              <div>

                <p className="text-[11px] text-slate-400 uppercase">
                  Email Address
                </p>

                <p className="text-sm font-semibold break-all">

                  {patientEmail}

                </p>

              </div>


              {/* ABHA */}

              <div>

                <p className="text-[11px] text-slate-400 uppercase">
                  ABHA ID
                </p>

                <p className="text-sm font-semibold">

                  {abhaId}

                </p>

              </div>

            </div>

          </CardBody>

        </Card>

      </div>


      {/* ====================================== */}
      {/* HEALTH MESSAGE */}
      {/* ====================================== */}

      <Card className="bg-gradient-to-r from-emerald-600 to-teal-600 border-none text-white">

        <CardBody className="p-6">

          <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between">

            <div className="flex items-start gap-4">

              <div className="h-12 w-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0">

                <Stethoscope className="h-6 w-6" />

              </div>

              <div>

                <h3 className="font-bold text-lg">
                  Your Health Matters, {patientName}
                </h3>

                <p className="text-sm text-emerald-50 mt-1">

                  Keep your health profile updated for better healthcare services.

                </p>

              </div>

            </div>


            <Button
              variant="outline"
              onClick={() =>
                navigate("/patient/profile")
              }
              className="bg-white text-emerald-700 hover:bg-emerald-50 border-white"
            >
              Update Profile
            </Button>

          </div>

        </CardBody>

      </Card>

    </div>
  );
};

export default PatientDashboard;