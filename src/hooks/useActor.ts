type UseActorResult = {
  actor: null;
  isFetching: boolean;
  error: null;
};

export function useActor(): UseActorResult {
  return {
    actor: null,
    isFetching: false,
    error: null,
  };
}

