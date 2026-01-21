export const patterns: { [key: string]: RegExp } = {
  us: /^\+1 \d{3} \d{3} \d{4}$/, // USA: +1 (415) 900-0139
  ca: /^\+1 \d{3} \d{3} \d{4}$/, // Canada: +1 (415) 900-0139
  gb: /^\+44 \d{4} \d{6}$/, // UK: +44 1234 567890
  in: /^\+91 \d{5} \d{5}$/, // India: +91 12345 67890
  au: /^\+61 \d{4} \d{3} \d{3}$/, // Australia: +61 412 345 678
  de: /^\+49 \(\d{3}\) \d{3}\d{4}$/, // Germany: +49 (123) 456-7890
  fr: /^\+33 \d{1} \d{3} \d{3} \d{3}$/, // France: +33 1 234 567 890
  br: /^\+55 \(\d{2}\) \d{4}\d{4}$/, // Brazil: +55 (11) 9876-5432
  mx: /^\+52 \d{2} \d{4} \d{4}$/, // Mexico: +52 55 1234 5678
  jp: /^\+81 \(\d{2}\) \d{4}\d{4}$/, // Japan: +81 (03) 1234-5678
  kr: /^\+82 \(\d{2}\) \d{3}\d{4}$/, // South Korea: +82 (10) 123-4567
  za: /^\+27 \(\d{2}\) \d{3}\d{4}$/, // South Africa: +27 (21) 123-4567
  es: /^\+34 \d{9}$/, // Spain: +34 612 345 678
  it: /^\+39 \(\d{2}\) \d{4}\d{4}$/, // Italy: +39 (02) 1234-5678
  ru: /^\+7 \(\d{3}\) \d{3}\d{4}$/, // Russia: +7 (495) 123-4567
  cn: /^\+86 \(\d{2}\) \d{4}\d{4}$/, // China: +86 (10) 1234-5678
  ng: /^\+234 \d{10}$/, // Nigeria: +234 701 234 5678
  ae: /^\+971 \(\d{1}\) \d{3}\d{4}$/, // UAE: +971 (50) 123-4567
  sa: /^\+966 \(\d{2}\) \d{3}\d{4}$/, // Saudi Arabia: +966 (50) 123-4567
  cl: /^\+56 \(\d{2}\) \d{3}\d{4}$/, // Chile: +56 (9) 1234-5678
  ph: /^\+63 \(\d{2}\) \d{3}\d{4}$/, // Philippines: +63 (912) 345-6789
  ar: /^\+54 \(\d{2}\) \d{4}\d{4}$/, // Argentina: +54 (11) 1234-5678
};
export const supportedCountries = Object.keys(patterns);
export const formatPhoneNumber = (
  number: any,
  countryCode: any,
  dialCode: any
): string => {
  const rawNumber = number.replace(/\D/g, "");
  let localNumber = rawNumber;
  if (localNumber.startsWith(dialCode)) {
    localNumber = localNumber.slice(dialCode.length); // Remove dial code from the start of the number
  }
  switch (countryCode) {
    case "us":
    case "ca":
      return localNumber.length === 10
        ? `+${dialCode} ${localNumber.slice(0, 3)} ${localNumber.slice(
            3,
            6
          )} ${localNumber.slice(6)}`
        : rawNumber;
    case "gb":
      return localNumber.length === 10
        ? `+${dialCode} ${localNumber.slice(0, 4)} ${localNumber.slice(4)}`
        : rawNumber;
    case "in":
      return localNumber.length === 10
        ? `+${dialCode} ${localNumber.slice(0, 5)} ${localNumber.slice(5)}`
        : rawNumber;
    case "au":
      return localNumber.length === 9
        ? `+${dialCode} ${localNumber.slice(0, 4)} ${localNumber.slice(
            4,
            7
          )} ${localNumber.slice(7)}`
        : rawNumber;
    case "de":
      return localNumber.length === 11
        ? `+${dialCode} ${localNumber.slice(0, 4)} ${localNumber.slice(
            4,
            7
          )} ${localNumber.slice(7)}`
        : rawNumber;
    case "fr":
      return localNumber.length === 9
        ? `+${dialCode} ${localNumber.slice(0, 1)} ${localNumber.slice(
            1,
            4
          )} ${localNumber.slice(4, 7)} ${localNumber.slice(7)}`
        : rawNumber;
    case "br":
      return localNumber.length === 11
        ? `+${dialCode} (${localNumber.slice(0, 2)}) ${localNumber.slice(
            2,
            7
          )}-${localNumber.slice(7)}`
        : rawNumber;
    case "mx":
      return localNumber.length === 10
        ? `+${dialCode} ${localNumber.slice(0, 2)} ${localNumber.slice(
            2,
            6
          )}-${localNumber.slice(6)}`
        : rawNumber;
    case "jp":
      return localNumber.length === 11
        ? `+${dialCode} ${localNumber.slice(0, 3)}-${localNumber.slice(
            3,
            7
          )}-${localNumber.slice(7)}`
        : rawNumber;
    case "kr":
      return localNumber.length === 10
        ? `+${dialCode} ${localNumber.slice(0, 3)}-${localNumber.slice(
            3,
            7
          )}-${localNumber.slice(7)}`
        : rawNumber;
    case "za":
      return localNumber.length === 9
        ? `+${dialCode} ${localNumber.slice(0, 3)} ${localNumber.slice(
            3,
            6
          )}-${localNumber.slice(6)}`
        : rawNumber;
    case "es":
      return localNumber.length === 9
        ? `+${dialCode} ${localNumber.slice(0, 3)} ${localNumber.slice(
            3,
            6
          )} ${localNumber.slice(6)}`
        : rawNumber;
    case "it":
      return localNumber.length === 10
        ? `+${dialCode} ${localNumber.slice(0, 3)} ${localNumber.slice(
            3,
            6
          )} ${localNumber.slice(6)}`
        : rawNumber;
    case "ru":
      return localNumber.length === 10
        ? `+${dialCode} ${localNumber.slice(0, 3)} ${localNumber.slice(
            3,
            6
          )}-${localNumber.slice(6)}`
        : rawNumber;
    case "cn":
      return localNumber.length === 11
        ? `+${dialCode} ${localNumber.slice(0, 3)}-${localNumber.slice(
            3,
            7
          )}-${localNumber.slice(7)}`
        : rawNumber;
    case "ng":
      return localNumber.length === 10
        ? `+${dialCode} ${localNumber.slice(0, 3)} ${localNumber.slice(
            3,
            6
          )} ${localNumber.slice(6)}`
        : rawNumber;
    case "ae":
      return localNumber.length === 9
        ? `+${dialCode} ${localNumber.slice(0, 2)} ${localNumber.slice(
            2,
            5
          )} ${localNumber.slice(5)}`
        : rawNumber;
    case "sa":
      return localNumber.length === 9
        ? `+${dialCode} ${localNumber.slice(0, 3)} ${localNumber.slice(
            3,
            6
          )}-${localNumber.slice(6)}`
        : rawNumber;
    case "cl":
      return localNumber.length === 9
        ? `+${dialCode} ${localNumber.slice(0, 2)} ${localNumber.slice(
            2,
            5
          )} ${localNumber.slice(5)}`
        : rawNumber;
    default:
      return rawNumber; // Default case for unsupported countries
  }
};
