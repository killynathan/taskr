import * as React from "react";

export default function usePersistedState(key, defaultValue) {
  const initialState = JSON.parse(localStorage.getItem(key)) || defaultValue;
  // const initialState = defaultValue;
  const [state, setState] = React.useState(() => {
    return initialState;
  });

  React.useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState];
}
