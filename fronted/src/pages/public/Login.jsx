import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

import { Card, CardBody } from "../../components/Card";
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { Alert } from "../../components/Alert";

import {
    Key,
    User,
    KeyRound,
    Phone,
    RefreshCw,
    ArrowLeft,
} from "lucide-react";

export const Login = () => {
    const navigate = useNavigate();

    // ==========================================
    // AUTH CONTEXT
    // ==========================================

    const { login } = useAuth();

    // ==========================================
    // STATES
    // ==========================================

    const [step, setStep] = useState("login");

    const [selectedRole, setSelectedRole] =
        useState("patient");

    const [credential, setCredential] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [otp, setOtp] =
        useState("");

    const [pendingPhone, setPendingPhone] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [sendingOtp, setSendingOtp] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");

    // ==========================================
    // ROLE DETAILS
    // ==========================================

    const roleDetails = {
        patient: {
            label: "Patient",
            icon: "👤",
        },

        doctor: {
            label: "Doctor",
            icon: "👨‍⚕️",
        },

        hospital: {
            label: "Hospital",
            icon: "🏥",
        },

        admin: {
            label: "Admin",
            icon: "👨‍💼",
        },
    };

    // ==========================================
    // VALIDATE EMAIL
    // ==========================================

    const isValidEmail = (value) => {
        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        return emailRegex.test(
            value.trim()
        );
    };

    // ==========================================
    // VALIDATE PHONE
    // ==========================================

    const isPhoneNumber = (value) => {
        if (!value) return false;

        const cleaned = value
            .trim()
            .replace(/[\s()-]/g, "");

        return /^\+?\d{10,15}$/.test(
            cleaned
        );
    };

    // ==========================================
    // NORMALIZE PHONE
    // ==========================================

    const normalizePhone = (phone) => {
        if (!phone) return "";

        let cleaned = phone
            .trim()
            .replace(/[\s()-]/g, "");

        // Indian number: 9876543210
        // Convert to +919876543210

        if (
            !cleaned.startsWith("+") &&
            /^[6-9]\d{9}$/.test(cleaned)
        ) {
            cleaned = `+91${cleaned}`;
        }

        return cleaned;
    };

    // ==========================================
    // GET ERROR MESSAGE
    // ==========================================

    const getErrorMessage = (err) => {
        console.error("FULL ERROR:", err);

        return (
            err?.response?.data?.message ||
            err?.response?.data?.error ||
            err?.message ||
            "Something went wrong. Please try again."
        );
    };

    // ==========================================
    // EXTRACT LOGIN RESPONSE
    // ==========================================

    const extractLoginData = (responseData) => {
        console.log(
            "RAW LOGIN RESPONSE:",
            responseData
        );

        // Handle different backend response structures

        const root =
            responseData?.data ||
            responseData;

        const user =
            root?.user ||
            responseData?.user ||
            root?.data?.user ||
            null;

        const accessToken =
            root?.accessToken ||
            root?.token ||
            root?.tokens?.accessToken ||
            responseData?.accessToken ||
            responseData?.token ||
            responseData?.tokens?.accessToken ||
            null;

        const refreshToken =
            root?.refreshToken ||
            root?.tokens?.refreshToken ||
            responseData?.refreshToken ||
            responseData?.tokens?.refreshToken ||
            null;

        return {
            user,
            accessToken,
            refreshToken,
        };
    };

    // ==========================================
    // SAVE LOGIN DATA
    // ==========================================

    const saveLoginData = (responseData) => {
        const {
            user,
            accessToken,
            refreshToken,
        } = extractLoginData(responseData);

        if (!user) {
            console.error(
                "USER DATA NOT FOUND:",
                responseData
            );

            return null;
        }

        // ==========================================
        // SAVE TO AUTH CONTEXT
        // ==========================================

        login(
            user,
            accessToken
        );

        // ==========================================
        // LOCAL STORAGE
        // ==========================================

        localStorage.setItem(
            "user",
            JSON.stringify(user)
        );

        if (accessToken) {
            localStorage.setItem(
                "accessToken",
                accessToken
            );

            // Compatibility
            localStorage.setItem(
                "token",
                accessToken
            );
        }

        if (refreshToken) {
            localStorage.setItem(
                "refreshToken",
                refreshToken
            );
        }

        console.log(
            "LOGIN USER SAVED:",
            user
        );

        return user;
    };

    // ==========================================
    // GET DASHBOARD ROUTE
    // ==========================================

    const getDashboardRoute = (
        user,
        fallbackRole = "patient"
    ) => {
        const role =
            String(
                user?.role ||
                fallbackRole ||
                "patient"
            )
                .toLowerCase()
                .trim();

        // Patient always direct dashboard

        if (
            role === "patient" ||
            role === "user"
        ) {
            return "/portal/patient/dashboard";
        }

        if (
            role === "doctor" ||
            role === "medical_officer"
        ) {
            return "/portal/doctor/dashboard";
        }

        if (
            role === "hospital" ||
            role === "hospital_admin"
        ) {
            return "/portal/hospital/dashboard";
        }

        if (
            role === "admin" ||
            role === "administrator"
        ) {
            return "/portal/admin/dashboard";
        }

        // Default patient dashboard

        return "/portal/patient/dashboard";
    };

    // ==========================================
    // LOGIN API
    // ==========================================

    const loginUser = async () => {
        const value =
            credential.trim();

        const payload = {
            password,
        };

        // PHONE LOGIN

        if (isPhoneNumber(value)) {
            payload.phone =
                normalizePhone(value);
        }

        // EMAIL LOGIN

        else if (isValidEmail(value)) {
            payload.email =
                value.toLowerCase();
        }

        // INVALID

        else {
            throw new Error(
                "Please enter a valid phone number or email"
            );
        }

        console.log(
            "LOGIN PAYLOAD:",
            {
                ...payload,
                password: "******",
            }
        );

        const response =
            await api.post(
                "/auth/login",
                payload
            );

        return response.data;
    };

    // ==========================================
    // SEND OTP
    // ==========================================

    const sendOTP = async (phone) => {
        const response =
            await api.post(
                "/auth/send-otp",
                {
                    phone,
                }
            );

        const result =
            response.data;

        if (result?.success === false) {
            throw new Error(
                result?.message ||
                "Failed to send OTP"
            );
        }

        return result;
    };

    // ==========================================
    // REDIRECT AFTER LOGIN
    // ==========================================

    const redirectToDashboard = (
        loggedInUser
    ) => {
        const route =
            getDashboardRoute(
                loggedInUser,
                selectedRole
            );

        console.log(
            "REDIRECTING TO:",
            route
        );

        // Small timeout for context update

        setTimeout(() => {
            navigate(
                route,
                {
                    replace: true,
                }
            );
        }, 100);
    };

    // ==========================================
    // HANDLE LOGIN
    // ==========================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (!credential.trim()) {
            setError(
                "Please enter your phone number or email"
            );

            return;
        }

        if (!password) {
            setError(
                "Please enter your password"
            );

            return;
        }

        setLoading(true);

        try {
            // ======================================
            // LOGIN API
            // ======================================

            const result =
                await loginUser();

            console.log(
                "LOGIN RESPONSE:",
                result
            );

            // Backend explicitly says failure

            if (result?.success === false) {
                throw new Error(
                    result?.message ||
                    "Login failed"
                );
            }

            // ======================================
            // SAVE USER
            // ======================================

            const loggedInUser =
                saveLoginData(result);

            // ======================================
            // USER NOT RECEIVED
            // ======================================

            if (!loggedInUser) {
                throw new Error(
                    "Login successful but user information was not received."
                );
            }

            // ======================================
            // SUCCESS
            // ======================================

            setSuccess(
                `Welcome ${loggedInUser?.name ||
                loggedInUser?.fullName ||
                loggedInUser?.username ||
                ""}! Opening dashboard...`
            );

            // ======================================
            // DIRECT DASHBOARD
            // ======================================

            redirectToDashboard(
                loggedInUser
            );

        } catch (err) {
            const message =
                getErrorMessage(err);

            console.error(
                "LOGIN ERROR MESSAGE:",
                message
            );

            // ======================================
            // PHONE NOT VERIFIED
            // ======================================

            if (
                message
                    .toLowerCase()
                    .includes(
                        "phone number not verified"
                    )
            ) {
                if (
                    !isPhoneNumber(
                        credential
                    )
                ) {
                    setError(
                        "Your phone is not verified. Please login with your registered phone number."
                    );

                    return;
                }

                const phone =
                    normalizePhone(
                        credential
                    );

                setPendingPhone(phone);

                // Save login data temporarily

                sessionStorage.setItem(
                    "pendingLoginPhone",
                    phone
                );

                sessionStorage.setItem(
                    "pendingLoginPassword",
                    password
                );

                sessionStorage.setItem(
                    "pendingLoginRole",
                    selectedRole
                );

                setStep("otp");

                // Send OTP automatically

                setSendingOtp(true);

                try {
                    const otpResult =
                        await sendOTP(phone);

                    setSuccess(
                        otpResult?.message ||
                        "OTP sent successfully"
                    );

                } catch (otpError) {
                    setError(
                        `OTP could not be sent: ${getErrorMessage(
                            otpError
                        )}`
                    );
                } finally {
                    setSendingOtp(false);
                }

                return;
            }

            // Normal error

            setError(message);

        } finally {
            setLoading(false);
        }
    };

    // ==========================================
    // VERIFY OTP
    // ==========================================

    const handleVerifyOTP = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (!pendingPhone) {
            setError(
                "Phone number not found. Please login again."
            );

            return;
        }

        if (!otp) {
            setError(
                "Please enter OTP"
            );

            return;
        }

        setLoading(true);

        try {
            // ======================================
            // VERIFY OTP API
            // ======================================

            const response =
                await api.post(
                    "/auth/verify-otp",
                    {
                        phone: pendingPhone,
                        otp,
                    }
                );

            const result =
                response.data;

            console.log(
                "OTP VERIFY RESPONSE:",
                result
            );

            if (result?.success === false) {
                throw new Error(
                    result?.message ||
                    "OTP verification failed"
                );
            }

            setSuccess(
                "Phone verified successfully. Signing you in..."
            );

            // ======================================
            // GET SAVED PASSWORD
            // ======================================

            const savedPassword =
                sessionStorage.getItem(
                    "pendingLoginPassword"
                );

            if (!savedPassword) {
                throw new Error(
                    "Login session expired. Please login again."
                );
            }

            // ======================================
            // LOGIN AGAIN
            // ======================================

            const phone =
                pendingPhone;

            const loginResponse =
                await api.post(
                    "/auth/login",
                    {
                        phone,
                        password: savedPassword,
                    }
                );

            const loginResult =
                loginResponse.data;

            if (
                loginResult?.success === false
            ) {
                throw new Error(
                    loginResult?.message ||
                    "Login failed"
                );
            }

            // ======================================
            // SAVE USER
            // ======================================

            const loggedInUser =
                saveLoginData(
                    loginResult
                );

            if (!loggedInUser) {
                throw new Error(
                    "User information was not received"
                );
            }

            // ======================================
            // CLEAR SESSION
            // ======================================

            sessionStorage.removeItem(
                "pendingLoginPhone"
            );

            sessionStorage.removeItem(
                "pendingLoginPassword"
            );

            sessionStorage.removeItem(
                "pendingLoginRole"
            );

            // ======================================
            // DIRECT DASHBOARD
            // ======================================

            redirectToDashboard(
                loggedInUser
            );

        } catch (err) {
            setError(
                getErrorMessage(err)
            );

        } finally {
            setLoading(false);
        }
    };

    // ==========================================
    // RESEND OTP
    // ==========================================

    const handleResendOTP = async () => {
        if (!pendingPhone) {
            setError(
                "Phone number not found"
            );

            return;
        }

        setError("");
        setSuccess("");

        setSendingOtp(true);

        try {
            const result =
                await sendOTP(
                    pendingPhone
                );

            setSuccess(
                result?.message ||
                "OTP sent successfully"
            );

            setOtp("");

        } catch (err) {
            setError(
                getErrorMessage(err)
            );

        } finally {
            setSendingOtp(false);
        }
    };

    // ==========================================
    // BACK TO LOGIN
    // ==========================================

    const handleBackToLogin = () => {
        setStep("login");

        setOtp("");
        setError("");
        setSuccess("");
        setPendingPhone("");

        sessionStorage.removeItem(
            "pendingLoginPhone"
        );

        sessionStorage.removeItem(
            "pendingLoginPassword"
        );

        sessionStorage.removeItem(
            "pendingLoginRole"
        );
    };

    // ==========================================
    // OTP SCREEN
    // ==========================================

    if (step === "otp") {
        return (
            <div className="max-w-md mx-auto px-4 py-16">

                <Card className="shadow-xl">

                    <CardBody className="space-y-6">

                        <div className="text-center space-y-3">

                            <div className="mx-auto h-14 w-14 rounded-full bg-emerald-100 flex items-center justify-center">

                                <KeyRound className="h-7 w-7 text-emerald-600" />

                            </div>

                            <div>

                                <h1 className="text-2xl font-bold">

                                    Verify OTP

                                </h1>

                                <p className="text-sm text-slate-500 mt-2">

                                    Enter OTP sent to

                                </p>

                                <p className="font-semibold">

                                    {pendingPhone}

                                </p>

                            </div>

                        </div>

                        {error && (
                            <Alert type="error">
                                {error}
                            </Alert>
                        )}

                        {success && (
                            <Alert type="success">
                                {success}
                            </Alert>
                        )}

                        <form
                            onSubmit={handleVerifyOTP}
                            className="space-y-4"
                        >

                            <Input
                                id="otp"
                                label="OTP"
                                type="text"
                                value={otp}
                                placeholder="Enter OTP"
                                onChange={(e) => {

                                    const value =
                                        e.target.value
                                            .replace(/\D/g, "")
                                            .slice(0, 6);

                                    setOtp(value);
                                }}
                                leftIcon={
                                    <KeyRound className="h-4 w-4" />
                                }
                                required
                            />

                            <Button
                                type="submit"
                                variant="primary"
                                className="w-full"
                                isLoading={loading}
                            >

                                Verify & Sign In

                            </Button>

                        </form>

                        <div className="text-center">

                            <button
                                type="button"
                                onClick={handleResendOTP}
                                disabled={
                                    sendingOtp ||
                                    loading
                                }
                                className="inline-flex items-center gap-2 text-sm font-medium text-emerald-600 disabled:opacity-50"
                            >

                                <RefreshCw
                                    className={`h-4 w-4 ${sendingOtp
                                            ? "animate-spin"
                                            : ""
                                        }`}
                                />

                                {sendingOtp
                                    ? "Sending..."
                                    : "Resend OTP"}

                            </button>

                        </div>

                        <button
                            type="button"
                            onClick={handleBackToLogin}
                            className="w-full flex justify-center items-center gap-2 text-sm text-slate-500 hover:text-slate-900"
                        >

                            <ArrowLeft className="h-4 w-4" />

                            Back to Login

                        </button>

                    </CardBody>

                </Card>

            </div>
        );
    }

    // ==========================================
    // LOGIN SCREEN
    // ==========================================

    return (
        <div className="max-w-md mx-auto px-4 py-12">

            <Card className="shadow-xl">

                <CardBody className="space-y-6">

                    {/* HEADER */}

                    <div className="text-center">

                        <div className="mx-auto mb-4 h-14 w-14 rounded-full bg-emerald-100 flex items-center justify-center">

                            <User className="h-7 w-7 text-emerald-600" />

                        </div>

                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">

                            Welcome Back

                        </h1>

                        <p className="text-sm text-slate-500 mt-2">

                            Sign in to your health portal

                        </p>

                    </div>

                    {/* ALERTS */}

                    {error && (
                        <Alert type="error">
                            {error}
                        </Alert>
                    )}

                    {success && (
                        <Alert type="success">
                            {success}
                        </Alert>
                    )}

                    {/* ROLE SELECT */}

                    <div className="space-y-3">

                        <p className="text-sm font-semibold">

                            Select Portal

                        </p>

                        <div className="grid grid-cols-2 gap-3">

                            {Object.entries(
                                roleDetails
                            ).map(
                                ([role, details]) => (

                                    <button
                                        key={role}
                                        type="button"
                                        onClick={() =>
                                            setSelectedRole(role)
                                        }
                                        className={`p-3 rounded-xl border text-left transition-all ${selectedRole === role
                                                ? "border-emerald-500 bg-emerald-50 ring-1 ring-emerald-500"
                                                : "border-slate-200 hover:border-slate-300"
                                            }`}
                                    >

                                        <div className="text-xl">

                                            {details.icon}

                                        </div>

                                        <p className="text-sm font-semibold mt-1">

                                            {details.label}

                                        </p>

                                    </button>

                                )
                            )}

                        </div>

                    </div>

                    {/* LOGIN FORM */}

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-5"
                    >

                        <Input
                            id="credential"
                            label="Phone Number or Email"
                            type="text"
                            value={credential}
                            onChange={(e) => {

                                setCredential(
                                    e.target.value
                                );

                                setError("");
                            }}
                            placeholder="Phone or email"
                            leftIcon={
                                <Phone className="h-4 w-4" />
                            }
                            required
                        />

                        <Input
                            id="password"
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => {

                                setPassword(
                                    e.target.value
                                );

                                setError("");
                            }}
                            placeholder="Enter password"
                            leftIcon={
                                <Key className="h-4 w-4" />
                            }
                            required
                        />

                        <Button
                            type="submit"
                            variant="primary"
                            className="w-full"
                            isLoading={loading}
                        >

                            Sign In

                        </Button>

                    </form>

                </CardBody>

            </Card>

        </div>
    );
};