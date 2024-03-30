import {
  addDoc,
  collection,
  doc,
  getFirestore,
  setDoc,
} from "firebase/firestore";
import { ChangeEvent, useEffect, useState } from "react";
import { useDocument } from "react-firebase-hooks/firestore";
import { useLocation } from "react-router-dom";
import { firebaseApp, firebaseDB } from "../utils/firebaseConfig";

interface UserDetailsProp {
  name: string;
  phoneNumber: string;
  country: string;
  state: string;
  city: string;
}

interface CountryDataProps {
  code: string;
  name: string;
  states: {
    cities: string[];
    name: string;
  }[];
}

const Signup = () => {
  const location = useLocation();

  const [userDetails, setUserDetails] = useState<UserDetailsProp>({
    name: "",
    phoneNumber: location?.state?.userPhoneNumber || "",
    country: "",
    state: "",
    city: "",
  });
  const [signupButtonLoading, setSignupButtonLoading] = useState(false);

  const [selectedCountry, setSelectedCountry] =
    useState<CountryDataProps>(null);
  const [selectedState, setSelectedState] = useState<{
    cities: string[];
    name: string;
  }>(null);

  const [countryListData, countryListLoading, countryListError] = useDocument(
    doc(getFirestore(firebaseApp), "countryList", "countryList"),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );

  const onChangeUserDetails = (e: ChangeEvent<HTMLInputElement>) => {
    setUserDetails({
      ...userDetails,
      [e.target.name]: e.target.value,
    });
  };

  const onChangeUserPhoneNumber = (e: ChangeEvent<HTMLInputElement>) => {
    const numericRegex = /^[0-9]+$/;
    if (numericRegex.test(e.target.value) || e.target.value === "")
      setUserDetails({
        ...userDetails,
        [e.target.name]: e.target.value,
      });
  };

  const onSelectCountry = (e: ChangeEvent<HTMLSelectElement>) => {
    e.target.remove(0);

    setUserDetails({
      ...userDetails,
      country: e.target.value,
    });

    setSelectedCountry(
      countryListData
        ?.data()
        ?.countryList?.filter(
          (country: CountryDataProps) => country?.name === e.target.value
        )[0]
    );

    setSelectedState(null);
  };

  const onSelectState = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setUserDetails({
      ...userDetails,
      state: e.target.value,
    });

    setSelectedState(
      selectedCountry?.states?.filter(
        (state) => state?.name === e.target.value
      )[0]
    );
  };

  const onSelectCity = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setUserDetails({
      ...userDetails,
      city: e.target.value,
    });
  };

  const signupHandler = async () => {
    try {
      setSignupButtonLoading(true);
      await setDoc(
        doc(firebaseDB, "userData", userDetails?.phoneNumber),
        userDetails
      );
    } catch (e) {
      console.error("Error adding document: ", e);
    } finally {
      setSignupButtonLoading(false);
    }
  };

  return (
    <div className="flex-column">
      <label htmlFor="name">Name</label>
      <input
        id="name"
        name="name"
        type="text"
        value={userDetails.name}
        onChange={onChangeUserDetails}
      />
      <label htmlFor="phoneNumber">Phone Number</label>
      <input
        id="phoneNumber"
        name="phoneNumber"
        type="text"
        value={userDetails.phoneNumber}
        onChange={onChangeUserPhoneNumber}
      />

      {!countryListLoading ? (
        <div>
          <select name="country" onChange={onSelectCountry}>
            <option value="">Choose a country</option>

            {countryListData
              ?.data()
              ?.countryList.map((country: CountryDataProps) => (
                <option key={country?.code} value={country?.name}>
                  {country?.name}
                </option>
              ))}
          </select>

          <select
            name="state"
            onChange={onSelectState}
            disabled={!selectedCountry}
          >
            <option value="">Choose a state</option>

            {selectedCountry?.states?.map((state) => (
              <option key={state?.name} value={state?.name}>
                {state?.name}
              </option>
            ))}
          </select>

          <select name="city" onChange={onSelectCity} disabled={!selectedState}>
            <option value="">Choose a city</option>

            {selectedState?.cities?.map((city) => (
              <option key={city}>{city}</option>
            ))}
          </select>
        </div>
      ) : null}

      <button
        onClick={signupHandler}
        disabled={
          !userDetails?.name || !userDetails?.phoneNumber || signupButtonLoading
        }
      >
        Signup
      </button>
    </div>
  );
};
export default Signup;
