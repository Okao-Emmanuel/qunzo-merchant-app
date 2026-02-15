import arrowIcon from "@/assets/dashboard/settings/arrow-icon.svg";
import kycSettingsIcon from "@/assets/dashboard/settings/kyc-history-icon.svg";
import passwordSettingsIcon from "@/assets/dashboard/settings/password-settings-icon.svg";
import profileSettingsIcon from "@/assets/dashboard/settings/profile-settings-icon.svg";
import twoFaSettingsIcon from "@/assets/dashboard/settings/twofasettingsIcon.svg";
import Image from "next/image";
import Link from "next/link";

const Settings = () => {
  return (
    <div>
      <h2 className="text-[20px] font-bold text-merchant-text mb-[32px]">
        Settings
      </h2>
      <div className="bg-white rounded-[8px] p-[20px] border border-[rgba(26,32,44,0.10)]">
        <div className="max-w-[514] mx-auto">
          <Link href="/dashboard/settings/profile-settings">
            <div className="flex justify-between items-center mb-[30px] bg-[rgba(4,56,68,0.08)] rounded-[12px] px-[16px] py-[10px]">
              <div className="flex items-center gap-2.5">
                <div className="w-[46px] h-[46px] rounded-full bg-[rgba(4,56,68,0.08)] flex justify-center items-center">
                  <Image
                    src={profileSettingsIcon}
                    alt="icon"
                    width={20}
                    height={20}
                  />
                </div>
                <h3 className="text-[14px] font-semibold text-[#1A202C]">
                  Profile Settings
                </h3>
              </div>
              <div>
                <Image src={arrowIcon} alt="icon" width={24} height={24} />
              </div>
            </div>
          </Link>
          <Link href="/dashboard/settings/change-password">
            <div className="flex justify-between items-center mb-[30px] bg-[rgba(255,196,22,0.08)] rounded-[12px] px-[16px] py-[10px]">
              <div className="flex items-center gap-2.5">
                <div className="w-[46px] h-[46px] rounded-full bg-[rgba(255,196,22,0.1)] flex justify-center items-center">
                  <Image
                    src={passwordSettingsIcon}
                    alt="icon"
                    width={20}
                    height={20}
                  />
                </div>
                <h3 className="text-[14px] font-semibold text-[#1A202C]">
                  Change Password
                </h3>
              </div>
              <div>
                <Image src={arrowIcon} alt="icon" width={24} height={24} />
              </div>
            </div>
          </Link>
          <Link href="/dashboard/settings/kyc-history">
            <div className="flex justify-between items-center mb-[30px] bg-[rgba(20,174,111,0.08)] rounded-[12px] px-[16px] py-[10px]">
              <div className="flex items-center gap-2.5">
                <div className="w-[46px] h-[46px] rounded-full bg-[rgba(20,174,111,0.1)] flex justify-center items-center">
                  <Image
                    src={kycSettingsIcon}
                    alt="icon"
                    width={20}
                    height={20}
                  />
                </div>
                <h3 className="text-[14px] font-semibold text-[#1A202C]">
                  KYC History
                </h3>
              </div>
              <div>
                <Image src={arrowIcon} alt="icon" width={24} height={24} />
              </div>
            </div>
          </Link>
          <Link href="/dashboard/settings/two-fa-security">
            <div className="flex justify-between items-center mb-[30px] bg-[rgba(118,20,174,0.08)] rounded-[12px] px-[16px] py-[10px]">
              <div className="flex items-center gap-2.5">
                <div className="w-[46px] h-[46px] rounded-full bg-[rgba(118,31,177,0.08)] flex justify-center items-center">
                  <Image
                    src={twoFaSettingsIcon}
                    alt="icon"
                    width={20}
                    height={20}
                  />
                </div>
                <h3 className="text-[14px] font-semibold text-[#1A202C]">
                  2FA Security
                </h3>
              </div>
              <div>
                <Image src={arrowIcon} alt="icon" width={24} height={24} />
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Settings;
