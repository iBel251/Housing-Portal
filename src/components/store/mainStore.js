import { create } from "zustand";
import { devtools } from "zustand/middleware";

const useMainStore = create(
  devtools(
    (set) => ({
      userData: null,
      userHouse: null,
      favoriteHouses: null,
      totalHousePages: 0,
      refetchTrigger: false,
      recountTrigger: false,
      unreadMessageCount: 0,
      allHouses: null,
      last: null,
      activeLink: "home",

      setUserData: (data) => set({ userData: data }),
      setUserHouse: (data) => set({ userHouse: data }),
      setFavoriteHouses: (data) => set({ favoriteHouses: data }),
      setTotalHousePages: (data) => set({ totalHousePages: data }),
      toggleRefetch: () =>
        set((state) => ({ refetchTrigger: !state.refetchTrigger })),
      toggleRecount: () =>
        set((state) => ({ recountTrigger: !state.recountTrigger })),
      setUnreadMessageCount: (count) => set({ unreadMessageCount: count }),
      setAllHouses: (houses) => set({ allHouses: houses }),
      setActiveLink: (link) => set({ activeLink: link }),
    }),
    "MainStore"
  )
);

const persistData = (store) => {
  const { name } = store;

  const persistedData = localStorage.getItem(name);

  if (persistedData) {
    store.setState(JSON.parse(persistedData));
  }

  store.subscribe((snapshot) => {
    localStorage.setItem(name, JSON.stringify(snapshot));
  });
};

persistData(useMainStore);

export default useMainStore;
