import { PhoneNumberType } from "@/types/schema";
import Environment from "../config/env";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { parse } from "url";

const comparePasswords = async (
  plainPassword: string,
  encryptedPassword: string
) => {
  return await bcrypt.compare(plainPassword, encryptedPassword);
};

const generateJwtToken = (
  _id: string,
  // phone: string,
  email: string
): string => {
  const { JWT_SECRET, JWT_ISSUER } = Environment;
  const token = jwt.sign({ _id, email }, JWT_SECRET, {
    expiresIn: "90d",
    issuer: JWT_ISSUER,
  });
  return token;
};

const generateOTP = (): string => {
  const otpLength = 6;
  const otpDigits = "0123456789";

  let otp = "";
  for (let i = 0; i < otpLength; i++) {
    const randomIndex = Math.floor(Math.random() * otpDigits.length);
    otp += otpDigits.charAt(randomIndex);
  }

  return otp;
};

// const getPhoneNumber = (phone: PhoneNumberType): string =>
const getPhoneNumber = (phone: string): string => `${phone}`;

export const encryptPassword = async (password: string) => {
  const salt = await bcrypt.genSalt(10);
  const newPassword = await bcrypt.hash(password, salt);
  return newPassword;
};

const generateNewPassword = (): string => {
  const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const specialChars = "!@#$%^&*()_+-=[]{}|;:,.<>?";

  const getRandomChar = (characters: string) => {
    const randomIndex = Math.floor(Math.random() * characters.length);
    return characters.charAt(randomIndex);
  };

  let password = "";

  // Add at least one uppercase character
  password += getRandomChar(uppercaseChars);

  // Add at least one number
  password += getRandomChar(numbers);

  // Add at least one special character
  password += getRandomChar(specialChars);

  // Fill the rest of the password with a mix of uppercase, lowercase, numbers, and special characters
  for (let i = 3; i < 8; i++) {
    const allChars = uppercaseChars + lowercaseChars + numbers + specialChars;
    password += getRandomChar(allChars);
  }

  // Shuffle the password characters to randomize it
  const passwordArray = password.split("");
  for (let i = passwordArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [passwordArray[i], passwordArray[j]] = [passwordArray[j], passwordArray[i]];
  }

  return passwordArray.join("");
};

const filterNonNullValues = (data: Record<string, any>) => {
  let return_field: Record<string, any> = {};
  Object.entries(data).forEach(([key, value]) => {
    if (value !== null && value !== undefined) {
      return_field[key] = value;
    }
  });
  return return_field;
};

const parseAzureStorageUrl = (
  url: string
): { containerName: string; blobName: string } | null => {
  try {
    const parsedUrl = parse(url);
    const pathSegments = parsedUrl.pathname
      ? parsedUrl.pathname.split("/")
      : [];

    // Assuming that the URL follows the standard Azure Storage format
    // Format: /<containerName>/<blobName>
    if (pathSegments.length >= 3) {
      const containerName = pathSegments[1];
      const blobName = pathSegments.slice(2).join("/");

      return { containerName, blobName };
    } else {
      throw new Error("Invalid Azure Storage URL format");
    }
  } catch (error) {
    console.error("Error extracting container and blob names:", error);
    return null;
  }
};

export {
  comparePasswords,
  generateJwtToken,
  generateOTP as generateOTP,
  getPhoneNumber,
  generateNewPassword,
  filterNonNullValues,
  parseAzureStorageUrl,
};
