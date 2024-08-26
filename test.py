import pyotp 
import qrcode


key  = "JBSWY3DPEHPK3PXP"
# key = pyotp.random_base32()

# totp = pyotp.TOTP(key)

# while True:
#     print(totp.verify(input("Enter the code: ")))


# uri = pyotp.totp.TOTP(key).provisioning_uri(name="test", issuer_name="test")


# print(uri)


qrcode.make("otpauth://totp/PongyGame:test?secret=JBSWY3DPEHPK3PXP&issuer=PongyGame").save("test.png")

# while True:
#     print(pyotp.totp.TOTP(key).now())