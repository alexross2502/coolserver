////// Настройки для размера часов

export const timeSize = {
  small: 1,
  medium: 3,
  large: 5,
};

export const transporterCredentials = {
  host: process.env.POST_HOST,
  auth: {
    user: process.env.POST_EMAIL,
    pass: process.env.POST_PASSWORD,
  },
};
