import { passwordChars } from "./constants";

function generateRandomPassword() {
  const passwordLength = 10;
  let password = "";
  for (let i = 0; i <= passwordLength; i++) {
    let randomNumber = Math.floor(Math.random() * passwordChars.length);
    password += passwordChars.substring(randomNumber, randomNumber + 1);
  }
  return password;
}

export { generateRandomPassword };
