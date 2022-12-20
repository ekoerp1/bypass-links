import create from 'zustand';
import { IUpdateTaggedPerson } from '@bypass/shared/components/Persons/interfaces/persons';

interface State {
  updateTaggedUrls: IUpdateTaggedPerson[] | null;
  updateTaggedPersonUrls: (data: IUpdateTaggedPerson[]) => void;
}

const usePersonStore = create<State>()((set) => ({
  updateTaggedUrls: null,
  updateTaggedPersonUrls: (data) => set(() => ({ updateTaggedUrls: data })),
}));

export default usePersonStore;
