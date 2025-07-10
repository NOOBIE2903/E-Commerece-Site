import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import Spinner from "./Spinner";
import api from "../../api";
import { useNavigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const [isAuthorized, setIsAuthorized] = useState(null);

  const navigate = useNavigate();

  useEffect(function () {
    auth().catch(() => setIsAuthorized(false));
  }, []);

  const refreshToken = async () => {
    const refreshToken = localStorage.getItem("refresh");

    try {
      const res = await api.post("api/token/refresh/", {
        refresh: refreshToken,
      });

      if (res.status == 200) {
        localStorage.setItem("access", res.data.access);
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
      }
    } catch (error) {
      console.log(error);
      setIsAuthorized(false);
    }
  };

  const auth = async () => {
    const token = localStorage.getItem("access");
    if (!token) {
      setIsAuthorized(false);
      return;
    }

    const decoded = jwtDecode(token);
    const expiry_date = decoded.exp;
    const current_time = Date.now() / 1000;

    if (current_time > expiry_date) {
      await refreshToken();
    } else {
      setIsAuthorized(true);
    }
  };

  if (isAuthorized == null) {
    return <Spinner />;
  }

  if (!isAuthorized) {
    navigate("/login/");
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
