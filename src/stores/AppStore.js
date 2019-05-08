import { types, getEnv } from "mobx-state-tree";
import points from "../points";
import countries from "../countries";

const Country = types.model("Country", {
  name: types.string,
  id: types.identifier,
  ord: types.number
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
    ),
    activeVotes: types.array(types.frozen()),
    confirmVotes: types.optional(types.boolean, false)
  })
  .volatile(self => ({
    splash: types.optional(types.boolean, true)
  }))
  .actions(self => ({
    afterCreate() {
      self.socket.on("country", data => {
        if (data.length === 0) throw Error("no free countries left :(");
        self.setCountry(data);
      });

      self.socket.on("getvotes", data => {
        //console.log(data);
        self.setQueue(data);
      });

      self.socket.on("applyvotes", data => {
        //console.log(data);
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

      self.activeVotes = data.points;

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
    setSplash(bool) {
      self.splash = bool;
    },
    setConfirmVotes(bool) {
      self.confirmVotes = bool;
    },
    updateCountries(countries) {
      self.countries = countries;
    },
    setQueue(queue) {
      self.queue = queue;
    },
    applyVotes(data, removeCount) {
      let d = { ...data, points: [...data.points] };

      d.points.splice(0, removeCount);
      self.socket.send("applyvotes", d);
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
    },
    get totalStandings() {
      return countries
        .map(c => {
          const points = self.standings.map(s => {
            return s.points.filter(p => p.country === c.id).map(p => p.points);
          });
          const totalPoints = points.reduce((acc, cur) => {
            acc += cur[0] ? cur[0] : 0;
            return acc;
          }, 0);
          return { ...c, points: totalPoints };
        })
        .sort((a, b) => {
          return b.points - a.points;
        });
    }
  }));

export { AppStore };
