import { create } from 'zustand'

interface Props {
  modal: string
  setModal: (value: string) => void
  clearModal: () => void
}

const useModal = create<Props>()((set, get) => ({
  modal: '',
  setModal: value => {
    if (value === get().modal) {
      set({ modal: '' })
    } else {
      set({ modal: value })
    }
  },
  clearModal: () => set({ modal: '' })
}))

export default useModal
