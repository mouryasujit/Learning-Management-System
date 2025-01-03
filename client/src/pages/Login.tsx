import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useLoginUserMutation,
  useRegisterUserMutation,
} from "@/features/api/authApi";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function Login() {
  const navigate = useNavigate();
  const [
    registerUser,
    {
      data: registerData,
      error: registerError,
      isLoading: registerisLoading,
      isSuccess: registerisSuccess,
      reset: resetRegister,
    },
  ] = useRegisterUserMutation();

  const [
    loginUser,
    {
      data: loginData,
      error: loginError,
      isLoading: loginisLoading,
      isSuccess: loginisSuccess,
      reset: resetLogin,
    },
  ] = useLoginUserMutation();

  const [singUp, setSignUp] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });
  const [login, setLogin] = useState({
    email: "",
    password: "",
  });
  const handleSignupAndLogin = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: string
  ) => {
    // Clear any existing error states when user starts typing
    if (type === "signup") {
      resetRegister();
      setSignUp({ ...singUp, [e.target.name]: e.target.value });
    } else {
      resetLogin();
      setLogin({ ...login, [e.target.name]: e.target.value });
    }
  };
  const selectRoleHandler = (selectedValue: string) => {
    // console.log(selectedValue);
    setSignUp({ ...singUp, role: selectedValue });
  };
  const handleUserLoginAndSignUp = async (type: string) => {
    try {
      // Clear previous states before making new request

      if (type === "signup") {
        resetRegister();
      } else {
        resetLogin();
      }

      const inputData = type === "signup" ? singUp : login;
      const action = type === "signup" ? registerUser : loginUser;

      // console.log(inputData);
      await action(inputData);
    } catch (error) {
      console.log(error);
    }
  };

  // Use this to disable scrolling when loading
  useEffect(() => {
    if (loginisLoading || registerisLoading) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [loginisLoading, registerisLoading]);

  useEffect(() => {
    if (loginisSuccess && loginData) {
      toast.success(loginData?.message || "Login Successful");
      navigate("/");
      // Clear states after successful login
      setLogin({ email: "", password: "" });
      resetLogin();
    }
    if (loginError) {
      if (loginError && "data" in loginError) {
        // console.log(loginError.data);
        toast.error(
          (loginError.data as { message?: string })?.message ||
            "Something went Wrong Try Again"
        );
      }
    }
  }, [loginisSuccess, loginError, loginData]);

  useEffect(() => {
    if (registerisSuccess && registerData) {
      toast.success(registerData?.message || "Registration successful");
      // Clear states after successful registration
      setSignUp({ name: "", email: "", password: "", role: "" });
      resetRegister();
    }
    if (registerError) {
      if (
        registerError &&
        typeof registerError === "object" &&
        "data" in registerError
      ) {
        // console.log("This is the error we got", registerError);
        toast.error(
          (registerError.data as { message?: string })?.message ||
            "Something went Wrong Try Again"
        );
      }
    }
  }, [registerisSuccess, registerError, registerData]);

  return (
    <>
      {(loginisLoading || registerisLoading) && <LoadingSpinner />}
      <div className="flex justify-center items-center w-full h-[90vh] border-r-8">
        <Tabs defaultValue="Login" className="w-[400px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="SignUp">SignUp</TabsTrigger>
            <TabsTrigger value="Login">Login</TabsTrigger>
          </TabsList>
          <TabsContent value="SignUp">
            <Card>
              <CardHeader>
                <CardTitle>SignUp</CardTitle>
                <CardDescription>Create Account Here</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="eg :-Pedro Duarte"
                    required
                    name="name"
                    value={singUp.name}
                    onChange={(e) => handleSignupAndLogin(e, "signup")}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    value={singUp.email}
                    onChange={(e) => handleSignupAndLogin(e, "signup")}
                    placeholder="eg :-johndoe@gmail.com"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="passowrd">Password</Label>
                  <Input
                    id="password"
                    name="password"
                    value={singUp.password}
                    onChange={(e) => handleSignupAndLogin(e, "signup")}
                    placeholder="Your password"
                    required
                  />
                </div>
                <div className="space-y-1">
                  <Select onValueChange={selectRoleHandler}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select A role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Select A Role</SelectLabel>
                        <SelectItem value="instructor">Instructor</SelectItem>
                        <SelectItem value="student">Student</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  disabled={loginisLoading || registerisLoading}
                  onClick={() => handleUserLoginAndSignUp("signup")}
                >
                  SignUp
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="Login">
            <Card>
              <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>Login here</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    name="email"
                    value={login.email}
                    onChange={(e) => handleSignupAndLogin(e, "login")}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="password">password</Label>
                  <Input
                    id="password"
                    type="password"
                    required
                    name="password"
                    value={login.password}
                    onChange={(e) => handleSignupAndLogin(e, "login")}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  onClick={() => handleUserLoginAndSignUp("login")}
                  disabled={loginisLoading || registerisLoading}
                >
                  Login
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
}

export default Login;
