"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUser } from "@/context/UserContext";
import ApiPath from "@/network/api/apiPath";
import NetworkService from "@/network/service/networkService";
import Link from "next/link";
import { useEffect, useState } from "react";
import Flatpickr from "react-flatpickr";
import { toast } from "react-toastify";

const AccountSettings = () => {
  const network = new NetworkService();
  const [profileImage, setProfileImage] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);
  const [allCountry, setAllCountry] = useState([]);
  const { user, updateUser } = useUser();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [address, setAddress] = useState("");
  const [joiningDate, setJoiningDate] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch countries
  const fetchAllCountry = async () => {
    try {
      const res = await network.globalGet(ApiPath.allCountry);
      if (res.status === "completed") {
        setAllCountry(res.data.data);
      }
    } catch (err) {}
  };

  // Image upload handling
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageClick = () => {
    document.getElementById("imageUpload").click();
  };

  // Update profile
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("first_name", firstName);
      formData.append("last_name", lastName);
      formData.append("username", username);
      formData.append("email", email);
      formData.append("gender", gender);
      formData.append("date_of_birth", dateOfBirth);
      formData.append("phone", phone);
      formData.append("country", country);
      formData.append("city", city);
      formData.append("zip_code", zip);
      formData.append("address", address);

      if (profileImage) {
        formData.append("avatar", profileImage);
      }

      const res = await network.postFormData(ApiPath.userProfile, formData);

      if (res.status === "completed") {
        const updatedUser = {
          ...user,
          user: {
            ...user.user,
            first_name: firstName,
            last_name: lastName,
            username,
            email,
            gender,
            date_of_birth: dateOfBirth,
            phone,
            country,
            city,
            zip_code: zip,
            address,
            avatar: profilePreview || res.data.data?.avatar || user.user.avatar,
          },
        };

        updateUser(updatedUser);
        setProfilePreview(null);
        setProfileImage(null);
        toast.success("Profile updated successfully!");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllCountry();
  }, []);

  // Load user data
  useEffect(() => {
    if (user && user.user) {
      const u = user.user;
      setFirstName(u.first_name || "");
      setLastName(u.last_name || "");
      setUsername(u.username || "");
      setEmail(u.email || "");
      setGender(
        u.gender
          ? u.gender.charAt(0).toUpperCase() + u.gender.slice(1).toLowerCase()
          : ""
      );
      setDateOfBirth(u.date_of_birth || "");
      setPhone(u.phone || "");
      setCountry(u.country || "");
      setCity(u.city || "");
      setZip(u.zip_code || "");
      setAddress(u.address || "");
      setJoiningDate(u.created_at || "");
    }
  }, [user, allCountry]);

  return (
    <div>
      <h2 className="text-[20px] font-bold text-merchant-text mb-[32px]">
        Account Settings
      </h2>
      <div className="bg-white rounded-[8px] p-[20px] border border-[rgba(26,32,44,0.16)]">
        <div className="max-w-[614px] mx-auto border border-[rgba(26,32,44,0.16)] p-[20px] rounded-[8px]">
          <form onSubmit={handleProfileUpdate}>
            <div className="flex justify-center mb-8">
              <div className="relative w-full">
                <div
                  onClick={handleImageClick}
                  className="w-full h-[123px] border-2 border-dashed border-merchant-input-border rounded-[8px] flex items-center justify-center cursor-pointer"
                >
                  {profilePreview || user?.user?.avatar ? (
                    <img
                      src={profilePreview || user.user.avatar}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="flex flex-col items-center text-gray-400">
                      <svg
                        className="w-12 h-12 mb-2"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                      </svg>
                      <span className="text-sm">Click to upload</span>
                    </div>
                  )}
                </div>

                <div
                  onClick={handleImageClick}
                  className="absolute -bottom-2 -right-2 bg-merchant-primary p-2 rounded-full text-white cursor-pointer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <path
                      d="M13.332 4.16669H12.8254C12.6701 4.16856 12.5175 4.12632 12.3854 4.04489C12.2532 3.96346 12.1468 3.84618 12.0787 3.70669L11.4787 2.51335C11.3276 2.20783 11.0938 1.95086 10.8039 1.77171C10.5139 1.59256 10.1795 1.49842 9.8387 1.50002H6.1587C5.81788 1.49842 5.48345 1.59256 5.19351 1.77171C4.90357 1.95086 4.66976 2.20783 4.5187 2.51335L3.9187 3.70669C3.85055 3.84618 3.74421 3.96346 3.61203 4.04489C3.47985 4.12632 3.32727 4.16856 3.17203 4.16669H2.66536C2.17913 4.16669 1.71282 4.35984 1.369 4.70366C1.02519 5.04747 0.832031 5.51379 0.832031 6.00002V12.6667C0.832031 13.1529 1.02519 13.6192 1.369 13.963C1.71282 14.3069 2.17913 14.5 2.66536 14.5H13.332C13.8183 14.5 14.2846 14.3069 14.6284 13.963C14.9722 13.6192 15.1654 13.1529 15.1654 12.6667V6.00002C15.1654 5.51379 14.9722 5.04747 14.6284 4.70366C14.2846 4.35984 13.8183 4.16669 13.332 4.16669ZM7.9987 12.1667C7.30646 12.1667 6.62977 11.9614 6.0542 11.5768C5.47863 11.1922 5.03003 10.6456 4.76512 10.0061C4.50021 9.36654 4.4309 8.6628 4.56595 7.98387C4.701 7.30494 5.03434 6.6813 5.52382 6.19181C6.01331 5.70233 6.63695 5.36899 7.31588 5.23394C7.99482 5.09889 8.69855 5.1682 9.33809 5.43311C9.97763 5.69802 10.5243 6.14662 10.9088 6.72219C11.2934 7.29776 11.4987 7.97445 11.4987 8.66669C11.4969 9.5944 11.1276 10.4836 10.4716 11.1396C9.81563 11.7956 8.92641 12.1649 7.9987 12.1667Z"
                      fill="white"
                    />
                    <path
                      d="M8 11.168C9.38071 11.168 10.5 10.0487 10.5 8.66797C10.5 7.28726 9.38071 6.16797 8 6.16797C6.61929 6.16797 5.5 7.28726 5.5 8.66797C5.5 10.0487 6.61929 11.168 8 11.168Z"
                      fill="white"
                    />
                  </svg>
                </div>

                <input
                  id="imageUpload"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="relative">
                    <input
                      type="text"
                      id="first_name"
                      className={`user-input peer`}
                      placeholder=" "
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                    <label
                      htmlFor="first_name"
                      className="user-label absolute -translate-y-4 scale-80 top-2 z-10 origin-[0] px-[0px] peer-focus:px-2 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-[90%] peer-focus:-translate-y-4 start-[16px]"
                    >
                      First Name <span className="text-merchant-error">*</span>
                    </label>
                  </div>
                </div>

                <div>
                  <div className="relative">
                    <input
                      type="text"
                      id="last_name"
                      className={`user-input peer`}
                      placeholder=" "
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                    <label
                      htmlFor="last_name"
                      className="user-label absolute -translate-y-4 scale-80 top-2 z-10 origin-[0] px-[0px] peer-focus:px-2 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-[90%] peer-focus:-translate-y-4 start-[16px]"
                    >
                      Last Name <span className="text-merchant-error">*</span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="relative">
                    <input
                      type="text"
                      id="username"
                      className={`user-input disabled:opacity-50 peer`}
                      placeholder=" "
                      value={username}
                      disabled
                    />
                    <label
                      htmlFor="username"
                      className="user-label absolute -translate-y-4 scale-80 top-2 z-10 origin-[0] px-[0px] peer-focus:px-2 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-[90%] peer-focus:-translate-y-4 start-[16px]"
                    >
                      Username <span className="text-merchant-error">*</span>
                    </label>
                  </div>
                </div>

                <div>
                  <div className="relative">
                    <Select value={gender} onValueChange={setGender}>
                      <div className="absolute left-[16px] top-[-12px]">
                        <span className="text-[11px] text-[rgba(26,32,44,0.60)] font-semibold bg-white">
                          Gender <span className="text-merchant-error">*</span>
                        </span>
                      </div>
                      <SelectTrigger className="w-full !h-[52px] border-2 border-merchant-input-border rounded-[8px] text-merchant-text pl-[16px]">
                        <SelectValue placeholder="Select Gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="relative">
                  <Flatpickr
                    className="date-input"
                    placeholder="Date of Birth"
                    value={dateOfBirth}
                    options={{
                      dateFormat: "Y-m-d",
                      mode: "single",
                      maxDate: "today",
                    }}
                    onChange={([d]) => {
                      if (d) {
                        const yyyy = d.getFullYear();
                        const mm = String(d.getMonth() + 1).padStart(2, "0");
                        const dd = String(d.getDate()).padStart(2, "0");
                        setDateOfBirth(`${yyyy}-${mm}-${dd}`);
                      }
                    }}
                  />
                  <div className="absolute left-[16px] top-[-12px]">
                    <span className="text-[11px] text-[rgba(26,32,44,0.60)] font-semibold bg-white">
                      Birth Date <span className="text-merchant-error">*</span>
                    </span>
                  </div>
                </div>

                <div>
                  <div className="relative">
                    <input
                      type="text"
                      id="email"
                      className={`user-input disabled:opacity-50 peer`}
                      placeholder=" "
                      value={email}
                      disabled
                    />
                    <label
                      htmlFor="email"
                      className="user-label absolute -translate-y-4 scale-80 top-2 z-10 origin-[0] px-[0px] peer-focus:px-2 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-[90%] peer-focus:-translate-y-4 start-[16px]"
                    >
                      Email <span className="text-merchant-error">*</span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="relative">
                    <input
                      type="text"
                      id="phone"
                      className={`user-input peer`}
                      placeholder=" "
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                    <label
                      htmlFor="phone"
                      className="user-label absolute -translate-y-4 scale-80 top-2 z-10 origin-[0] px-[0px] peer-focus:px-2 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-[90%] peer-focus:-translate-y-4 start-[16px]"
                    >
                      Phone <span className="text-merchant-error">*</span>
                    </label>
                  </div>
                </div>

                <div>
                  <div className="relative">
                    <Select
                      value={country}
                      onValueChange={(value) => setCountry(value)}
                    >
                      <div className="absolute left-[16px] top-[-12px]">
                        <span className="text-[11px] text-[rgba(26,32,44,0.60)] font-semibold bg-white">
                          Country <span className="text-merchant-error">*</span>
                        </span>
                      </div>
                      <SelectTrigger className="w-full !h-[52px] border-2 border-merchant-input-border rounded-[8px] text-merchant-text pl-[16px]">
                        <SelectValue placeholder="Select Country">
                          {country && allCountry.length > 0
                            ? allCountry.find(
                                (c) =>
                                  c.code?.toUpperCase() ===
                                  country?.toUpperCase()
                              )?.name || country
                            : "Select Country"}
                        </SelectValue>
                      </SelectTrigger>

                      <SelectContent>
                        <SelectGroup>
                          {allCountry.map((c) => (
                            <SelectItem key={c.code} value={c.code}>
                              {c.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="relative">
                    <input
                      type="text"
                      id="city"
                      className={`user-input peer`}
                      placeholder=" "
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                    <label
                      htmlFor="city"
                      className="user-label absolute -translate-y-4 scale-80 top-2 z-10 origin-[0] px-[0px] peer-focus:px-2 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-[90%] peer-focus:-translate-y-4 start-[16px]"
                    >
                      City <span className="text-merchant-error">*</span>
                    </label>
                  </div>
                </div>

                <div>
                  <div className="relative">
                    <input
                      type="text"
                      id="zip"
                      className={`user-input peer`}
                      placeholder=" "
                      value={zip}
                      onChange={(e) => setZip(e.target.value)}
                    />
                    <label
                      htmlFor="zip"
                      className="user-label absolute -translate-y-4 scale-80 top-2 z-10 origin-[0] px-[0px] peer-focus:px-2 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-[90%] peer-focus:-translate-y-4 start-[16px]"
                    >
                      ZIP <span className="text-merchant-error">*</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div>
                  <div className="relative">
                    <input
                      type="text"
                      id="address"
                      className={`user-input peer`}
                      placeholder=" "
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                    <label
                      htmlFor="address"
                      className="user-label absolute -translate-y-4 scale-80 top-2 z-10 origin-[0] px-[0px] peer-focus:px-2 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-[90%] peer-focus:-translate-y-4 start-[16px]"
                    >
                      Address <span className="text-merchant-error">*</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Submit button */}
              <div className="flex items-center gap-3 mt-9">
                <Link
                  href="/dashboard/settings"
                  className="group primary-button secondary-color-btn w-full"
                >
                  <span className="primary-button-hover-effect secondary-button-hover-effect"></span>
                  <span className="primary-button-text">Back</span>
                </Link>
                <button
                  className="group primary-button w-full"
                  type="submit"
                  disabled={loading}
                >
                  <span className="primary-button-hover-effect"></span>
                  <span className="primary-button-text">
                    {loading ? "Updating..." : "Save Changes"}
                  </span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
