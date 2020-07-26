import ReactGA from "react-ga";

export const initGA = () => {
  console.log(process.env.ANALYTICS_ID);
  ReactGA.initialize(process.env.ANALYTICS_ID);
};

export const logPageView = () => {
  ReactGA.set({ page: window.location.pathname });
  ReactGA.pageview(window.location.pathname);
};
