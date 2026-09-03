import React, { useEffect, useRef, useState } from "react";

import { useAuth } from "../../context/AuthContext";
import { useHealthStore } from "../../context/HealthStoreContext";

import { Card, CardBody } from "../../components/Card";
import { Button } from "../../components/Button";
import { Badge } from "../../components/Badge";

import {
  Video,
  ShieldCheck,
  MapPin,
  Star,
  AlertCircle,
  Camera,
  Loader2,
} from "lucide-react";

import { VideoConsultationRoom } from "../../components/teleconsult/VideoConsultationRoom";


export const PatientTeleconsult = () => {
  const { user } = useAuth();

  const { doctors = [] } = useHealthStore();


  // ==========================================
  // STATE
  // ==========================================

  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const [inCall, setInCall] = useState(false);

  const [mediaStream, setMediaStream] = useState(null);

  const [cameraLoading, setCameraLoading] = useState(false);

  const [cameraError, setCameraError] = useState("");


  // Keep stream reference for cleanup
  const streamRef = useRef(null);


  // ==========================================
  // ACTIVE DOCTOR
  // ==========================================

  const activeDoc =
    selectedDoctor || doctors[0] || null;


  // ==========================================
  // CLEANUP CAMERA ON COMPONENT UNMOUNT
  // ==========================================

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => {
          track.stop();
        });

        streamRef.current = null;
      }
    };
  }, []);


  // ==========================================
  // START LIVE VIDEO CALL
  // ==========================================

  const startVideoCall = async (doctor = null) => {
    try {
      setCameraLoading(true);

      setCameraError("");


      // ----------------------------------------
      // SELECT DOCTOR
      // ----------------------------------------

      const doctorToCall =
        doctor || selectedDoctor || doctors[0];


      if (!doctorToCall) {
        throw new Error(
          "No doctor is currently available for teleconsultation."
        );
      }


      // Save selected doctor
      setSelectedDoctor(doctorToCall);


      // ----------------------------------------
      // CHECK BROWSER SUPPORT
      // ----------------------------------------

      if (
        !navigator.mediaDevices ||
        !navigator.mediaDevices.getUserMedia
      ) {
        throw new Error(
          "Camera access is not supported in this browser."
        );
      }


      // ----------------------------------------
      // STOP OLD STREAM IF EXISTS
      // ----------------------------------------

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => {
          track.stop();
        });

        streamRef.current = null;
      }


      // ----------------------------------------
      // REQUEST CAMERA + MICROPHONE
      // ----------------------------------------

      const stream =
        await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "user",

            width: {
              ideal: 1280,
            },

            height: {
              ideal: 720,
            },
          },

          audio: {
            echoCancellation: true,

            noiseSuppression: true,

            autoGainControl: true,
          },
        });


      // ----------------------------------------
      // VERIFY VIDEO TRACK
      // ----------------------------------------

      const videoTracks =
        stream.getVideoTracks();


      if (!videoTracks.length) {
        stream.getTracks().forEach((track) => {
          track.stop();
        });

        throw new Error(
          "Camera was not detected. Please connect a camera and try again."
        );
      }


      console.log(
        "LIVE CAMERA STREAM STARTED:",
        stream
      );

      console.log(
        "VIDEO TRACK:",
        videoTracks[0]
      );


      // ----------------------------------------
      // SAVE STREAM
      // ----------------------------------------

      streamRef.current =
        stream;

      setMediaStream(
        stream
      );


      // ----------------------------------------
      // OPEN VIDEO CONSULTATION ROOM
      // ----------------------------------------

      setInCall(
        true
      );


    } catch (error) {

      console.error(
        "CAMERA ERROR:",
        error
      );


      let errorMessage =
        "Unable to start the camera.";


      // ----------------------------------------
      // CAMERA PERMISSION ERROR
      // ----------------------------------------

      if (
        error.name === "NotAllowedError" ||
        error.name === "PermissionDeniedError"
      ) {

        errorMessage =
          "Camera permission was denied. Please allow Camera and Microphone access from your browser settings.";

      }


      // ----------------------------------------
      // CAMERA NOT FOUND
      // ----------------------------------------

      else if (
        error.name === "NotFoundError" ||
        error.name === "DevicesNotFoundError"
      ) {

        errorMessage =
          "Camera or microphone was not found. Please connect a camera and try again.";

      }


      // ----------------------------------------
      // CAMERA BUSY
      // ----------------------------------------

      else if (
        error.name === "NotReadableError" ||
        error.name === "TrackStartError"
      ) {

        errorMessage =
          "Camera is currently being used by another application. Please close Zoom, Google Meet, Teams, or other camera apps.";

      }


      // ----------------------------------------
      // OVERCONSTRAINED ERROR
      // ----------------------------------------

      else if (
        error.name === "OverconstrainedError"
      ) {

        errorMessage =
          "Your camera does not support the requested video settings.";

      }


      // ----------------------------------------
      // CUSTOM ERROR
      // ----------------------------------------

      else if (
        error.message
      ) {

        errorMessage =
          error.message;

      }


      setCameraError(
        errorMessage
      );


      setInCall(
        false
      );


      setMediaStream(
        null
      );


    } finally {

      setCameraLoading(
        false
      );

    }
  };


  // ==========================================
  // END VIDEO CALL
  // ==========================================

  const handleEndCall = () => {

    console.log(
      "ENDING VIDEO CALL..."
    );


    // Stop all camera and microphone tracks

    if (
      streamRef.current
    ) {

      streamRef.current
        .getTracks()
        .forEach((track) => {

          track.stop();

        });


      streamRef.current =
        null;

    }


    // Also stop state stream

    if (
      mediaStream
    ) {

      mediaStream
        .getTracks()
        .forEach((track) => {

          track.stop();

        });

    }


    // Clear state

    setMediaStream(
      null
    );


    setInCall(
      false
    );


    setCameraError(
      ""
    );

  };


  // ==========================================
  // VIDEO CONSULTATION ROOM
  // ==========================================

  if (
    inCall &&
    activeDoc &&
    mediaStream
  ) {

    return (

      <VideoConsultationRoom

        doctorName={
          activeDoc.name ||
          "Dr. Ramesh Chauhan"
        }


        doctorSpecialty={
          activeDoc.specialty ||
          "General Medicine"
        }


        doctorFacility={
          activeDoc.facilityName ||
          "Primary Health Centre"
        }


        patientName={
          user?.name ||
          "Rajesh Kumar"
        }


        abhaId={
          user?.abhaId ||
          "91-8273-9281-2831"
        }


        userRole="patient"


        // IMPORTANT:
        // LIVE CAMERA STREAM
        mediaStream={
          mediaStream
        }


        // END CALL FUNCTION
        onEndCall={
          handleEndCall
        }

      />

    );

  }


  // ==========================================
  // MAIN TELECONSULTATION PAGE
  // ==========================================

  return (

    <div className="space-y-6">


      {/* ====================================== */}
      {/* PAGE HEADER */}
      {/* ====================================== */}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">


        {/* TITLE */}

        <div>

          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">

            <Video className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />


            <span>

              ABDM Teleconsultation Room

            </span>

          </h1>


          <p className="text-xs text-slate-500 mt-1">

            Connect in high-definition video with certified medical officers
            and specialists across health nodes.

          </p>

        </div>


        {/* ACTIVE BADGE */}

        <Badge color="success">

          <ShieldCheck className="h-3.5 w-3.5 mr-1" />

          <span>

            ABHA Tele-Health Node Active

          </span>

        </Badge>

      </div>



      {/* ====================================== */}
      {/* CAMERA ERROR */}
      {/* ====================================== */}

      {cameraError && (

        <div className="flex items-start gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300">


          <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />


          <div className="flex-1">

            <p className="text-sm font-bold">

              Camera Access Error

            </p>


            <p className="text-xs mt-1">

              {cameraError}

            </p>


            <button

              type="button"

              onClick={() => {

                setCameraError("");

              }}

              className="text-xs font-bold underline mt-2"

            >

              Close

            </button>

          </div>

        </div>

      )}



      {/* ====================================== */}
      {/* HERO VIDEO CALL BANNER */}
      {/* ====================================== */}

      <Card className="bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white border-none shadow-xl overflow-hidden relative">


        <CardBody className="p-6 sm:p-8 space-y-4 relative z-10">


          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">


            {/* LEFT CONTENT */}

            <div className="space-y-2 max-w-xl">


              {/* LIVE BADGE */}

              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1.5">

                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />

                Live Video Telemedicine Suite

              </span>


              {/* TITLE */}

              <h2 className="text-xl sm:text-3xl font-extrabold text-white">

                Instant Video Consultation for{" "}

                {user?.name ||
                  "Rajesh Kumar"}

              </h2>


              {/* DESCRIPTION */}

              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">

                Connect directly with medical officers at your assigned
                Primary Health Centre or district specialist hospital with
                secure encrypted video communication.

              </p>

            </div>



            {/* START CAMERA BUTTON */}

            <Button

              variant="primary"

              size="lg"

              disabled={
                cameraLoading
              }


              onClick={() => {

                startVideoCall();

              }}


              leftIcon={

                cameraLoading

                  ? (

                    <Loader2 className="h-5 w-5 animate-spin" />

                  )

                  : (

                    <Camera className="h-5 w-5" />

                  )

              }


              className="bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-700 disabled:cursor-not-allowed text-white font-bold text-sm shadow-lg shrink-0 px-6 py-3"

            >

              {cameraLoading

                ? "Opening Camera..."

                : "Start Live Video Call Now"

              }

            </Button>

          </div>

        </CardBody>


        {/* BACKGROUND GLOW */}

        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 blur-3xl pointer-events-none" />

      </Card>



      {/* ====================================== */}
      {/* DOCTOR SELECTION */}
      {/* ====================================== */}

      <div className="space-y-4">


        {/* SECTION HEADER */}

        <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center justify-between">


          <span>

            Select Available Teleconsult Doctor

          </span>


          <span className="text-xs text-slate-500 font-normal">

            Showing{" "}

            {doctors.length}

            {" "}verified physicians

          </span>

        </h3>



        {/* DOCTOR GRID */}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">


          {doctors.length === 0 ? (

            <div className="col-span-full">

              <Card>

                <CardBody className="py-10 text-center">

                  <Video className="h-10 w-10 mx-auto text-slate-400 mb-3" />

                  <p className="text-sm font-bold text-slate-700 dark:text-slate-200">

                    No doctors available right now

                  </p>


                  <p className="text-xs text-slate-500 mt-1">

                    Please try again later.

                  </p>

                </CardBody>

              </Card>

            </div>

          ) : (

            doctors.map((doc) => {


              const isSelected =
                activeDoc?.id === doc.id;


              return (

                <Card

                  key={
                    doc.id
                  }


                  className={`transition-all cursor-pointer ${isSelected
                    ? "ring-2 ring-emerald-500 border-emerald-500 bg-emerald-50/20 dark:bg-emerald-950/20"
                    : "hover:shadow-md"
                    }`}


                  onClick={() => {

                    setSelectedDoctor(
                      doc
                    );

                  }}

                >


                  <CardBody className="flex gap-4">


                    {/* DOCTOR AVATAR */}

                    {doc.avatar ? (

                      <img

                        src={
                          doc.avatar
                        }


                        alt={
                          doc.name
                        }


                        className="h-14 w-14 rounded-2xl object-cover border border-slate-200 dark:border-slate-800 shadow-sm shrink-0"


                        onError={(e) => {

                          e.currentTarget.style.display =
                            "none";

                        }}

                      />

                    ) : (

                      <div className="text-3xl bg-slate-50 dark:bg-slate-900 p-3 h-14 w-14 rounded-2xl flex items-center justify-center border border-slate-100 dark:border-slate-800 shrink-0">

                        👨‍⚕️

                      </div>

                    )}



                    {/* DOCTOR DETAILS */}

                    <div className="flex-1 space-y-2">


                      {/* NAME + RATING */}

                      <div className="flex justify-between items-start">


                        <div>

                          <h4 className="font-bold text-sm text-slate-900 dark:text-white">

                            {doc.name}

                          </h4>


                          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">

                            {doc.specialty}

                          </p>

                        </div>



                        {/* RATING */}

                        <div className="flex items-center gap-0.5 text-amber-500 text-xs font-bold">

                          <Star className="h-3.5 w-3.5 fill-amber-500" />

                          <span>

                            {doc.rating || "4.8"}

                          </span>

                        </div>

                      </div>



                      {/* FACILITY */}

                      <p className="text-xs text-slate-500 flex items-center gap-1">

                        <MapPin className="h-3.5 w-3.5" />

                        <span>

                          {doc.facilityName ||
                            "Primary Health Centre"}

                        </span>

                      </p>



                      {/* ACTION */}

                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">


                        {/* READY */}

                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">


                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />


                          Ready for Video Call

                        </span>



                        {/* JOIN CALL BUTTON */}

                        <Button

                          variant={
                            isSelected
                              ? "primary"
                              : "outline"
                          }


                          size="sm"


                          disabled={
                            cameraLoading
                          }


                          onClick={(e) => {

                            e.stopPropagation();


                            startVideoCall(
                              doc
                            );

                          }}

                        >

                          {cameraLoading

                            ? "Opening..."

                            : isSelected

                              ? "Join Room Now"

                              : "Select & Join"

                          }

                        </Button>

                      </div>

                    </div>

                  </CardBody>

                </Card>

              );

            })

          )}

        </div>

      </div>


      {/* ====================================== */}
      {/* CAMERA PRIVACY INFO */}
      {/* ====================================== */}

      <div className="flex items-center gap-3 text-xs text-slate-500 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl p-4">

        <ShieldCheck className="h-5 w-5 text-emerald-500 shrink-0" />

        <p>

          Your camera and microphone will only be activated after you click
          <strong className="mx-1">
            Start Live Video Call Now
          </strong>
          and grant browser permission.

        </p>

      </div>


    </div>

  );

};