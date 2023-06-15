export class Enable2faDto {
    code: string; // Verification code sent by the user, e.g., obtained from an email or SMS
}
  
export class Verify2faDto {
    code: string; // User-provided 2FA code for verification
}