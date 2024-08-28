import React, { useState } from "react";
import {
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  Divider,
} from "@mui/material";
import { RotatingLines } from "react-loader-spinner";
import Form from "./Form";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setLogin } from "../../state";
import { toast } from "react-toastify";

const LoginPage = () => {
  const theme = useTheme();
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const responseSuccessGoogle = (response) => {
    setLoading(true);
    const details = jwtDecode(response.credential);
    axios(`${process.env.REACT_APP_Backend_URL}/auth/googlelogin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        tokenId: response.credential, // passed the Google ID token
      },
    })
      .then((res) => {
        const { user, token, message } = res.data;
        dispatch(
          setLogin({
            user: user,
            token: token,
          })
        );
        toast.success(message);
        navigate("/home");
      })
      .catch((err) => {
        toast.error("Error logging in");
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const responseErrorGoogle = (response) => {
    console.log(response);
    toast.error("Error in Google Login");
  };

  return (
    <Box>
      <Box
        width="100%"
        backgroundColor={theme.palette.background.alt}
        p="1.3rem 6%"
        textAlign="center"
      >
        <Typography fontWeight="bold" fontSize="32px" color="primary">
Moviewatcher
        </Typography>
      </Box>

      <Box
        width={isNonMobileScreens ? "50%" : "93%"}
        p="1.9rem"
        m="2.2rem auto"
        borderRadius="1.5rem"
        backgroundColor={theme.palette.background.alt}
      >
        <Typography
          fontWeight="500"
          variant="h5"
          sx={{ mb: "1.5rem", textAlign: "center" }}
        >
          Welcome to Moviewatcher Community!
        </Typography>

        <Form />

        <Divider
          sx={{
            my: "1.5rem",
            borderColor: theme.palette.primary.main,
            borderWidth: 1,
          }}
        />

        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          width={isNonMobileScreens ? "50%" : "93%"}
          p="1rem"
          m="auto"
          borderRadius="1.5rem"
          backgroundColor={theme.palette.background.alt}
        >
          <GoogleOAuthProvider clientId="891424812020-99m03bd6qnjsh97ha51hoej4sp2a9suh.apps.googleusercontent.com">
            {loading ? (
              <Box
                position="fixed"
                top="50%"
                left="50%"
                sx={{
                  transform: "translate(-50%, -50%)",
                }}
              >
                <RotatingLines
                  visible={true}
                  height="96"
                  width="96"
                  color="grey"
                  strokeWidth="5"
                  animationDuration="0.75"
                  ariaLabel="rotating-lines-loading"
                  wrapperStyle={{}}
                  wrapperClass=""
                />
              </Box>
            ) : (
              <GoogleLogin
                onSuccess={responseSuccessGoogle}
                onError={responseErrorGoogle}
              />
            )}
          </GoogleOAuthProvider>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginPage;
