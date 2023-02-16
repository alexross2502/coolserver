const { Towns } = require("./Towns");
const { Masters } = require("./Masters");
const { Reservation } = require("./Reservation");

Towns.hasMany(Masters, {
  sourceKey: "name",
  foreignKey: "townName",
  constraints: false,
});

Masters.hasOne(Towns, {
  constraints: false,
});

Masters.hasMany(Reservation, {
  sourceKey: "id",
  foreignKey: "master_id",
  constraints: false,
});

Reservation.hasOne(Masters, {
  constraints: false,
});

Towns.hasMany(Reservation, {
  sourceKey: "id",
  foreignKey: "towns_id",
  constraints: false,
});

Towns.hasOne(Masters, {
  constraints: false,
});
