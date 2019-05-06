import { types, getEnv } from "mobx-state-tree";
import points from "../points";

const Country = types.model("Country", {
  name: types.string,
  id: types.identifier
});

const Points = types.model("Points", {
  votingCountry: types.string,
  name: types.string,
  points: types.array(types.frozen())
});

const AppStore = types
  .model("AppStore", {
    name: types.maybeNull(types.string),
    country: types.maybeNull(types.string),
    countries: types.array(Country),
    standings: types.array(Points),
    queue: types.array(Points),
    activeCountry: types.maybeNull(
      types.frozen({
        name: "",
        country: ""
      })
    )
  })
  .actions(self => ({
    afterCreate() {
      self.socket.on("country", data => {
        if (data.length === 0) throw Error("no free countries left :(");
        self.setCountry(data);
      });

      self.socket.on("getvotes", data => {
        console.log(data);
        self.setQueue(data);
      });

      self.socket.on("applyvotes", data => {
        console.log(data);
        self.updateStandings(data);
      });

      self.socket.instance().onopen = () => {
        self.socket.send("getvotes");
      };
    },
    updateStandings(data) {
      const index = self.standings.findIndex(
        s => s.votingCountry === data.votingCountry
      );

      if (index > -1) self.standings[index] = data;
      else self.standings.push(data);
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
    setQueue(queue) {
      self.queue = queue;
    },
    applyVotes(data) {
      console.log(data);
      self.socket.send("applyvotes", data);
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
