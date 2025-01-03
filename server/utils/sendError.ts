import { customError } from "./Interfaces";

const sendError = (message: string, statusCode: number) => {
  const customError: customError = new Error(message);
  customError.statusCode = statusCode;
  throw customError;
};

export default sendError;
