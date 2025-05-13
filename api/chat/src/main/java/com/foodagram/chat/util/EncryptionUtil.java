package com.foodagram.chat.util;

import org.apache.logging.log4j.util.InternalException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Cipher;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;

@Service
public class EncryptionUtil {
  @Value("${aes.secret}")
  private String secretKey;

  private SecretKeySpec getSecretKeySpec() {
    byte[] decodedKey = Base64.getDecoder().decode(secretKey);
    return new SecretKeySpec(decodedKey, 0, decodedKey.length, "AES");
  }

  public String encrypt(String strToEncrypt) {
    try {
      Cipher cipher = Cipher.getInstance("AES/ECB/PKCS5Padding");
      cipher.init(Cipher.ENCRYPT_MODE, getSecretKeySpec());
      return Base64.getUrlEncoder().encodeToString(cipher.doFinal(strToEncrypt.getBytes("UTF-8")));
    } catch (Exception e) {
      throw new InternalException("Error while encrypting: " + e);
    }
  }

  public String decrypt(String strToDecrypt) {
    try {
      Cipher cipher = Cipher.getInstance("AES/ECB/PKCS5PADDING");
      cipher.init(Cipher.DECRYPT_MODE, getSecretKeySpec());
      return new String(cipher.doFinal(Base64.getUrlDecoder().decode(strToDecrypt)));
    } catch (Exception e) {
      throw new InternalException("Error while decrypting: " + e);
    }
  }
}
