import { setup2FA } from "@logic/twoFactorAuth";

/**
 * API to initalize 2FA of a user for the very first time
 */
const handler = async (req, res) => {
  const { uid } = req.query;
  const { secretKey, otpAuthUrl } = await setup2FA(uid);
  res.json({ secretKey, otpAuthUrl });
};

export default handler;
