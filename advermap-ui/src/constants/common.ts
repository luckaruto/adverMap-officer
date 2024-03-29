// INFO: String,[aA-zZ]+[0-9]+[~!@#$%^&*()_+`-=[]\;',./{}|:"<>?], min: 6 chars, max: 12 chars
export const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[~!@#$%^&*()_+`\-=[\]\\;',.\/{}|:"<>?]).{6,12}$/

const PHONE_PATTERN = /(84|0[3|5|7|8|9])+([0-9]{8})\b/g;
