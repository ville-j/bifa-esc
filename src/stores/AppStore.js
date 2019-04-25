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
    afterCreate() {
      self.socket.on("country", data => {
        if (data.length === 0) throw Error("no free countries left :(");
        self.setCountry(data);
      });
    },
    setCountry(country) {
      self.country = country;
    },
    register(name) {
      self.name = name;
      self.socket.send("register", { name });
    },
    updateCountries(countries) {
      self.countries = countries;
    },
    vote() {
      const givenPoints = points.map((p, i) => ({
        country: self.votableCountries[i].id,
        points: p
      }));
      self.socket.send("vote", {
        votingCountry: self.country,
        name: self.name,
        points: givenPoints
      });
    }
  }))
  .views(self => ({
    get votableCountries() {
      return self.countries.filter(c => c.id !== self.country);
    },
    get socket() {
      return getEnv(self).socket;
    }
  }));

export { AppStore };
