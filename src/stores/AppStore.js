import { types, getEnv } from "mobx-state-tree";
import points from "../points";

const Country = types.model("Country", {
  name: types.string,
  id: types.identifier
});

const AppStore = types
  .model("AppStore", {
    name: types.maybeNull(types.string),
    country: types.maybeNull(types.string),
    countries: types.array(Country)
  })
  .actions(self => ({
    register(name) {
      self.name = name;
      self.country = "uk";
    },
    updateCountries(countries) {
      self.countries = countries;
    },
    vote() {
      const givenPoints = points.map((p, i) => ({
        country: self.votableCountries[i].id,
        points: p
      }));
      getEnv(self).socket.send("points", givenPoints);
    }
  }))
  .views(self => ({
    get votableCountries() {
      return self.countries.filter(c => c.id !== self.country);
    }
  }));

export { AppStore };
